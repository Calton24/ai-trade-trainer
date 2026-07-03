import { isPublicPath } from "@/lib/auth/route-access"
import type { AdminGrant } from "@/lib/subscription/admin-grant-types"
import {
  ACTIVE_STATUSES,
  PAID_PLANS,
  type SubscriptionPlan,
  type SubscriptionStatus,
  type UserSubscription,
} from "./types"

/**
 * Unlock all Pro routes without a paid subscription. Off by default — must be
 * explicitly opted into for local development. Never enable in production.
 * `NODE_ENV` alone is intentionally NOT sufficient to trigger this.
 *
 * Reads both `ENABLE_DEV_PRO_UNLOCK` (server/proxy/API routes) and
 * `NEXT_PUBLIC_ENABLE_DEV_PRO_UNLOCK` (client RouteGuard, subscription
 * provider, premium gates). Next.js only inlines `NEXT_PUBLIC_*` vars into
 * the browser bundle — a server-only name like `ENABLE_DEV_PRO_UNLOCK`
 * is always `undefined` in client components even when set in `.env.local`.
 * For local dev, set **both** (or at minimum `NEXT_PUBLIC_ENABLE_DEV_PRO_UNLOCK`).
 */
export function isDevProUnlockEnabled(): boolean {
  const enabled =
    process.env.ENABLE_DEV_PRO_UNLOCK === "true" ||
    process.env.NEXT_PUBLIC_ENABLE_DEV_PRO_UNLOCK === "true"
  // Never allow the bypass in production, even if someone leaves the env var set.
  return process.env.NODE_ENV !== "production" && enabled
}

/**
 * This module must stay edge/middleware-safe (no `content/registry` or other
 * heavy/node-only imports) — it is evaluated on every request in
 * `lib/supabase/middleware.ts`.
 */

/** Routes any authenticated user may access on the free plan. */
export const FREE_AUTHENTICATED_PREFIXES = [
  "/dashboard",
  "/onboarding",
  "/settings",
  "/profile",
  "/training",
  "/learning-map",
] as const

/**
 * Pro-only educational routes (subscription required).
 *
 * Includes both the actual route folders in `app/` (`/library`, `/simulator`,
 * `/journal`, `/progress`) and the marketing-style aliases used in the
 * product spec (`/trading-library`, `/trading-simulator`, `/trade-journal`,
 * `/performance`) so this matrix stays correct if routes are ever renamed.
 */
export const PRO_PATH_PREFIXES = [
  "/library",
  "/trading-library",
  "/book-lab",
  "/flashcards",
  "/chart-lab",
  "/trend-spotter",
  "/strategy-wiki",
  "/simulator",
  "/trading-simulator",
  "/trader-readiness",
  "/leaderboard",
  "/paths",
  "/learn",
  "/quiz",
  "/quizzes",
  "/trade-journal",
  "/journal",
  "/performance",
  "/progress",
  "/progression",
  "/live-progression",
] as const

/**
 * Free users get exactly one full lesson — the first lesson of Trading
 * Foundations — as a taste of the product before upgrading. Hardcoded (rather
 * than derived from `content/registry`) so this stays a single, edge-safe
 * source of truth shared by the server proxy, API routes, and the client.
 */
export const FREE_LESSON_PATH =
  "/paths/trading-foundations/lessons/what-is-trading"

export function getFreeLessonHref(): string {
  return FREE_LESSON_PATH
}

export function isFreeLessonPath(pathname: string): boolean {
  return pathname === FREE_LESSON_PATH
}

function hasActiveStripeSubscription(
  subscription: UserSubscription | null | undefined
): boolean {
  if (!subscription) return false
  if (!PAID_PLANS.includes(subscription.plan)) return false
  if (!ACTIVE_STATUSES.includes(subscription.status)) return false

  if (subscription.currentPeriodEnd) {
    const periodEndMs = new Date(subscription.currentPeriodEnd).getTime()
    if (Number.isFinite(periodEndMs) && periodEndMs < Date.now()) return false
  }

  return true
}

export function hasActiveAdminGrant(
  grant: AdminGrant | null | undefined
): boolean {
  if (!grant) return false
  if (String(grant.status).toLowerCase() !== "active") return false
  if (grant.revokedAt) return false

  const now = Date.now()
  if (grant.startsAt) {
    const startsMs = new Date(grant.startsAt).getTime()
    if (Number.isFinite(startsMs) && startsMs > now) return false
  }

  if (grant.expiresAt) {
    const expiresMs = new Date(grant.expiresAt).getTime()
    if (Number.isFinite(expiresMs) && expiresMs <= now) return false
  }

  return true
}

export type ProAccessSource = "dev_unlock" | "stripe" | "admin_grant" | "none"

export function resolveProAccessSource(
  subscription: UserSubscription | null | undefined,
  adminGrant?: AdminGrant | null
): ProAccessSource {
  // Prefer real entitlements over the local dev bypass so billing UI can show
  // Beta Pro / Stripe plan correctly even when ENABLE_DEV_PRO_UNLOCK is on.
  if (hasActiveStripeSubscription(subscription)) return "stripe"
  if (hasActiveAdminGrant(adminGrant)) return "admin_grant"
  if (isDevProUnlockEnabled()) return "dev_unlock"
  return "none"
}

export function hasProAccess(
  subscription: UserSubscription | null | undefined,
  adminGrant?: AdminGrant | null
): boolean {
  return resolveProAccessSource(subscription, adminGrant) !== "none"
}

export function requiresProSubscription(pathname: string): boolean {
  if (isDevProUnlockEnabled()) return false
  if (isPublicPath(pathname)) return false
  if (isFreeLessonPath(pathname)) return false
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
      return "6-Month Plan"
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
