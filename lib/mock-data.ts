import type { Candle } from "@/lib/types"

export { pricingTiers, PLAN_IDS, FREE_PLAN_FEATURES, getPlanById } from "@/lib/pricing/plans"
export type { PaidPlanId } from "@/lib/pricing/plans"
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

/** Generate mock OHLC candles for chart replay simulation */
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
