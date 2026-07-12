import { computeRiskReward } from "@/lib/simulator/scoring"
import type { ExecutionScenario, ExecutionTradePlan, ExecutionValidation } from "@/lib/execution-lab/types"
import type { RuleViolation } from "@/lib/execution-lab/trade-management"
import type { TradeReviewReport } from "@/lib/execution-lab/trade-review"

import type { MistakeCode } from "./mistake-codes"

export function deriveMistakeCodes(
  scenario: ExecutionScenario,
  plan: ExecutionTradePlan,
  validation: ExecutionValidation,
  review: TradeReviewReport,
  violations: RuleViolation[] = []
): MistakeCode[] {
  const codes = new Set<MistakeCode>()

  const shouldSkip =
    scenario.idealDirection === "no-trade" || scenario.idealDirection === "wait"
  const didSkip = plan.direction === "no-trade" || plan.direction === "wait"

  if (shouldSkip && !didSkip) codes.add("missed-no-trade")
  if (!shouldSkip && didSkip) codes.add("forced-trade")

  if (!didSkip) {
    if (plan.direction === "buy" && scenario.idealDirection !== "buy") {
      codes.add("wrong-direction")
    }
    if (plan.direction === "sell" && scenario.idealDirection !== "sell") {
      codes.add("wrong-direction")
    }
  }

  if (plan.strategy && plan.strategy !== scenario.bestStrategy) {
    codes.add("wrong-strategy")
  }

  const rr = computeRiskReward(plan.entry, plan.stop, plan.target)
  if (rr < 1.5 && !didSkip) codes.add("poor-risk-reward")
  if (plan.riskPercent > 2) codes.add("over-risked")

  const entryDist =
    Math.abs(plan.entry - scenario.idealEntry) / Math.max(scenario.idealEntry, 0.0001)
  const stopDist =
    Math.abs(plan.stop - scenario.idealStop) / Math.max(scenario.idealStop, 0.0001)

  if (entryDist > 0.006 && !didSkip) {
    if (plan.entry > scenario.idealEntry && scenario.idealDirection === "buy") {
      codes.add("entered-too-early")
    } else if (plan.entry < scenario.idealEntry && scenario.idealDirection === "sell") {
      codes.add("entered-too-early")
    } else {
      codes.add("entered-too-late")
    }
  }

  if (stopDist > 0.006 && !didSkip) {
    const tighter =
      plan.direction === "buy"
        ? plan.stop > scenario.idealStop
        : plan.stop < scenario.idealStop
    codes.add(tighter ? "stop-too-tight" : "stop-too-wide")
  }

  if (scenario.subcategory?.includes("pullback") && plan.strategy === "reversal") {
    codes.add("misread-pullback")
  }
  if (
    (scenario.behaviour === "reversal" || scenario.category === "reversal") &&
    plan.strategy === "continuation" &&
    !didSkip
  ) {
    codes.add("misread-reversal")
  }

  if (scenario.tags?.includes("htf-conflict") && !didSkip) {
    codes.add("against-htf-bias")
  }

  if (scenario.correctTrend === "range" && !didSkip) {
    codes.add("ignored-structure")
  }

  for (const v of violations) {
    if (v.type === "moved-stop-early") codes.add("moved-stop-too-early")
    if (v.type === "closed-winner-early") codes.add("closed-winner-too-early")
    if (v.type === "held-through-invalidation") codes.add("held-through-invalidation")
    if (v.type === "against-bias") codes.add("against-htf-bias")
    if (v.type === "forced-trade") codes.add("forced-trade")
    if (v.type === "over-risked") codes.add("over-risked")
  }

  if (plan.confidence >= 85 && validation.score < 70) codes.add("overconfident")
  if (plan.confidence > 0 && plan.confidence <= 50 && validation.score >= 85) {
    codes.add("underconfident")
  }

  if (review.sections.find((s) => s.label === "Structure Reading")?.score ?? 100 < 65) {
    codes.add("ignored-structure")
  }

  return [...codes]
}
