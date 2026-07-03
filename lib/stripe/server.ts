import Stripe from "stripe"

let client: Stripe | null = null

/** Lazily-constructed Stripe server SDK client. Never import from client components. */
export function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not configured. Add it to .env.local to enable checkout."
    )
  }
  if (!client) {
    client = new Stripe(key, {
      apiVersion: "2026-06-24.dahlia",
      typescript: true,
    })
  }
  return client
}
