import { NextResponse } from "next/server"

import { requireAuth } from "@/lib/api/auth-guard"
import { getEntitlementStatus } from "@/lib/subscription/server"

/**
 * Trusted subscription read for the signed-in user.
 *
 * Uses the service-role client server-side (same path as the Stripe webhook
 * write) so billing UI and post-checkout polling are not blocked by RLS or
 * browser-session quirks on direct `user_subscriptions` reads.
 */
export async function GET() {
  const authResult = await requireAuth()
  if (!authResult.ok) return authResult.response

  const { user } = authResult
  const entitlement = await getEntitlementStatus(user.id)

  if (process.env.NODE_ENV === "development") {
    console.debug("[subscription/status]", {
      userId: user.id,
      plan: entitlement.subscription?.plan ?? "free",
      status: entitlement.subscription?.status ?? "inactive",
      hasPro: entitlement.hasPro,
      proSource: entitlement.proSource,
      adminGrantExpiresAt: entitlement.adminGrant?.expiresAt ?? null,
    })
  }

  return NextResponse.json({
    subscription: entitlement.subscription,
    adminGrant: entitlement.adminGrant,
    hasPro: entitlement.hasPro,
    proSource: entitlement.proSource,
    userId: user.id,
  })
}
