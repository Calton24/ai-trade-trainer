import type { SupabaseClient } from "@supabase/supabase-js"

import { fetchActiveAdminGrant } from "@/lib/data/admin-grant-service"
import { fetchUserSubscription } from "@/lib/data/subscription-service"
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin"
import {
  hasActiveAdminGrant,
  planLabel,
  resolveProAccessSource,
  statusLabel,
  type ProAccessSource,
} from "./access"
import type { AdminGrant } from "./admin-grant-types"
import type { UserSubscription } from "./types"

/**
 * Prefer service-role (bypasses RLS). Fall back to the request-scoped user
 * client — same path middleware uses for Pro gating — so billing stays in
 * sync when admin grants are readable via owner SELECT policy.
 */
async function resolveClients(userClient?: SupabaseClient) {
  let admin = null
  if (isAdminConfigured()) {
    try {
      admin = createAdminClient()
    } catch (error) {
      console.error("[billing] admin client unavailable", error)
    }
  }
  return {
    subscriptionClient: admin ?? userClient ?? null,
    grantClient: admin ?? userClient ?? null,
    usingAdmin: Boolean(admin),
  }
}

export async function getSubscriptionStatus(
  userId: string,
  userClient?: SupabaseClient
): Promise<UserSubscription | null> {
  const { subscriptionClient } = await resolveClients(userClient)
  if (!subscriptionClient) return null
  return fetchUserSubscription(subscriptionClient, userId)
}

export async function getActiveAdminGrant(
  userId: string,
  userClient?: SupabaseClient
): Promise<AdminGrant | null> {
  const { grantClient } = await resolveClients(userClient)
  if (!grantClient) return null
  const grant = await fetchActiveAdminGrant(grantClient, userId)
  return hasActiveAdminGrant(grant) ? grant : null
}

export interface EntitlementStatus {
  subscription: UserSubscription | null
  adminGrant: AdminGrant | null
  hasPro: boolean
  proSource: ProAccessSource
}

export async function getEntitlementStatus(
  userId: string,
  userClient?: SupabaseClient
): Promise<EntitlementStatus> {
  const [subscription, adminGrant] = await Promise.all([
    getSubscriptionStatus(userId, userClient),
    getActiveAdminGrant(userId, userClient),
  ])

  const proSource = resolveProAccessSource(subscription, adminGrant)

  return {
    subscription,
    adminGrant,
    hasPro: proSource !== "none",
    proSource,
  }
}

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

function toBillingStatus(entitlement: EntitlementStatus): BillingStatus {
  const { subscription, adminGrant, hasPro, proSource } = entitlement

  if (proSource === "stripe" && subscription) {
    return {
      planLabel: planLabel(subscription.plan),
      statusLabel: statusLabel(subscription.status),
      isPro: true,
      source: "stripe",
      currentPeriodEnd: subscription.currentPeriodEnd,
      grantExpiresAt: null,
      grantReason: null,
      cancelAtPeriodEnd: subscription.status === "cancelled",
      stripeCustomerId: subscription.providerCustomerId,
      stripeSubscriptionId: subscription.providerSubscriptionId,
      canManageStripe: Boolean(subscription.providerCustomerId),
      sourceLabel: null,
      subscription,
      adminGrant,
      proSource,
    }
  }

  if (proSource === "admin_grant" && adminGrant) {
    return {
      planLabel: "Beta Pro",
      statusLabel: "Active",
      isPro: true,
      source: "admin_grant",
      currentPeriodEnd: null,
      grantExpiresAt: adminGrant.expiresAt,
      grantReason: adminGrant.reason,
      cancelAtPeriodEnd: false,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      canManageStripe: false,
      sourceLabel: "Private beta access",
      subscription,
      adminGrant,
      proSource,
    }
  }

  if (proSource === "dev_unlock") {
    return {
      planLabel: "Dev Pro",
      statusLabel: "Active",
      isPro: true,
      source: "dev_unlock",
      currentPeriodEnd: null,
      grantExpiresAt: null,
      grantReason: null,
      cancelAtPeriodEnd: false,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      canManageStripe: false,
      sourceLabel: "Local development unlock",
      subscription,
      adminGrant,
      proSource,
    }
  }

  return {
    planLabel: "Free",
    statusLabel: "Inactive",
    isPro: hasPro,
    source: "free",
    currentPeriodEnd: null,
    grantExpiresAt: null,
    grantReason: null,
    cancelAtPeriodEnd: false,
    stripeCustomerId: subscription?.providerCustomerId ?? null,
    stripeSubscriptionId: subscription?.providerSubscriptionId ?? null,
    canManageStripe: false,
    sourceLabel: null,
    subscription,
    adminGrant,
    proSource,
  }
}

/** Display-ready billing snapshot — same entitlement rules as route gating. */
export async function getBillingStatus(
  userId: string,
  userClient?: SupabaseClient
): Promise<BillingStatus> {
  const entitlement = await getEntitlementStatus(userId, userClient)
  return toBillingStatus(entitlement)
}

/** True if the given user currently has an active paid subscription (or dev bypass). */
export async function isProUser(
  userId: string,
  userClient?: SupabaseClient
): Promise<boolean> {
  const { hasPro } = await getEntitlementStatus(userId, userClient)
  return hasPro
}
