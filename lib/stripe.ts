/**
 * Stripe checkout helpers — wire up when STRIPE_SECRET_KEY is configured.
 *
 * Install: npm install stripe @stripe/stripe-js
 *
 * Plans: weekly, 6-month, annual (subscription mode only — no lifetime).
 */

import { STRIPE_PRICE_PLACEHOLDERS } from "@/lib/pricing/plans"

export const STRIPE_PRICE_IDS = STRIPE_PRICE_PLACEHOLDERS

export type StripeCheckoutPlan = keyof typeof STRIPE_PRICE_IDS

/**
 * Placeholder checkout action — implement in /api/checkout when Stripe is ready.
 */
export async function createCheckoutSessionPlaceholder(
  _plan: StripeCheckoutPlan
): Promise<{ url: string | null; error?: string }> {
  return {
    url: null,
    error: "Stripe checkout is not configured yet.",
  }
}
