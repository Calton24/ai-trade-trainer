import { NextResponse } from "next/server"

import { isStripeWebhookConfigured } from "@/lib/stripe/config"

/**
 * Dev-only helper so the billing UI can warn when webhooks are not wired up.
 * Payments complete in Stripe but Pro will not activate without webhook delivery.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ webhookConfigured: true })
  }

  return NextResponse.json({
    webhookConfigured: isStripeWebhookConfigured(),
  })
}
