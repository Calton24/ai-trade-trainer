import type { UserState } from "./types"

export type PatternCategory =
  | "trend-detection"
  | "continuation"
  | "reversal"
  | "trend-building"
  | "support-resistance"

export interface StoredPatternAttempt {
  id: string
  category: PatternCategory
  widgetKind: string
  correct: number
  total: number
  /** 0–100 */
  score: number
  /** Learner confidence 0–100 before checking answer */
  confidence?: number
  lessonId?: string
  completedAt: string
}

export interface PatternRecognitionStats {
  trendDetection: number
  continuation: number
  reversal: number
  trendBuilding: number
  supportResistance: number
  overall: number
  totalAttempts: number
  weakestArea: PatternCategory | null
  strongestArea: PatternCategory | null
  recentAttempts: StoredPatternAttempt[]
}

const CATEGORY_LABELS: Record<PatternCategory, string> = {
  "trend-detection": "Trend Detection",
  continuation: "Continuation",
  reversal: "Reversal",
  "trend-building": "Trend Building",
  "support-resistance": "Support & Resistance",
}

export function getPatternCategoryLabel(category: PatternCategory): string {
  return CATEGORY_LABELS[category]
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
}

function categoryAvg(attempts: StoredPatternAttempt[], category: PatternCategory) {
  const scores = attempts.filter((a) => a.category === category).map((a) => a.score)
  return avg(scores)
}

function drillSupportResistanceScore(state: UserState): number {
  const scores = state.drillSessions
    .filter((d) =>
      /support|resistance|break|retest|liquidity/i.test(d.drillType + d.drillTitle)
    )
    .map((d) => d.score)
  return avg(scores)
}

function findExtreme(
  scores: Record<PatternCategory, number>
): { weakest: PatternCategory | null; strongest: PatternCategory | null } {
  const entries = Object.entries(scores).filter(([, s]) => s > 0) as [
    PatternCategory,
    number,
  ][]
  if (entries.length === 0) return { weakest: null, strongest: null }
  entries.sort((a, b) => a[1] - b[1])
  return { weakest: entries[0][0], strongest: entries[entries.length - 1][0] }
}

export function recordPatternAttempt(
  state: UserState,
  attempt: Omit<StoredPatternAttempt, "id" | "completedAt"> & { id?: string }
): UserState {
  const full: StoredPatternAttempt = {
    ...attempt,
    id: attempt.id ?? crypto.randomUUID(),
    completedAt: new Date().toISOString(),
  }
  return {
    ...state,
    patternAttempts: [...state.patternAttempts, full],
  }
}

export function computePatternRecognitionStats(
  state: UserState
): PatternRecognitionStats {
  const attempts = state.patternAttempts
  const trendDetection = categoryAvg(attempts, "trend-detection")
  const continuation = categoryAvg(attempts, "continuation")
  const reversal = categoryAvg(attempts, "reversal")
  const trendBuilding = categoryAvg(attempts, "trend-building")
  const supportResistance = Math.max(
    categoryAvg(attempts, "support-resistance"),
    drillSupportResistanceScore(state)
  )

  const components = [
    trendDetection,
    continuation,
    reversal,
    trendBuilding,
    supportResistance,
  ].filter((s) => s > 0)

  const { weakest, strongest } = findExtreme({
    "trend-detection": trendDetection,
    continuation,
    reversal,
    "trend-building": trendBuilding,
    "support-resistance": supportResistance,
  })

  return {
    trendDetection,
    continuation,
    reversal,
    trendBuilding,
    supportResistance,
    overall: components.length > 0 ? avg(components) : 0,
    totalAttempts: attempts.length,
    weakestArea: weakest,
    strongestArea: strongest,
    recentAttempts: [...attempts].reverse().slice(0, 8),
  }
}

/** Map continuation-predictor correct answers to pattern categories. */
export function categoryForContinuationAnswer(correct: string): PatternCategory {
  return correct.toLowerCase().includes("reversal") ? "reversal" : "continuation"
}
