import { NextResponse } from "next/server"
import type { User } from "@supabase/supabase-js"

import { getEntitlementStatus } from "@/lib/subscription/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server"

type ServerSupabaseClient = Awaited<ReturnType<typeof createServerSupabaseClient>>

export interface AuthContext {
  user: User
  supabase: ServerSupabaseClient
}

export type GuardResult =
  | ({ ok: true } & AuthContext)
  | { ok: false; response: NextResponse }

function unauthorized(message: string) {
  return NextResponse.json({ error: message }, { status: 401 })
}

function forbidden(message: string) {
  return NextResponse.json(
    { error: message, upgradeUrl: "/pricing?upgrade=1" },
    { status: 403 }
  )
}

/**
 * Route-handler guard: requires a signed-in Supabase user. Never trusts
 * client-supplied identity — always re-verifies against the request's
 * session cookies via `supabase.auth.getUser()`.
 */
export async function requireAuth(): Promise<GuardResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Supabase is not configured." },
        { status: 501 }
      ),
    }
  }

  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, response: unauthorized("Authentication required.") }
  }

  return { ok: true, user, supabase }
}

/**
 * Route-handler guard: requires a signed-in user with an active Pro
 * subscription (server-verified via service-role `user_subscriptions` lookup —
 * never trusts client-reported subscription state).
 */
export async function requireProUser(): Promise<GuardResult> {
  const authResult = await requireAuth()
  if (!authResult.ok) return authResult

  const entitlement = await getEntitlementStatus(
    authResult.user.id,
    authResult.supabase
  )

  if (!entitlement.hasPro) {
    return { ok: false, response: forbidden("Pro subscription required.") }
  }

  return authResult
}
