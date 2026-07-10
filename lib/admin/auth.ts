import { redirect } from "next/navigation"

import { isAdminConfigured, isAdminEmail } from "@/lib/admin/config"
import { createClientIfConfigured } from "@/lib/supabase/server"

export type AdminGateResult =
  | { ok: true; email: string }
  | { ok: false; reason: "no_auth" | "not_configured" | "forbidden" }

/** Server-only admin gate for admin pages. */
export async function requireAdmin(): Promise<AdminGateResult> {
  if (!isAdminConfigured()) {
    return { ok: false, reason: "not_configured" }
  }

  const supabase = await createClientIfConfigured()
  if (!supabase) {
    return { ok: false, reason: "no_auth" }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return { ok: false, reason: "no_auth" }
  }

  if (!isAdminEmail(user.email)) {
    return { ok: false, reason: "forbidden" }
  }

  return { ok: true, email: user.email }
}

export async function requireAdminOrRedirect(redirectTo = "/dashboard") {
  const gate = await requireAdmin()
  if (!gate.ok) {
    if (gate.reason === "no_auth") {
      redirect(`/sign-in?redirect=${encodeURIComponent("/admin/scenario-builder")}`)
    }
    redirect(redirectTo)
  }
  return gate
}
