import type { ExecutionScenario, ExecutionTradePlan, ExecutionValidation } from "./types"
import type { RuleViolation } from "./trade-management"

export interface TradeReviewSection {
  label: string
  score: number
  stars: number
  commentary: string
}

export interface TradeReviewReport {
  market: string
  behaviour: string
  decision: string
  outcome: string
  overallScore: number
  institutionalGrade: number
  letterGrade: string
  wouldTakeTrade: boolean
  sections: TradeReviewSection[]
  professionalCommentary: string
  suggestedDrill: { label: string; href: string }
  violations: RuleViolation[]
  managementScore: number
  confidenceCalibration: number
}

function starsFromScore(score: number): number {
  if (score >= 95) return 5
  if (score >= 85) return 4
  if (score >= 70) return 3
  if (score >= 55) return 2
  return 1
}

function letterGrade(score: number): string {
  if (score >= 97) return "A+"
  if (score >= 93) return "A"
  if (score >= 90) return "A-"
  if (score >= 87) return "B+"
  if (score >= 83) return "B"
  if (score >= 80) return "B-"
  if (score >= 77) return "C+"
  if (score >= 73) return "C"
  if (score >= 70) return "C-"
  if (score >= 60) return "D"
  return "F"
}

function findFeedback(
  validation: ExecutionValidation,
  keywords: string[]
): { ok: boolean; message: string } | undefined {
  return validation.feedback.find((f) =>
    keywords.some((k) => f.message.toLowerCase().includes(k.toLowerCase()))
  )
}

export function generateTradeReview(
  scenario: ExecutionScenario,
  plan: ExecutionTradePlan,
  validation: ExecutionValidation,
  outcome: "win" | "loss" | "skipped" | "open" | "breakeven" | "manual" | null,
  context?: {
    violations?: RuleViolation[]
    managementScore?: number
  }
): TradeReviewReport {
  const trendFb = findFeedback(validation, ["direction", "structure", "trend"]) ?? {
    ok: validation.passed,
    message: validation.feedback[0]?.message ?? "Review trend alignment.",
  }
  const entryFb = findFeedback(validation, ["entry", "confirmation", "timing"]) ?? {
    ok: true,
    message: "Entry timing reviewed.",
  }
  const stopFb = findFeedback(validation, ["stop", "invalidation"]) ?? {
    ok: true,
    message: "Stop placement reviewed.",
  }
  const targetFb = findFeedback(validation, ["R:R", "target", "reward"]) ?? {
    ok: true,
    message: "Target placement reviewed.",
  }
  const riskFb = findFeedback(validation, ["risk", "Risk"]) ?? {
    ok: true,
    message: "Risk sizing reviewed.",
  }

  const patienceScore =
    plan.direction === "no-trade" || plan.direction === "wait"
      ? scenario.idealDirection === "no-trade" || scenario.idealDirection === "wait"
        ? 95
        : 40
      : plan.confidence >= 75 && !entryFb.ok
        ? 65
        : entryFb.ok
          ? 88
          : 72

  const trendScore = trendFb.ok ? 92 : 58
  const entryScore = entryFb.ok ? 85 : 62
  const stopScore = stopFb.ok ? 96 : 55
  const targetScore = targetFb.ok ? 88 : 64
  const riskScore = riskFb.ok ? 98 : 52
  const psychologyScore = Math.round((patienceScore + (plan.confidence > 0 ? 80 : 60)) / 2)
  const managementScore = context?.managementScore ?? 75
  const violations = context?.violations ?? []

  const confidenceCalibration =
    plan.confidence >= 90 && !validation.passed
      ? 45
      : plan.confidence >= 75 && validation.passed
        ? 92
        : plan.confidence > 0
          ? 78
          : 50

  const sections: TradeReviewSection[] = [
    {
      label: "Trend Reading",
      score: trendScore,
      stars: starsFromScore(trendScore),
      commentary: trendFb.message,
    },
    {
      label: "Entry Timing",
      score: entryScore,
      stars: starsFromScore(entryScore),
      commentary: entryFb.message,
    },
    {
      label: "Stop Placement",
      score: stopScore,
      stars: starsFromScore(stopScore),
      commentary: stopFb.message,
    },
    {
      label: "Target",
      score: targetScore,
      stars: starsFromScore(targetScore),
      commentary: targetFb.message,
    },
    {
      label: "Risk",
      score: riskScore,
      stars: starsFromScore(riskScore),
      commentary: riskFb.message,
    },
    {
      label: "Patience",
      score: patienceScore,
      stars: starsFromScore(patienceScore),
      commentary:
        patienceScore >= 85
          ? "You waited for the right conditions."
          : "You may have entered before confirmation — professionals often wait for the candle to close.",
    },
    {
      label: "Psychology",
      score: psychologyScore,
      stars: starsFromScore(psychologyScore),
      commentary:
        plan.confidence >= 90 && !validation.passed
          ? "High confidence on a weak setup — review calibration."
          : "Decision process reviewed.",
    },
    {
      label: "Trade Management",
      score: managementScore,
      stars: starsFromScore(managementScore),
      commentary:
        managementScore >= 85
          ? "Solid management — let the trade work or exited with discipline."
          : "Review whether you moved stops or closed too early.",
    },
    {
      label: "Confidence Calibration",
      score: confidenceCalibration,
      stars: starsFromScore(confidenceCalibration),
      commentary:
        confidenceCalibration >= 85
          ? "Confidence matched outcome quality."
          : "Calibrate confidence against structure and confirmation.",
    },
  ]

  const overallScore = Math.round(
    sections.reduce((s, x) => s + x.score, 0) / sections.length
  )
  const institutionalGrade = Math.round(overallScore * 0.92)

  const wouldTakeTrade =
    validation.passed && overallScore >= 75 && plan.direction !== "wait"

  let suggestedDrill = {
    label: "Structure Replay",
    href: "/paths/market-behaviour-academy/lessons/pullback-vs-reversal",
  }
  if (trendScore < 70) {
    suggestedDrill = {
      label: "Reversal Academy — Trend Reading",
      href: "/paths/market-behaviour-academy/lessons/what-is-a-reversal",
    }
  } else if (entryScore < 70) {
    suggestedDrill = {
      label: "Execution Lab",
      href: "/execution-lab",
    }
  } else if (riskScore < 70) {
    suggestedDrill = {
      label: "Risk Management Path",
      href: "/paths/risk-management/lessons/position-sizing-basics",
    }
  } else if (scenario.category === "reversal") {
    suggestedDrill = {
      label: "EOD Reversal Workflow",
      href: "/paths/market-behaviour-academy/lessons/eod-reversal-workflow",
    }
  }

  const outcomeLabel =
    outcome === "win"
      ? "Winner"
      : outcome === "loss"
        ? "Loss"
        : outcome === "skipped"
          ? "No Trade"
          : "Open"

  return {
    market: scenario.symbol,
    behaviour: scenario.behaviour ?? scenario.category,
    decision:
      plan.direction === "no-trade"
        ? "NO TRADE"
        : plan.direction === "wait"
          ? "WAIT"
          : plan.direction.toUpperCase(),
    outcome: outcomeLabel,
    overallScore,
    institutionalGrade,
    letterGrade: letterGrade(overallScore),
    wouldTakeTrade,
    sections,
    professionalCommentary: wouldTakeTrade
      ? `Institutional-grade read on ${scenario.symbol}. ${validation.passed ? "Process aligned with the setup." : "Review the feedback before repeating."}${violations.length > 0 ? ` ${violations.length} rule note(s) flagged.` : ""}`
      : `Professionals would likely pass on this ${scenario.behaviour ?? "setup"}. ${trendFb.ok ? "" : "Trend context needs work. "}${patienceScore < 75 ? "Patience and confirmation are the lesson here." : ""}`,
    suggestedDrill,
    violations,
    managementScore,
    confidenceCalibration,
  }
}
