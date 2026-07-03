import type { SupabaseClient } from "@supabase/supabase-js"
import type Stripe from "stripe"

import type { ReferralCapture } from "./types"

interface PartnerRow {
  id: string
  name: string
  slug: string
  promo_code: string
  commission_percent: number
  status: string
  created_at: string
}

export async function resolveReferralPartner(
  admin: SupabaseClient,
  input: { promoCode?: string | null; partnerSlug?: string | null }
) {
  const promo = input.promoCode?.trim().toUpperCase()
  const slug = input.partnerSlug?.trim().toLowerCase()

  if (!promo && !slug) return null

  let query = admin
    .from("referral_partners")
    .select("*")
    .eq("status", "active")

  if (promo) {
    query = query.eq("promo_code", promo)
  } else if (slug) {
    query = query.eq("slug", slug)
  }

  const { data, error } = await query.maybeSingle()
  if (error || !data) return null
  return data as PartnerRow
}

export async function attributeReferralOnSignup(
  admin: SupabaseClient,
  userId: string,
  capture: ReferralCapture
): Promise<{ ok: boolean; error?: string }> {
  const partner = await resolveReferralPartner(admin, {
    promoCode: capture.promoCode,
    partnerSlug: capture.partnerSlug,
  })

  if (!partner) {
    return { ok: false, error: "Invalid or inactive referral." }
  }

  const { data: existing } = await admin
    .from("referral_attributions")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle()

  if (existing) return { ok: true }

  const now = new Date().toISOString()
  const { error } = await admin.from("referral_attributions").insert({
    user_id: userId,
    partner_id: partner.id,
    promo_code: partner.promo_code,
    source_url: capture.landingUrl,
    first_seen_at: capture.firstSeenAt,
    signed_up_at: now,
    commission_percent: partner.commission_percent,
  })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

function amountGbpFromStripe(
  session: Stripe.Checkout.Session,
  subscription: Stripe.Subscription
): number | null {
  const amount =
    session.amount_total ??
    subscription.items.data[0]?.price?.unit_amount ??
    null
  if (typeof amount !== "number") return null
  return Math.round((amount / 100) * 100) / 100
}

export async function recordReferralConversion(
  admin: SupabaseClient,
  userId: string,
  session: Stripe.Checkout.Session,
  subscription: Stripe.Subscription
): Promise<void> {
  const { data: attribution } = await admin
    .from("referral_attributions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  if (!attribution || attribution.converted_at) return

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null

  const plan =
    session.metadata?.plan ??
    subscription.metadata?.plan ??
    subscription.items.data[0]?.price?.nickname ??
    null

  const amountGbp = amountGbpFromStripe(session, subscription)
  const commissionPercent = Number(attribution.commission_percent ?? 50)
  const commissionDueGbp =
    amountGbp != null
      ? Math.round(amountGbp * (commissionPercent / 100) * 100) / 100
      : null

  await admin
    .from("referral_attributions")
    .update({
      converted_at: new Date().toISOString(),
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      plan,
      amount_gbp: amountGbp,
      commission_due_gbp: commissionDueGbp,
    })
    .eq("user_id", userId)
}
