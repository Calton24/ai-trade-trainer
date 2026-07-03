import { NextResponse } from "next/server"

import { requireAuth } from "@/lib/api/auth-guard"
import { attributeReferralOnSignup } from "@/lib/referral/server"
import type { ReferralCapture } from "@/lib/referral/types"
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Referral attribution is not configured." },
      { status: 501 }
    )
  }

  const authResult = await requireAuth()
  if (!authResult.ok) return authResult.response

  let body: ReferralCapture
  try {
    body = (await request.json()) as ReferralCapture
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  if (!body.promoCode && !body.partnerSlug) {
    return NextResponse.json(
      { error: "promoCode or partnerSlug required." },
      { status: 400 }
    )
  }

  const admin = createAdminClient()
  const result = await attributeReferralOnSignup(
    admin,
    authResult.user.id,
    body
  )

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "Attribution failed." },
      { status: 400 }
    )
  }

  return NextResponse.json({ ok: true })
}
