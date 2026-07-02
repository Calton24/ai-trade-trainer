import { isPublicPath } from "@/lib/auth/route-access"
import {
  ACTIVE_STATUSES,
  PAID_PLANS,
  type SubscriptionPlan,
  type SubscriptionStatus,
  type UserSubscription,
} from "./types"

/** Unlock all Pro routes locally without a paid subscription. Production unchanged. */
export function isDevProUnlockEnabled(): boolean {
  return process.env.NODE_ENV === "development"
}

/** Routes any authenticated user may access on the free plan. */
export const FREE_AUTHENTICATED_PREFIXES = [
  "/dashboard",
  "/onboarding",
  "/settings",
  "/profile",
  "/training",
  "/learning-map",
] as const

/** Pro-only educational routes (subscription required). */
export const PRO_PATH_PREFIXES = [
  "/library",
  "/book-lab",
  "/flashcards",
  "/chart-lab",
  "/trend-spotter",
  "/strategy-wiki",
  "/simulator",
  "/trader-readiness",
  "/leaderboard",
  "/paths",
  "/learn",
  "/quizzes",
  "/trade-journal",
  "/journal",
  "/performance",
  "/progress",
  "/progression",
  "/live-progression",
] as const

export function hasProAccess(
  subscription: UserSubscription | null | undefined
): boolean {
  if (isDevProUnlockEnabled()) return true
  if (!subscription) return false
  return (
    PAID_PLANS.includes(subscription.plan) &&
    ACTIVE_STATUSES.includes(subscription.status)
  )
}

export function requiresProSubscription(pathname: string): boolean {
  if (isDevProUnlockEnabled()) return false
  if (isPublicPath(pathname)) return false
  if (
    FREE_AUTHENTICATED_PREFIXES.some(
      (prefix) =>
        pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
  ) {
    return false
  }
  return PRO_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export function planLabel(plan: SubscriptionPlan): string {
  switch (plan) {
    case "weekly":
      return "Weekly"
    case "six_month":
      return "6-Month"
    case "annual":
      return "Annual"
    default:
      return "Free"
  }
}

export function statusLabel(status: SubscriptionStatus): string {
  switch (status) {
    case "active":
      return "Active"
    case "trialing":
      return "Trial"
    case "cancelled":
      return "Cancelled"
    case "expired":
      return "Expired"
    default:
      return "Inactive"
  }
}
