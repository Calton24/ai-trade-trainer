import type { ChartAnnotation, ChartPoint } from "@/lib/charts/types"
import type { ExecutionScenario, StrategyChoice } from "@/lib/execution-lab/types"

import { expectedBehaviour, expectedEvidence } from "./steps"
import type {
  BehaviourAnswer,
  EvidenceTag,
  GuidedStepId,
  GuidedStepResult,
  TrendAnswer,
} from "./types"

const INDEX_TOLERANCE = 3
const PRICE_TOLERANCE_RATIO = 0.015

function nearPoint(
  click: ChartPoint,
  target: ChartPoint,
  priceTolerance: number
): boolean {
  return (
    Math.abs(click.index - target.index) <= INDEX_TOLERANCE &&
    Math.abs(click.price - target.price) <= priceTolerance
  )
}

function getSwingAnnotations(
  annotations: ChartAnnotation[],
  kind: "swing-high" | "swing-low"
): ChartPoint[] {
  return annotations
    .filter((a) => a.type === kind && a.index !== undefined && a.price !== undefined)
    .map((a) => ({ index: a.index!, price: a.price! }))
}

function getZoneTargets(scenario: ExecutionScenario): ChartPoint[] {
  const out: ChartPoint[] = []
  for (const a of scenario.chart.annotations) {
    if (a.price !== undefined && a.index === undefined) {
      out.push({ index: scenario.pauseIndex, price: a.price })
    }
    if (a.priceLow !== undefined) {
      out.push({ index: scenario.pauseIndex, price: a.priceLow })
    }
    if (a.priceHigh !== undefined) {
      out.push({ index: scenario.pauseIndex, price: a.priceHigh })
    }
  }
  if (out.length === 0) {
    const c = scenario.chart.candles[scenario.pauseIndex]
    out.push({ index: scenario.pauseIndex, price: c.close })
  }
  return out
}

function priceTolerance(scenario: ExecutionScenario): number {
  const c = scenario.chart.candles[scenario.pauseIndex]
  return Math.max(c.close * PRICE_TOLERANCE_RATIO, scenario.pipSize * 20)
}

function behaviourMatches(expected: BehaviourAnswer, answer: BehaviourAnswer | null): boolean {
  if (!answer) return false
  if (answer === expected) return true
  const aliases: Partial<Record<BehaviourAnswer, BehaviourAnswer[]>> = {
    continuation: ["pullback", "trend"],
    pullback: ["continuation", "trend"],
    trend: ["continuation", "pullback"],
    exhaustion: ["reversal"],
    reversal: ["exhaustion"],
  }
  return aliases[expected]?.includes(answer) ?? false
}

export function validateGuidedStep(
  stepId: GuidedStepId,
  scenario: ExecutionScenario,
  answers: {
    marketAnswer: string | null
    timeframeAnswer: string | null
    trendAnswer: TrendAnswer | null
    behaviourAnswer: BehaviourAnswer | null
    evidenceAnswers: EvidenceTag[]
    strategyAnswer: StrategyChoice | null
    markedSwingHighs: ChartPoint[]
    markedSwingLows: ChartPoint[]
    markedZones: ChartPoint[]
  }
): GuidedStepResult {
  switch (stepId) {
    case "market": {
      const ok = answers.marketAnswer === scenario.symbol
      return {
        correct: ok,
        feedback: ok
          ? `Correct — this is ${scenario.symbol}.`
          : "Interesting read — check the symbol and price scale. What instrument is this?",
        mentorLine: ok ? "Good observation." : "Look at the instrument label and price decimals.",
      }
    }
    case "timeframe": {
      const ok = answers.timeframeAnswer === scenario.timeframe
      return {
        correct: ok,
        feedback: ok
          ? `Correct — ${scenario.timeframe} timeframe.`
          : "Reconsider the candle spacing — how much time does each bar represent?",
        mentorLine: ok ? "Timeframe confirmed." : "How much time does each candle represent?",
      }
    }
    case "trend": {
      const ok =
        answers.trendAnswer === scenario.correctTrend ||
        (answers.trendAnswer === "transition" && scenario.correctTrend === "range")
      return {
        correct: ok,
        feedback: ok
          ? "Structure read matches the chart."
          : "Walk the swings again — are highs and lows still progressing, or overlapping?",
        mentorLine: ok
          ? "Solid market read."
          : "Remember: HH/HL uptrend, LH/LL downtrend, overlap = range.",
      }
    }
    case "swing-highs": {
      const targets = getSwingAnnotations(scenario.chart.annotations, "swing-high")
      const tol = priceTolerance(scenario)
      const ok =
        targets.length === 0
          ? answers.markedSwingHighs.length >= 1
          : answers.markedSwingHighs.some((m) =>
              targets.some((t) => nearPoint(m, t, tol))
            )
      return {
        correct: ok,
        feedback: ok
          ? "You identified a valid swing high."
          : "Find the candle that created the highest high before price pulled back.",
        mentorLine: ok ? "Nice swing identification." : "A swing high needs lower highs on both sides.",
      }
    }
    case "swing-lows": {
      const targets = getSwingAnnotations(scenario.chart.annotations, "swing-low")
      const tol = priceTolerance(scenario)
      const ok =
        targets.length === 0
          ? answers.markedSwingLows.length >= 1
          : answers.markedSwingLows.some((m) =>
              targets.some((t) => nearPoint(m, t, tol))
            )
      return {
        correct: ok,
        feedback: ok
          ? "You identified a valid swing low."
          : "Find the trough before price bounced higher.",
        mentorLine: ok ? "Good eye on structure." : "Click the lowest point before the rally.",
      }
    }
    case "behaviour": {
      const expected = expectedBehaviour(scenario)
      const ok = behaviourMatches(expected, answers.behaviourAnswer)
      return {
        correct: ok,
        feedback: ok
          ? "You labelled the market behaviour correctly."
          : `Interesting idea — this chart shows ${expected.replace("-", " ")}, not ${answers.behaviourAnswer?.replace("-", " ") ?? "?"}.`,
        mentorLine: ok
          ? "Clear behavioural read."
          : expected === "pullback"
            ? "This is still a healthy pullback — structure has not changed."
            : "What is price trying to do — continue, reverse, or go nowhere?",
      }
    }
    case "evidence": {
      const required = expectedEvidence(scenario)
      const selected = answers.evidenceAnswers
      const hits = required.filter((t) => selected.includes(t)).length
      const ok = selected.length >= 2 && hits >= 1
      return {
        correct: ok,
        feedback: ok
          ? "Evidence supports your behaviour read."
          : "Select at least two clues — including structural evidence that matches your read.",
        mentorLine: ok
          ? "Professionals stack evidence before acting."
          : "Has the previous higher low broken? Compare momentum before and after the pullback.",
      }
    }
    case "zones": {
      const targets = getZoneTargets(scenario)
      const tol = priceTolerance(scenario)
      const ok = answers.markedZones.some((m) =>
        targets.some((t) => Math.abs(m.price - t.price) <= tol)
      )
      return {
        correct: ok,
        feedback: ok
          ? "Key level marked near the reaction zone."
          : "Mark where price has reacted — support, resistance, or range boundary.",
        mentorLine: ok ? "Level makes sense." : "Are you sure that's where price cares?",
      }
    }
    case "strategy": {
      const ok = answers.strategyAnswer === scenario.bestStrategy
      return {
        correct: ok,
        feedback: ok
          ? `Correct — ${scenario.bestStrategy.replace("-", " ")} is the best fit.`
          : `Review why ${scenario.bestStrategy.replace("-", " ")} fits this structure.`,
        mentorLine: ok ? "Strategy matches the chart." : "Don't force a setup — match probability.",
      }
    }
    default:
      return {
        correct: true,
        feedback: "",
        mentorLine: "",
      }
  }
}
