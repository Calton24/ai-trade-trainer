/**
 * Stripe checkout helpers — wire up when STRIPE_SECRET_KEY is configured.
 *
 * Install: npm install stripe @stripe/stripe-js
 *
 * Pro plan: price ID from Stripe Dashboard → Products
 * Lifetime plan: one-time price ID
 *
 * Example checkout session creation (API route):
 *
 * import Stripe from "stripe"
 * const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
 *
 * const session = await stripe.checkout.sessions.create({
 *   mode: "subscription", // or "payment" for lifetime
 *   line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
 *   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
 *   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=cancelled`,
 * })
 */

export const STRIPE_PRICE_IDS = {
  pro: process.env.STRIPE_PRO_PRICE_ID ?? "price_pro_placeholder",
  lifetime: process.env.STRIPE_LIFETIME_PRICE_ID ?? "price_lifetime_placeholder",
} as const
