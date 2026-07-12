import { generateTradeReview } from "@/lib/execution-lab/trade-review"
import { validateExecution } from "@/lib/execution-lab/scoring"
import type {
  ExecutionScenario,
  ExecutionTradePlan,
  ExecutionValidation,
} from "@/lib/execution-lab/types"
import type { RuleViolation } from "@/lib/execution-lab/trade-management"

import { deriveMistakeCodes } from "./derive-mistakes"
import type { AttemptCompletePayload } from "./types"
import { toDbDecision } from "./types"

export interface TrustedAttemptResult {
  validation: ExecutionValidation
  review: ReturnType<typeof generateTradeReview>
  decisionCorrect: boolean
  strategyCorrect: boolean
  mistakeCodes: ReturnType<typeof deriveMistakeCodes>
  confidenceGap: number
  scores: {
    executionScore: number
    marketReadingScore: number
    structureScore: number
    entryScore: number
    stopScore: number
    targetScore: number
    riskScore: number
    managementScore: number
    patienceScore: number
  }
  decision: ReturnType<typeof toDbDecision>
  expectedDecision: ReturnType<typeof toDbDecision>
}

function sectionScore(
  review: ReturnType<typeof generateTradeReview>,
  label: string,
  fallback: number
): number {
  return review.sections.find((s) => s.label === label)?.score ?? fallback
}

export function computeTrustedAttemptResult(
  scenario: ExecutionScenario,
  payload: AttemptCompletePayload
): TrustedAttemptResult {
  const plan: ExecutionTradePlan = {
    direction: payload.direction,
    strategy: (payload.strategy as ExecutionTradePlan["strategy"]) ?? null,
    orderMode: "market",
    pendingType: "buy-limit",
    entry: payload.entry,
    stop: payload.stop,
    target: payload.target,
    lots: payload.lots,
    accountSize: payload.accountSize,
    riskPercent: payload.riskPercent,
    confidence: payload.confidence,
  }

  const validation = validateExecution(scenario, plan)
  const violations = (payload.ruleViolations ?? []) as RuleViolation[]
  const review = generateTradeReview(
    scenario,
    plan,
    validation,
    payload.outcome ?? null,
    {
      violations,
      managementScore: payload.managementScore,
    }
  )

  const mistakeCodes = deriveMistakeCodes(scenario, plan, validation, review, violations)

  const expectedDecision = toDbDecision(scenario.idealDirection)
  const decision = toDbDecision(payload.direction)

  const decisionCorrect =
    (decision === "no_trade" || decision === "wait") &&
    (expectedDecision === "no_trade" || expectedDecision === "wait")
      ? true
      : decision === expectedDecision

  const strategyCorrect =
    !payload.strategy || payload.strategy === scenario.bestStrategy

  const processQuality = validation.score
  const confidenceGap =
    payload.confidence > 0 ? Math.abs(payload.confidence - processQuality) : 0

  const behaviourScore = sectionScore(review, "Behaviour Reading", validation.score)
  const structureScore = sectionScore(review, "Structure Reading", validation.score)

  return {
    validation,
    review,
    decisionCorrect,
    strategyCorrect,
    mistakeCodes,
    confidenceGap,
    decision,
    expectedDecision,
    scores: {
      executionScore: validation.score,
      marketReadingScore: Math.round((behaviourScore + structureScore) / 2),
      structureScore,
      entryScore: sectionScore(review, "Entry Timing", 75),
      stopScore: sectionScore(review, "Stop Placement", 75),
      targetScore: sectionScore(review, "Target", 75),
      riskScore: sectionScore(review, "Risk", 75),
      managementScore: review.managementScore,
      patienceScore: sectionScore(review, "Patience", 75),
    },
  }
}
