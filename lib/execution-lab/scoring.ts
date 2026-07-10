import { computeRiskReward } from "@/lib/simulator/scoring"

import { computeTradeMetrics } from "./sizing"
import type {
  ExecutionFeedbackItem,
  ExecutionScenario,
  ExecutionTradePlan,
  ExecutionValidation,
} from "./types"

export function validateExecution(
  scenario: ExecutionScenario,
  plan: ExecutionTradePlan
): ExecutionValidation {
  const feedback: ExecutionFeedbackItem[] = []

  if (plan.direction === "no-trade" || plan.direction === "wait") {
    const correctSkip = scenario.idealDirection === "no-trade" || scenario.idealDirection === "wait"
    feedback.push({
      ok: correctSkip,
      message: correctSkip
        ? "Correct — patience was the highest-probability decision here."
        : "There was a valid setup on this chart. Review structure and ideal entry zone.",
    })
    return {
      score: correctSkip ? 100 : plan.direction === "wait" ? 60 : 20,
      passed: correctSkip,
      feedback,
    }
  }

  if (plan.strategy) {
    const strategyOk = plan.strategy === scenario.bestStrategy
    feedback.push({
      ok: strategyOk,
      message: strategyOk
        ? `Correct strategy: ${scenario.bestStrategy.replace("-", " ")}.`
        : `Best strategy was ${scenario.bestStrategy.replace("-", " ")} — review why this setup fits.`,
    })
  }

  const directionOk =
    (plan.direction === "buy" && scenario.idealDirection === "buy") ||
    (plan.direction === "sell" && scenario.idealDirection === "sell")
  feedback.push({
    ok: directionOk,
    message: directionOk
      ? "Direction aligned with the chart structure."
      : `Trading against structure — ideal direction was ${scenario.idealDirection.toUpperCase()}.`,
  })

  const rr = computeRiskReward(plan.entry, plan.stop, plan.target)
  feedback.push({
    ok: rr >= 1.5,
    message:
      rr >= 2
        ? `Excellent R:R (${rr}:1).`
        : rr >= 1.5
          ? `Acceptable R:R (${rr}:1).`
          : `R:R only ${rr}:1 — professionals aim for at least 1.5:1.`,
  })

  const entryDist =
    Math.abs(plan.entry - scenario.idealEntry) / Math.max(scenario.idealEntry, 0.0001)
  feedback.push({
    ok: entryDist < 0.003,
    message:
      entryDist < 0.003
        ? "Entry placement near the ideal zone."
        : "Entry could be tighter — review confirmation and structure.",
  })

  const stopDist =
    Math.abs(plan.stop - scenario.idealStop) / Math.max(scenario.idealStop, 0.0001)
  feedback.push({
    ok: stopDist < 0.004,
    message:
      stopDist < 0.004
        ? "Stop beyond invalidation — well placed."
        : "Stop placement needs work — avoid placing stops inside liquidity.",
  })

  const metrics = computeTradeMetrics({
    direction: plan.direction,
    entry: plan.entry,
    stop: plan.stop,
    target: plan.target,
    accountSize: plan.accountSize,
    riskPercent: plan.riskPercent,
    pipSize: scenario.pipSize,
    pipValuePerLot: scenario.pipValuePerLot,
    lotsOverride: plan.lots,
  })

  const riskOk = Math.abs(metrics.expectedLoss - metrics.riskAmount) / metrics.riskAmount < 0.15
  feedback.push({
    ok: riskOk && plan.riskPercent <= 2,
    message:
      plan.riskPercent > 2
        ? `Risking ${plan.riskPercent}% — professionals cap at 1–2%.`
        : riskOk
          ? `Risk sized correctly (~${plan.riskPercent}% of account).`
          : "Position size doesn't match your stated risk — recalculate lots.",
  })

  if (scenario.correctTrend === "range") {
    feedback.push({
      ok: false,
      message: "Chart is ranging — forcing a trend trade here is low probability.",
    })
  }

  const score = Math.round(
    (feedback.filter((f) => f.ok).length / feedback.length) * 100
  )

  return {
    score,
    passed: score >= 70,
    feedback,
  }
}
