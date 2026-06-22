import type { Candle, PricingTier } from "@/lib/types"

/** Generate mock OHLC candles for chart replay simulation */
export function generateMockCandles(count = 60): Candle[] {
  const candles: Candle[] = []
  let price = 42850
  const baseTime = Date.now() - count * 15 * 60 * 1000

  for (let i = 0; i < count; i++) {
    const volatility = 80 + Math.random() * 120
    const direction = Math.random() > 0.48 ? 1 : -1
    const open = price
    const close = open + direction * volatility * Math.random()
    const high = Math.max(open, close) + Math.random() * 40
    const low = Math.min(open, close) - Math.random() * 40

    candles.push({
      time: baseTime + i * 15 * 60 * 1000,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
    })

    price = close
  }

  return candles
}

export const pricingTiers: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    price: "£0",
    description: "Start learning with guided lessons and daily practice.",
    features: [
      "3 drills per day",
      "First 2 modules free",
      "Basic progress tracking",
    ],
    cta: "Start Learning Free",
  },
  {
    id: "pro",
    name: "Pro",
    price: "£14.99",
    period: "/month",
    description: "Full curriculum and unlimited practice for serious learners.",
    features: [
      "All 8 modules",
      "Unlimited chart drills",
      "AI drill reviews",
      "Full practice journal",
      "Progress analytics & badges",
      "Community access",
    ],
    highlighted: true,
    cta: "Start Pro Trial",
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "£99",
    description: "One-time payment. Everything in Pro, forever.",
    features: [
      "Everything in Pro",
      "Lifetime access",
      "Founder badge",
      "Early feature access",
    ],
    cta: "Claim Founder Access",
  },
]

// Content seed data only — no fake user activity
export { modules, getModuleById } from "./mock/modules"
export { lessons, getLessonById, getLessonsByModuleId } from "./mock/lessons"
export { drills, drillMarkMap, getDrillByType, getDrillById } from "./mock/drills"
export { badgeDefinitions, getBadgeById } from "./mock/badges"
export {
  weeklyChallenge,
  exampleDiscussionPrompts,
} from "./mock/community-posts"
export {
  learningPaths,
  pathSyllabus,
  getPathById,
  getSyllabusByPathId,
  getSyllabusItemById,
  getRelatedPaths,
} from "./mock/learning-paths"
export {
  quizzes,
  quizDiscussionPrompts,
  getQuizById,
  getQuizzesByPathId,
  getDiscussionResponse,
} from "./mock/quizzes"
export { getLevelTitle, getXpProgressPercent } from "./user-state"
