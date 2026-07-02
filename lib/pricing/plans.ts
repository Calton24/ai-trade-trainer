import type { PricingTier } from "@/lib/types"

/** Stripe-ready plan identifiers (wire checkout later). */
export const PLAN_IDS = {
  weekly: "weekly",
  six_month: "six_month",
  annual: "annual",
} as const

export type PaidPlanId = (typeof PLAN_IDS)[keyof typeof PLAN_IDS]

export const STRIPE_PRICE_PLACEHOLDERS = {
  weekly: process.env.STRIPE_WEEKLY_PRICE_ID ?? "price_weekly_placeholder",
  six_month: process.env.STRIPE_SIX_MONTH_PRICE_ID ?? "price_six_month_placeholder",
  annual: process.env.STRIPE_ANNUAL_PRICE_ID ?? "price_annual_placeholder",
} as const

const PRO_FEATURES = [
  "Full learning paths",
  "Trading Library & Book Lab",
  "Flashcards & quizzes",
  "Chart Lab & Trend Spotter",
  "Strategy Wiki",
  "Trading Simulator",
  "Trader Readiness Assessment",
  "XP, ranks & leaderboards",
  "Trade journal & progress analytics",
  "All current & future courses while subscribed",
]

export const pricingTiers: PricingTier[] = [
  {
    id: PLAN_IDS.weekly,
    name: "Weekly",
    price: "£4.99",
    period: "/week",
    description: "Short commitment — ideal for trying the platform.",
    studyAlignment: "Try the platform",
    features: ["Full Pro access", "Cancel anytime", ...PRO_FEATURES.slice(0, 4)],
    cta: "Start Weekly",
    stripePriceId: STRIPE_PRICE_PLACEHOLDERS.weekly,
    billingInterval: "week",
  },
  {
    id: PLAN_IDS.six_month,
    name: "6-Month Plan",
    price: "£79.99",
    period: " every 6 months",
    description: "Best for serious beginners on the 3–6 month competency journey.",
    studyAlignment: "Build competency",
    features: ["Full Pro access", "Better value than weekly", ...PRO_FEATURES],
    badge: "most-popular",
    cta: "Start 6-Month Plan",
    stripePriceId: STRIPE_PRICE_PLACEHOLDERS.six_month,
    billingInterval: "6-month",
  },
  {
    id: PLAN_IDS.annual,
    name: "Annual",
    price: "£129.99",
    period: "/year",
    description: "Best value — designed for long-term mastery.",
    studyAlignment: "Master over time",
    features: [
      "Full Pro access",
      "Best value vs weekly",
      ...PRO_FEATURES,
    ],
    badge: "best-value",
    cta: "Start Annual",
    stripePriceId: STRIPE_PRICE_PLACEHOLDERS.annual,
    billingInterval: "year",
  },
]

export const FREE_PLAN_FEATURES = [
  "Landing page & pricing",
  "Account creation & onboarding",
  "Dashboard preview",
  "Limited beginner preview content",
]

export function getPlanById(id: string) {
  return pricingTiers.find((t) => t.id === id)
}
