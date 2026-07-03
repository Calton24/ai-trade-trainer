import { NextResponse } from "next/server"
import type Stripe from "stripe"

import { captureServerEvent } from "@/lib/analytics/posthog"
import { captureError } from "@/lib/observability/sentry"
import { getStripeClient } from "@/lib/stripe/server"
import {
  findUserIdForCustomer,
  markSubscriptionCancelled,
  resolveUserIdFromCheckoutSession,
  resolveUserIdFromMetadata,
  upsertSubscriptionFromStripe,
} from "@/lib/stripe/sync"
import { recordReferralConversion } from "@/lib/referral/server"
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin"

function logWebhook(eventType: string, details: Record<string, unknown>) {
  console.log(`[stripe/webhook] ${eventType}`, details)
}

async function upsertOrThrow(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  subscription: Stripe.Subscription,
  context: Record<string, unknown>
) {
  const result = await upsertSubscriptionFromStripe(admin, userId, subscription)
  if (result.error) {
    logWebhook("upsert failed", { ...context, userId, error: result.error })
    throw new Error(result.error)
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret || !isAdminConfigured()) {
    console.error(
      "[stripe/webhook] STRIPE_WEBHOOK_SECRET or Supabase admin credentials missing."
    )
    return NextResponse.json({ error: "Webhook not configured." }, { status: 501 })
  }

  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 })
  }

  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    const stripe = getStripeClient()
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (error) {
    console.error("[stripe/webhook] signature verification failed", error)
    captureError(error, { route: "stripe/webhook", stage: "signature-verification" })
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 })
  }

  const admin = createAdminClient()
  const stripe = getStripeClient()

  logWebhook("received", { eventType: event.type, eventId: event.id })

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id ?? null

        logWebhook("checkout.session.completed", {
          sessionId: session.id,
          mode: session.mode,
          customerId,
          subscription: session.subscription,
          metadata: session.metadata,
        })

        if (session.mode !== "subscription" || !session.subscription) break

        const userId = await resolveUserIdFromCheckoutSession(admin, session)
        if (!userId) {
          console.error(
            "[stripe/webhook] checkout.session.completed: could not resolve user_id",
            { sessionId: session.id, customerId, metadata: session.metadata }
          )
          break
        }

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)

        logWebhook("activating subscription", {
          userId,
          customerId,
          subscriptionId,
          status: subscription.status,
          plan: session.metadata?.plan,
        })

        await upsertOrThrow(admin, userId, subscription, {
          eventType: event.type,
          sessionId: session.id,
        })

        await recordReferralConversion(admin, userId, session, subscription)

        await captureServerEvent("checkout_completed", userId, {
          plan: session.metadata?.plan,
        })
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id

        const userId =
          resolveUserIdFromMetadata(subscription.metadata) ??
          (await findUserIdForCustomer(admin, customerId))

        logWebhook(event.type, {
          customerId,
          subscriptionId: subscription.id,
          userId,
          status: subscription.status,
        })

        if (!userId) {
          console.error(
            `[stripe/webhook] no supabase user found for customer ${customerId}`
          )
          break
        }

        await upsertOrThrow(admin, userId, subscription, {
          eventType: event.type,
          customerId,
        })
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id

        const userId =
          resolveUserIdFromMetadata(subscription.metadata) ??
          (await findUserIdForCustomer(admin, customerId))

        logWebhook(event.type, {
          customerId,
          subscriptionId: subscription.id,
          userId,
        })

        if (!userId) {
          console.error(
            `[stripe/webhook] no supabase user found for customer ${customerId}`
          )
          break
        }

        const result = await markSubscriptionCancelled(admin, userId, subscription)
        if (result.error) {
          throw new Error(result.error)
        }
        break
      }

      default:
        break
    }
  } catch (error) {
    console.error("[stripe/webhook] handler error", error)
    captureError(error, { route: "stripe/webhook", eventType: event.type })
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
