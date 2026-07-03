import { NextResponse } from "next/server"

import { requireAuth } from "@/lib/api/auth-guard"
import { isPrivateBetaEnabled } from "@/lib/config/private-beta"
import { captureError } from "@/lib/observability/sentry"
import {
  getMissingCheckoutEnvVars,
  getSiteUrl,
  getStripePriceId,
  getStripePriceIdValidationError,
  isPaidPlanId,
  isPlanCheckoutConfigured,
} from "@/lib/stripe/config"
import { getStripeClient } from "@/lib/stripe/server"
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin"

interface CheckoutRequestBody {
  plan?: string
  /** Path the user was trying to reach before being sent to checkout. */
  redirectTo?: string
}

/** Only allow redirecting back to a same-origin internal path after checkout. */
function sanitizeRedirectPath(value: unknown): string | null {
  if (typeof value !== "string") return null
  if (!value.startsWith("/") || value.startsWith("//")) return null
  return value
}

export async function POST(request: Request) {
  if (isPrivateBetaEnabled()) {
    return NextResponse.json(
      { error: "Checkout is disabled during private beta." },
      { status: 403 }
    )
  }

  const body = (await request.json().catch(() => ({}))) as CheckoutRequestBody
  const plan = body.plan

  if (!plan || !isPaidPlanId(plan)) {
    return NextResponse.json({ error: "Invalid plan." }, { status: 400 })
  }

  const priceValidationError = getStripePriceIdValidationError(plan)
  if (priceValidationError) {
    return NextResponse.json({ error: priceValidationError }, { status: 400 })
  }

  if (!isPlanCheckoutConfigured(plan)) {
    const missing = getMissingCheckoutEnvVars(plan)
    return NextResponse.json(
      {
        error:
          missing.length > 0
            ? `Stripe checkout is not configured yet. Missing: ${missing.join(", ")}.`
            : "Stripe checkout is not configured yet.",
      },
      { status: 501 }
    )
  }

  const authResult = await requireAuth()
  if (!authResult.ok) return authResult.response
  const { user, supabase } = authResult

  const redirectTo = sanitizeRedirectPath(body.redirectTo)
  const priceId = getStripePriceId(plan)
  if (!priceId) {
    return NextResponse.json(
      { error: "Missing Stripe price ID for plan." },
      { status: 501 }
    )
  }

  try {
    const stripe = getStripeClient()

    const { data: existing } = await supabase
      .from("user_subscriptions")
      .select("provider_customer_id")
      .eq("user_id", user.id)
      .maybeSingle()

    let customerId = existing?.provider_customer_id ?? null

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id

      // `user_subscriptions` has no client write privilege at all as of
      // migration 015 — every field on it (including provider_customer_id)
      // is now written exclusively via the service-role admin client,
      // scoped to this server-verified user id. See docs/database-v1.md
      // Part 5.
      if (isAdminConfigured()) {
        const admin = createAdminClient()
        const { data: updated } = await admin
          .from("user_subscriptions")
          .update({
            provider_customer_id: customerId,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          .select("id")

        // Row may be missing if signup trigger didn't run — insert a free row.
        if (!updated?.length) {
          const { error: insertError } = await admin
            .from("user_subscriptions")
            .insert({
              user_id: user.id,
              plan: "free",
              status: "inactive",
              provider: "manual",
              provider_customer_id: customerId,
            })
          if (insertError) {
            console.error(
              "[checkout] failed to persist provider_customer_id",
              insertError
            )
            captureError(insertError, {
              route: "checkout",
              userId: user.id,
              stage: "customer-id-insert",
            })
          }
        }
      } else {
        console.error(
          "[checkout] Supabase admin credentials missing — could not persist provider_customer_id."
        )
        captureError(
          new Error("Supabase admin credentials missing — could not persist provider_customer_id."),
          { route: "checkout", userId: user.id }
        )
      }
    }

    const siteUrl = getSiteUrl()
    const successPath = redirectTo
      ? `${redirectTo}${redirectTo.includes("?") ? "&" : "?"}checkout=success`
      : "/settings/billing?checkout=success"
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${siteUrl}${successPath}`,
      cancel_url: `${siteUrl}/pricing?checkout=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        user_id: user.id,
        plan,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          user_id: user.id,
          plan,
        },
      },
    })

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("[checkout] failed to create session", error)
    captureError(error, { route: "checkout", userId: user.id, plan })

    const stripeMessage =
      error instanceof Error && "type" in error && typeof error.message === "string"
        ? error.message
        : null

    const clientMessage =
      process.env.NODE_ENV === "development" && stripeMessage
        ? stripeMessage
        : "Could not start checkout. Please try again."

    return NextResponse.json({ error: clientMessage }, { status: 500 })
  }
}
