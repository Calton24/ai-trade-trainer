import { trackEvent } from "./posthog"

/**
 * Typed, named wrappers around `trackEvent`. This is the only place event
 * names/shapes should be defined — call these from UI code instead of
 * calling `trackEvent` directly, so the event catalogue stays discoverable
 * and consistent. See docs/observability.md for naming conventions and
 * privacy rules (no PII, no free-text content, ids only).
 */

export function trackSignUpStarted(properties?: { plan?: string | null }): void {
  trackEvent("sign_up_started", properties)
}

export function trackSignUpCompleted(properties?: { method?: "email" | "oauth" }): void {
  trackEvent("sign_up_completed", properties)
}

export function trackOnboardingStarted(): void {
  trackEvent("onboarding_started")
}

export function trackOnboardingCompleted(): void {
  trackEvent("onboarding_completed")
}

export function trackLessonCompleted(properties: { lessonId: string; source?: string }): void {
  trackEvent("lesson_completed", properties)
}

export function trackQuizCompleted(properties: {
  quizId: string
  score?: number
  passed?: boolean
}): void {
  trackEvent("quiz_completed", properties)
}

export function trackCheckoutStarted(properties: { plan: string }): void {
  trackEvent("checkout_started", properties)
}

export function trackCheckoutCompleted(properties?: { plan?: string }): void {
  trackEvent("checkout_completed", properties)
}

export function trackUpgradeModalViewed(properties?: { source?: string }): void {
  trackEvent("upgrade_modal_viewed", properties)
}

export function trackProGateHit(properties: { pathname: string }): void {
  trackEvent("pro_gate_hit", properties)
}

export function trackPricingViewed(properties?: { source?: string }): void {
  trackEvent("pricing_viewed", properties)
}

export function trackFirstLessonStarted(properties: { lessonId: string }): void {
  trackEvent("first_lesson_started", properties)
}

export function trackFirstLessonCompleted(properties: { lessonId: string }): void {
  trackEvent("first_lesson_completed", properties)
}
