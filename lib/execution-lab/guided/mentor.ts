import type { ExecutionScenario } from "@/lib/execution-lab/types"

import type { GuidedSessionState, GuidedStepId } from "./types"

const ENCOURAGEMENT = [
  "Good observation.",
  "You're thinking like a trader.",
  "Solid process.",
  "Keep going — structure first, execution second.",
]

const STRUGGLE = [
  "Take your time — professionals pause before acting.",
  "Use a hint if you're stuck. That's what it's for.",
  "No rush. Accuracy beats speed here.",
]

export function getMentorMessage(
  scenario: ExecutionScenario,
  stepId: GuidedStepId,
  session: GuidedStepMetricsSlice,
  lastResult?: { correct: boolean }
): string {
  const metrics = session.stepMetrics[stepId]
  const attempts = metrics?.attempts ?? 0
  const hints = metrics?.hintsUsed ?? 0

  if (lastResult?.correct) {
    return ENCOURAGEMENT[attempts % ENCOURAGEMENT.length]
  }

  if (lastResult && !lastResult.correct) {
    if (attempts >= 3) {
      return "You've tried a few times — take a stronger hint or reveal if needed."
    }
    if (stepId === "trend") {
      return scenario.correctTrend === "range"
        ? "Overlapping swings often mean range — patience pays."
        : "Follow the swing sequence: HH/HL or LH/LL."
    }
    if (stepId === "swing-highs" || stepId === "swing-lows") {
      return "Find the candle that created the extreme before price reversed."
    }
    if (stepId === "behaviour" && scenario.bestStrategy === "no-trade") {
      return "Sometimes the professional move is no trade at all."
    }
    if (stepId === "behaviour" && scenario.commonMistakes?.[0]) {
      return `Common mistake here: ${scenario.commonMistakes[0]}`
    }
    return STRUGGLE[attempts % STRUGGLE.length]
  }

  if (hints > 0) {
    return "Hint active — use it to guide your thinking, not replace it."
  }

  switch (stepId) {
    case "market":
      return "Start with context: what market are you trading?"
    case "timeframe":
      return "Timeframe sets the noise level — confirm it before analysing."
    case "trend":
      return "Label swings before you think about entries."
    case "swing-highs":
    case "swing-lows":
      return "Click the chart to mark swings — precision matters."
    case "behaviour":
      if (scenario.packId === "patience") {
        return "Patience Academy — is there a high-probability trade, or should professionals wait?"
      }
      if (scenario.packId === "eod") {
        return "EOD Academy — read daily context first. What behaviour is the market showing?"
      }
      return "What behaviour is the market showing — trend, pullback, reversal, or no trade?"
    case "evidence":
      return "Select every clue that supports your read — structure, momentum, session, liquidity."
    case "zones":
      return "Mark the level you'd reference for your plan."
    case "strategy":
      return "Which playbook has the highest probability here?"
    case "execution":
      return "Size the risk before you submit — 1% max for learners."
    case "outcome":
      return "Watch what happened — honesty in review builds skill."
    default:
      return "Work the process step by step."
  }
}

interface GuidedStepMetricsSlice {
  stepMetrics: GuidedSessionState["stepMetrics"]
}

export function buildRecommendations(
  scenario: ExecutionScenario,
  weakSteps: GuidedStepId[]
): { label: string; href: string }[] {
  const recs: { label: string; href: string }[] = []

  if (weakSteps.includes("trend") || weakSteps.includes("swing-highs")) {
    recs.push({
      label: "Trend Detective",
      href: "/paths/market-structure-mastery/lessons/higher-highs-and-higher-lows",
    })
  }
  if (weakSteps.includes("behaviour") || weakSteps.includes("evidence") || weakSteps.includes("strategy")) {
    recs.push({
      label: "Reversal Academy",
      href: "/paths/market-behaviour-academy/lessons/pullback-vs-reversal",
    })
  }
  if (weakSteps.includes("zones")) {
    recs.push({
      label: "Support & Resistance Lab",
      href: "/chart-lab/task-support-bounce",
    })
  }
  if (weakSteps.includes("execution")) {
    recs.push({
      label: "Risk Management Path",
      href: "/paths/risk-management/lessons/position-sizing-basics",
    })
  }
  if (scenario.bestStrategy === "no-trade" && weakSteps.includes("behaviour")) {
    recs.push({
      label: "Trade or Skip Practice",
      href: "/strategy-wiki",
    })
  }

  if (recs.length === 0) {
    recs.push({
      label: "Practice Hub",
      href: "/practice",
    })
  }

  return recs.slice(0, 3)
}
