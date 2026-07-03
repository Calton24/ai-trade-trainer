import { fetchActiveAdminGrant } from "@/lib/data/admin-grant-service"
import { fetchUserSubscription } from "@/lib/data/subscription-service"
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin"
import {
  hasProAccess,
  resolveProAccessSource,
  type ProAccessSource,
} from "./access"
import type { AdminGrant } from "./admin-grant-types"
import type { UserSubscription } from "./types"

/**
 * Server-only subscription lookups (route handlers, server components,
 * server actions). Uses the service-role client so it works regardless of
 * request cookies/session context.
 */
export async function getSubscriptionStatus(
  userId: string
): Promise<UserSubscription | null> {
  if (!isAdminConfigured()) return null
  const admin = createAdminClient()
  return fetchUserSubscription(admin, userId)
}

export async function getActiveAdminGrant(
  userId: string
): Promise<AdminGrant | null> {
  if (!isAdminConfigured()) return null
  const admin = createAdminClient()
  return fetchActiveAdminGrant(admin, userId)
}

export interface EntitlementStatus {
  subscription: UserSubscription | null
  adminGrant: AdminGrant | null
  hasPro: boolean
  proSource: ProAccessSource
}

export async function getEntitlementStatus(
  userId: string
): Promise<EntitlementStatus> {
  const [subscription, adminGrant] = await Promise.all([
    getSubscriptionStatus(userId),
    getActiveAdminGrant(userId),
  ])

  const proSource = resolveProAccessSource(subscription, adminGrant)

  return {
    subscription,
    adminGrant,
    hasPro: proSource !== "none",
    proSource,
  }
}

/** True if the given user currently has an active paid subscription (or dev bypass). */
export async function isProUser(userId: string): Promise<boolean> {
  const { hasPro } = await getEntitlementStatus(userId)
  return hasPro
}
