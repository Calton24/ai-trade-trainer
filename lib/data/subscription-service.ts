import type { SupabaseClient } from "@supabase/supabase-js"

import type {
  SubscriptionPlan,
  SubscriptionProvider,
  SubscriptionStatus,
  UserSubscription,
} from "@/lib/subscription/types"

interface SubscriptionRow {
  id: string
  user_id: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  provider: SubscriptionProvider
  provider_customer_id: string | null
  provider_subscription_id: string | null
  created_at: string
  updated_at: string
}

function mapRow(row: SubscriptionRow): UserSubscription {
  return {
    id: row.id,
    userId: row.user_id,
    plan: row.plan,
    status: row.status,
    currentPeriodStart: row.current_period_start,
    currentPeriodEnd: row.current_period_end,
    provider: row.provider,
    providerCustomerId: row.provider_customer_id,
    providerSubscriptionId: row.provider_subscription_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function fetchUserSubscription(
  supabase: SupabaseClient,
  userId: string
): Promise<UserSubscription | null> {
  const { data, error } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[subscription] fetch failed", {
        userId,
        message: error.message,
        code: error.code,
      })
    }
    return null
  }

  if (!data) return null
  return mapRow(data as SubscriptionRow)
}

// Note: a `setTestSubscription()` dev/test helper used to live here. It let
// any caller upsert `user_subscriptions` (plan/status/period) using
// whichever Supabase client was passed in, with no environment guard. It
// was never wired to a route (dead code), but as of migration 015
// `authenticated` has no write privilege on `user_subscriptions` at all, so
// re-adding an equivalent helper would require the service-role admin
// client and an explicit non-production guard. Deleted rather than fixed
// in place — see docs/database-v1.md Part 5 / Part 10 (Critical #3).
