import type { AdminGrant } from "@/lib/subscription/admin-grant-types"
import type { ProAccessSource } from "@/lib/subscription/access"
import type { UserSubscription } from "./types"

export type BillingSource = "stripe" | "admin_grant" | "dev_unlock" | "free"

export interface BillingStatus {
  planLabel: string
  statusLabel: string
  isPro: boolean
  source: BillingSource
  currentPeriodEnd: string | null
  grantExpiresAt: string | null
  grantReason: string | null
  cancelAtPeriodEnd: boolean
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  canManageStripe: boolean
  sourceLabel: string | null
  subscription: UserSubscription | null
  adminGrant: AdminGrant | null
  proSource: ProAccessSource
}

export interface SubscriptionStatusResponse {
  billing: BillingStatus
  subscription: UserSubscription | null
  adminGrant: AdminGrant | null
  hasPro: boolean
  proSource: ProAccessSource
  userId: string
}

/** Browser-safe fetch of the server-verified billing / entitlement snapshot. */
export async function fetchSubscriptionStatus(): Promise<SubscriptionStatusResponse | null> {
  try {
    const res = await fetch("/api/subscription/status", {
      cache: "no-store",
      credentials: "same-origin",
    })
    const data = (await res.json().catch(() => null)) as
      | SubscriptionStatusResponse
      | null
    if (!data?.billing) {
      console.error("[billing] status response missing billing", {
        status: res.status,
        data,
      })
      return null
    }
    return data
  } catch (error) {
    console.error("[billing] status fetch failed", error)
    return null
  }
}
