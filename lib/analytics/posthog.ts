import posthog from "posthog-js"

/**
 * Product analytics scaffold. Fully optional and disabled by default —
 * every function here is a safe no-op unless `NEXT_PUBLIC_POSTHOG_KEY` is
 * set. Never throws, never blocks a user flow.
 *
 * Privacy: identify users by Supabase user id only — never email, name, or
 * any free-text content (journal entries, trading notes, chart
 * screenshots). See docs/observability.md ("privacy rules").
 */

let initialized = false

export function isPostHogEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY)
}

/** Client-only. Idempotent — safe to call from every render of the analytics provider. */
export function initPostHog(): void {
  if (typeof window === "undefined") return
  if (initialized) return
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    // Autocapture would blindly record clicks/inputs across the whole app,
    // which risks picking up journal text, trading notes, or other
    // sensitive content. We only ever send the explicit, typed events in
    // lib/analytics/events.ts — see docs/observability.md.
    autocapture: false,
  })
  initialized = true
}

export type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>

/** Client-only. No-ops off the client or when disabled. */
export function trackEvent(event: string, properties?: AnalyticsProperties): void {
  if (typeof window === "undefined" || !isPostHogEnabled()) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[analytics] (disabled) ${event}`, properties ?? {})
    }
    return
  }
  initPostHog()
  posthog.capture(event, properties)
}

/** Identify by Supabase user id only — never pass email/name as the identity. */
export function identifyUser(userId: string, properties?: AnalyticsProperties): void {
  if (typeof window === "undefined" || !isPostHogEnabled()) return
  initPostHog()
  posthog.identify(userId, properties)
}

/** Call on sign-out so the next session doesn't inherit the previous user's identity. */
export function resetAnalytics(): void {
  if (typeof window === "undefined" || !isPostHogEnabled()) return
  posthog.reset()
}

/**
 * Server-only event capture, for events best known server-side (e.g.
 * `checkout_completed` from the Stripe webhook, which is more reliable
 * than trusting a client-side redirect). Uses PostHog's plain HTTP capture
 * endpoint directly (no `posthog-node` dependency) — fire-and-forget, never
 * throws, never blocks the caller's response.
 */
export async function captureServerEvent(
  event: string,
  distinctId: string,
  properties?: AnalyticsProperties
): Promise<void> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[analytics] (disabled, server) ${event}`, { distinctId, ...properties })
    }
    return
  }

  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"

  try {
    await fetch(`${host}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        event,
        distinct_id: distinctId,
        properties: { ...properties, $process_person_profile: true },
      }),
    })
  } catch (error) {
    console.error("[analytics] server event capture failed", error)
  }
}
