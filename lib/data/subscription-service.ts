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
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) return null
  return mapRow(data as SubscriptionRow)
}

/** Dev/test helper — activate a plan without Stripe. */
export async function setTestSubscription(
  supabase: SupabaseClient,
  userId: string,
  plan: SubscriptionPlan
): Promise<{ error?: string }> {
  const now = new Date()
  const periodEnd = new Date(now)
  if (plan === "weekly") periodEnd.setDate(periodEnd.getDate() + 7)
  else if (plan === "six_month") periodEnd.setMonth(periodEnd.getMonth() + 6)
  else if (plan === "annual") periodEnd.setFullYear(periodEnd.getFullYear() + 1)

  const { error } = await supabase.from("user_subscriptions").upsert(
    {
      user_id: userId,
      plan,
      status: plan === "free" ? "inactive" : "active",
      current_period_start: plan === "free" ? null : now.toISOString(),
      current_period_end: plan === "free" ? null : periodEnd.toISOString(),
      provider: "test",
      updated_at: now.toISOString(),
    },
    { onConflict: "user_id" }
  )

  if (error) return { error: error.message }
  return {}
}
