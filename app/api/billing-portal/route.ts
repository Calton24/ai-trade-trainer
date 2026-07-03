import { NextResponse } from "next/server"

import { requireAuth } from "@/lib/api/auth-guard"
import { captureError } from "@/lib/observability/sentry"
import { getSiteUrl, isStripeConfigured } from "@/lib/stripe/config"
import { getStripeClient } from "@/lib/stripe/server"

export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured yet." },
      { status: 501 }
    )
  }

  const authResult = await requireAuth()
  if (!authResult.ok) return authResult.response
  const { user, supabase } = authResult

  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("provider_customer_id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!subscription?.provider_customer_id) {
    return NextResponse.json(
      { error: "No billing account found. Subscribe to a plan first." },
      { status: 404 }
    )
  }

  try {
    const stripe = getStripeClient()
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.provider_customer_id,
      return_url: `${getSiteUrl()}/settings/billing`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error("[billing-portal] failed to create session", error)
    captureError(error, { route: "billing-portal", userId: user.id })
    return NextResponse.json(
      { error: "Could not open the billing portal. Please try again." },
      { status: 500 }
    )
  }
}
