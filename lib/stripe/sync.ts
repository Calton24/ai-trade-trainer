import type { SupabaseClient } from "@supabase/supabase-js"
import type Stripe from "stripe"

import type { SubscriptionStatus } from "@/lib/subscription/types"
import { getPlanFromPriceId, isPaidPlanId } from "./config"

/** Map Stripe's subscription lifecycle onto our internal status enum. */
export function mapStripeStatus(
  status: Stripe.Subscription.Status
): SubscriptionStatus {
  switch (status) {
    case "active":
    case "past_due": // Stripe is still retrying — keep access during grace period
      return "active"
    case "trialing":
      return "trialing"
    case "canceled":
      return "cancelled"
    case "unpaid":
    case "incomplete_expired":
      return "expired"
    case "incomplete":
    case "paused":
    default:
      return "inactive"
  }
}

function toIso(unixSeconds: number | null | undefined): string | null {
  return typeof unixSeconds === "number"
    ? new Date(unixSeconds * 1000).toISOString()
    : null
}

/** Resolve Supabase user id from Stripe metadata (supports legacy key names). */
export function resolveUserIdFromMetadata(
  metadata: Stripe.Metadata | null | undefined
): string | null {
  if (!metadata) return null
  return metadata.supabase_user_id ?? metadata.user_id ?? null
}

/**
 * Resolve the Supabase user for a checkout session — metadata first, then
 * customer-id lookup in `user_subscriptions`.
 */
export async function resolveUserIdFromCheckoutSession(
  admin: SupabaseClient,
  session: Stripe.Checkout.Session
): Promise<string | null> {
  const fromMetadata = resolveUserIdFromMetadata(session.metadata)
  if (fromMetadata) return fromMetadata

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id

  if (customerId) {
    return findUserIdForCustomer(admin, customerId)
  }

  return null
}

function planFromSubscription(subscription: Stripe.Subscription): string {
  const item = subscription.items.data[0]
  const priceId = item?.price?.id
  const fromPrice = getPlanFromPriceId(priceId)
  if (fromPrice) return fromPrice

  const fromMetadata = subscription.metadata?.plan
  if (fromMetadata && isPaidPlanId(fromMetadata)) return fromMetadata

  return "free"
}

/**
 * Upsert `user_subscriptions` from a Stripe Subscription object.
 * Called from the webhook handler using the service-role admin client (bypasses RLS).
 */
export async function upsertSubscriptionFromStripe(
  admin: SupabaseClient,
  userId: string,
  subscription: Stripe.Subscription
): Promise<{ error?: string }> {
  const item = subscription.items.data[0]
  const plan = planFromSubscription(subscription)
  const status = mapStripeStatus(subscription.status)
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id

  const { error } = await admin.from("user_subscriptions").upsert(
    {
      user_id: userId,
      plan,
      status,
      current_period_start: toIso(item?.current_period_start),
      current_period_end: toIso(item?.current_period_end),
      provider: "stripe",
      provider_customer_id: customerId,
      provider_subscription_id: subscription.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )

  if (error) return { error: error.message }

  if (process.env.NODE_ENV === "development") {
    console.debug("[stripe/sync] upserted subscription", {
      userId,
      plan,
      status,
      customerId,
      subscriptionId: subscription.id,
      periodEnd: toIso(item?.current_period_end),
    })
  }

  return {}
}

/** Downgrade a user to free/cancelled when their Stripe subscription is deleted. */
export async function markSubscriptionCancelled(
  admin: SupabaseClient,
  userId: string,
  subscription: Stripe.Subscription
): Promise<{ error?: string }> {
  const { error } = await admin
    .from("user_subscriptions")
    .update({
      status: "cancelled",
      provider: "stripe",
      provider_subscription_id: subscription.id,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)

  if (error) return { error: error.message }
  return {}
}

/** Look up the Supabase user_id for a Stripe customer/subscription (metadata first, then DB fallback). */
export async function findUserIdForCustomer(
  admin: SupabaseClient,
  customerId: string
): Promise<string | null> {
  const { data } = await admin
    .from("user_subscriptions")
    .select("user_id")
    .eq("provider_customer_id", customerId)
    .maybeSingle()

  return data?.user_id ?? null
}
