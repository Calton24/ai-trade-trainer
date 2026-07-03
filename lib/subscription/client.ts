import type { AdminGrant } from "@/lib/subscription/admin-grant-types"
import type { ProAccessSource } from "@/lib/subscription/access"
import type { UserSubscription } from "./types"

export interface SubscriptionStatusResponse {
  subscription: UserSubscription | null
  adminGrant: AdminGrant | null
  hasPro: boolean
  proSource: ProAccessSource
  userId: string
}

/** Browser-safe fetch of the server-verified subscription row. */
export async function fetchSubscriptionStatus(): Promise<SubscriptionStatusResponse | null> {
  try {
    const res = await fetch("/api/subscription/status", {
      cache: "no-store",
      credentials: "same-origin",
    })
    if (!res.ok) return null
    return (await res.json()) as SubscriptionStatusResponse
  } catch {
    return null
  }
}
