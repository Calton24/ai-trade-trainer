import { PLAN_IDS, type PaidPlanId } from "@/lib/pricing/plans"

/**
 * Stripe products/prices config — subscription mode only.
 * Weekly / 6-Month / Annual. No lifetime, no enterprise/SSO tier.
 */
const PRICE_ENV: Record<PaidPlanId, string | undefined> = {
  weekly: process.env.STRIPE_WEEKLY_PRICE_ID,
  six_month: process.env.STRIPE_SIX_MONTH_PRICE_ID,
  annual: process.env.STRIPE_ANNUAL_PRICE_ID,
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}

/** Checkout sessions require a Price ID (`price_…`), not a Product ID (`prod_…`). */
export function isValidStripePriceId(value: string | undefined): value is string {
  return Boolean(value && value.startsWith("price_"))
}

export function isPlanCheckoutConfigured(plan: PaidPlanId): boolean {
  return isStripeConfigured() && isValidStripePriceId(PRICE_ENV[plan])
}

const PLAN_PRICE_ENV_KEYS: Record<PaidPlanId, string> = {
  weekly: "STRIPE_WEEKLY_PRICE_ID",
  six_month: "STRIPE_SIX_MONTH_PRICE_ID",
  annual: "STRIPE_ANNUAL_PRICE_ID",
}

/** Human-readable list of env vars still needed for checkout on a given plan. */
export function getMissingCheckoutEnvVars(plan: PaidPlanId): string[] {
  const missing: string[] = []
  if (!isStripeConfigured()) missing.push("STRIPE_SECRET_KEY")
  if (!PRICE_ENV[plan]) missing.push(PLAN_PRICE_ENV_KEYS[plan])
  return missing
}

/**
 * Returns a user-facing error when a plan env var is set but not to a valid
 * Price ID — most commonly a Product ID (`prod_…`) was pasted by mistake.
 */
export function getStripePriceIdValidationError(plan: PaidPlanId): string | null {
  const raw = PRICE_ENV[plan]
  if (!raw) return null

  const envKey = PLAN_PRICE_ENV_KEYS[plan]
  if (raw.startsWith("prod_")) {
    return (
      `${envKey} is set to a Stripe Product ID (${raw}), but checkout requires ` +
      `a Price ID starting with price_. In Stripe Dashboard → Products → ` +
      `open the product → under Pricing, copy the Price ID (not the Product ID).`
    )
  }
  if (!raw.startsWith("price_")) {
    return `${envKey} must be a Stripe Price ID starting with price_.`
  }
  return null
}

export function getStripePriceId(plan: PaidPlanId): string | null {
  const raw = PRICE_ENV[plan]
  return isValidStripePriceId(raw) ? raw : null
}

/** Reverse-lookup: map a Stripe Price ID back to our internal plan slug. */
export function getPlanFromPriceId(
  priceId: string | null | undefined
): PaidPlanId | null {
  if (!priceId) return null
  for (const id of Object.values(PLAN_IDS)) {
    if (PRICE_ENV[id] && PRICE_ENV[id] === priceId) return id
  }
  return null
}

export function isPaidPlanId(value: string): value is PaidPlanId {
  return (Object.values(PLAN_IDS) as string[]).includes(value)
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
}

export function isStripeWebhookConfigured(): boolean {
  return Boolean(process.env.STRIPE_WEBHOOK_SECRET)
}
