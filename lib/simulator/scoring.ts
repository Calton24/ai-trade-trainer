import { scoreScenario } from "@/lib/charts/scoring"
import type { UserMarker } from "@/lib/charts/types"
import type { TrendClassification } from "@/lib/trend-spotter/types"

import type {
  SimulatorScenario,
  SimulatorTradePlan,
  TradeManagementDecision,
} from "./types"

export function scoreTrendAnswer(
  answer: TrendClassification,
  correct: TrendClassification
): { score: number; passed: boolean } {
  const passed = answer === correct
  return { score: passed ? 100 : 0, passed }
}

export function scoreMarkers(
  scenario: SimulatorScenario,
  markers: UserMarker[]
): { score: number; passed: boolean } {
  if (!scenario.chart.expectedAnswer) {
    return { score: 0, passed: false }
  }
  const result = scoreScenario(scenario.chart, markers)
  return { score: result.score, passed: result.passed }
}

export function scoreTradeSelection(
  selected: number,
  bestIndex: number
): { score: number; passed: boolean } {
  const passed = selected === bestIndex
  return { score: passed ? 100 : selected >= 0 ? 40 : 0, passed }
}

export function scoreTradePlan(
  plan: SimulatorTradePlan,
  ideal?: { entry: number; stop: number; target: number }
): { score: number; passed: boolean } {
  if (!ideal || plan.entry <= 0 || plan.stop <= 0 || plan.target <= 0) {
    return { score: 0, passed: false }
  }

  const risk = Math.abs(plan.entry - plan.stop)
  const reward = Math.abs(plan.target - plan.entry)
  if (risk <= 0) return { score: 0, passed: false }

  const rr = reward / risk
  const entryDist = Math.abs(plan.entry - ideal.entry) / ideal.entry
  const stopDist = Math.abs(plan.stop - ideal.stop) / ideal.stop
  const targetDist = Math.abs(plan.target - ideal.target) / ideal.target

  let score = 100
  score -= Math.min(30, entryDist * 200)
  score -= Math.min(25, stopDist * 200)
  score -= Math.min(25, targetDist * 200)
  if (rr < 1.5) score -= 20
  else if (rr >= 2) score += 5

  const final = Math.max(0, Math.min(100, Math.round(score)))
  return { score: final, passed: final >= 70 }
}

export function scoreManagementDecisions(
  decisions: { decision: TradeManagementDecision; correct: boolean }[]
): { score: number; passed: boolean } {
  if (decisions.length === 0) return { score: 0, passed: false }
  const correct = decisions.filter((d) => d.correct).length
  const score = Math.round((correct / decisions.length) * 100)
  return { score, passed: score >= 70 }
}

export function computeRiskReward(
  entry: number,
  stop: number,
  target: number
): number {
  const risk = Math.abs(entry - stop)
  if (risk <= 0) return 0
  return Math.round((Math.abs(target - entry) / risk) * 10) / 10
}
