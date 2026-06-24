export {
  READINESS_PILLARS,
  MARKET_KNOWLEDGE_QUESTIONS,
  TRADER_READINESS_DISCLAIMER,
  getPillarById,
} from "./pillars"
export { CHART_READING_EXERCISES, getChartReadingExercise } from "./chart-reading"
export { TRADE_SELECTION_SCENARIOS, getTradeSelectionScenario } from "./trade-selection"
export { RISK_SCENARIOS } from "./risk-management"
export { PSYCHOLOGY_SCENARIOS } from "./psychology"
export {
  JOURNAL_ANALYSIS_SCENARIOS,
  JOURNAL_MISTAKE_OPTIONS,
  JOURNAL_PATTERN_OPTIONS,
  getJournalAnalysisScenario,
} from "./journal-analysis"
export {
  STRATEGY_MASTERY_QUESTIONS,
  getStrategyMasteryQuestions,
} from "./strategy-mastery"

import { READINESS_PILLARS } from "./pillars"
import type { ReadinessPillarId } from "@/lib/trader-readiness/types"

export function getAssessmentPillars(
  strategyLessonsCompleted: boolean
): typeof READINESS_PILLARS {
  return READINESS_PILLARS.filter(
    (p) => !p.requiresStrategyCompletion || strategyLessonsCompleted
  )
}

export function getTotalEstimatedMinutes(
  strategyLessonsCompleted: boolean
): number {
  return getAssessmentPillars(strategyLessonsCompleted).reduce(
    (sum, p) => sum + p.estimatedMinutes,
    0
  )
}

export function getNextPillar(
  currentId: ReadinessPillarId,
  strategyLessonsCompleted: boolean
): ReadinessPillarId | null {
  const pillars = getAssessmentPillars(strategyLessonsCompleted)
  const idx = pillars.findIndex((p) => p.id === currentId)
  if (idx < 0 || idx >= pillars.length - 1) return null
  return pillars[idx + 1].id
}
