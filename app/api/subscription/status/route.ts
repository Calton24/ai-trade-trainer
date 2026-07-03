import { NextResponse } from "next/server"

import { requireAuth } from "@/lib/api/auth-guard"
import { fetchActiveAdminGrant } from "@/lib/data/admin-grant-service"
import { fetchUserSubscription } from "@/lib/data/subscription-service"
import { getBillingStatus } from "@/lib/subscription/server"
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin"

function freeBillingFallback() {
  return {
    planLabel: "Free",
    statusLabel: "Inactive",
    isPro: false,
    source: "free" as const,
    currentPeriodEnd: null,
    grantExpiresAt: null,
    grantReason: null,
    cancelAtPeriodEnd: false,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    canManageStripe: false,
    sourceLabel: null,
    subscription: null,
    adminGrant: null,
    proSource: "none" as const,
  }
}

/**
 * Trusted billing / entitlement read for the signed-in user.
 *
 * Uses service-role when available, and always falls back to the
 * request-scoped user client (same path as middleware Pro gating).
 * Never throws an unhandled exception to the client.
 */
export async function GET() {
  try {
    const authResult = await requireAuth()
    if (!authResult.ok) return authResult.response

    const { user, supabase } = authResult

    let admin = null
    if (isAdminConfigured()) {
      try {
        admin = createAdminClient()
      } catch (error) {
        console.error("[billing/status] admin client failed", error)
      }
    }

    const [rawSubAdmin, rawGrantAdmin, rawSubUser, rawGrantUser] =
      await Promise.all([
        admin
          ? fetchUserSubscription(admin, user.id).catch((error) => {
              console.error("[billing/status] admin subscription fetch", error)
              return null
            })
          : Promise.resolve(null),
        admin
          ? fetchActiveAdminGrant(admin, user.id).catch((error) => {
              console.error("[billing/status] admin grant fetch", error)
              return null
            })
          : Promise.resolve(null),
        fetchUserSubscription(supabase, user.id).catch((error) => {
          console.error("[billing/status] user subscription fetch", error)
          return null
        }),
        fetchActiveAdminGrant(supabase, user.id).catch((error) => {
          console.error("[billing/status] user grant fetch", error)
          return null
        }),
      ])

    console.log("[billing/status] user", {
      userId: user.id,
      email: user.email ?? null,
      adminConfigured: Boolean(admin),
    })
    console.log("[billing/status] subscription row", {
      admin: rawSubAdmin
        ? { plan: rawSubAdmin.plan, status: rawSubAdmin.status }
        : null,
      user: rawSubUser
        ? { plan: rawSubUser.plan, status: rawSubUser.status }
        : null,
    })
    console.log("[billing/status] grant row", {
      admin: rawGrantAdmin
        ? {
            id: rawGrantAdmin.id,
            status: rawGrantAdmin.status,
            expiresAt: rawGrantAdmin.expiresAt,
            revokedAt: rawGrantAdmin.revokedAt,
            reason: rawGrantAdmin.reason,
          }
        : null,
      user: rawGrantUser
        ? {
            id: rawGrantUser.id,
            status: rawGrantUser.status,
            expiresAt: rawGrantUser.expiresAt,
            revokedAt: rawGrantUser.revokedAt,
            reason: rawGrantUser.reason,
          }
        : null,
    })

    const billing = await getBillingStatus(user.id, supabase)

    console.log("[billing/status] final result", {
      source: billing.source,
      planLabel: billing.planLabel,
      statusLabel: billing.statusLabel,
      isPro: billing.isPro,
      grantExpiresAt: billing.grantExpiresAt,
    })

    return NextResponse.json({
      billing,
      subscription: billing.subscription,
      adminGrant: billing.adminGrant,
      hasPro: billing.isPro,
      proSource: billing.proSource,
      userId: user.id,
    })
  } catch (error) {
    console.error("[billing/status] unhandled error", error)

    // Last-resort free payload so the Billing UI never hard-fails.
    const billing = freeBillingFallback()
    return NextResponse.json(
      {
        billing,
        subscription: null,
        adminGrant: null,
        hasPro: false,
        proSource: "none",
        userId: null,
        error: "Billing status temporarily unavailable.",
      },
      { status: 200 }
    )
  }
}
