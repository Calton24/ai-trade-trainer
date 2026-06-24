import type {
  TrendBias,
  TrendClassification,
  TrendExerciseScore,
  TrendSpotterScenario,
  TrendTradeDecision,
} from "@/lib/trend-spotter/types"

export function scoreTrendExercise(input: {
  scenario: TrendSpotterScenario
  classification: TrendClassification | null
  bias: TrendBias | null
  tradeDecision: TrendTradeDecision | null
  reasoning: string
  chartScore: number
}): TrendExerciseScore {
  const classificationCorrect =
    input.classification === input.scenario.classification
  const biasCorrect = input.bias === input.scenario.bias
  const tradeCorrect = input.tradeDecision === input.scenario.tradeDecision

  const classificationPts = classificationCorrect ? 30 : 0
  const chartPts = Math.round((input.chartScore / 100) * 25)
  const levelPts = Math.round((input.chartScore / 100) * 15)
  const biasPts = biasCorrect ? 15 : 0
  const tradePts = tradeCorrect ? 10 : 0
  const reasoningPts = input.reasoning.trim().length >= 10 ? 5 : 0

  const score = Math.min(
    100,
    classificationPts + chartPts + levelPts + biasPts + tradePts + reasoningPts
  )

  const correct: string[] = []
  const missed: string[] = []

  if (classificationCorrect) {
    correct.push(
      `Correct: this is ${labelClassification(input.scenario.classification)}.`
    )
  } else {
    missed.push(
      `Expected ${labelClassification(input.scenario.classification)} — ${input.scenario.explanation}`
    )
  }

  if (biasCorrect) {
    correct.push(`Bias (${input.scenario.bias}) matches the chart context.`)
  } else {
    missed.push(
      `A ${input.scenario.bias} bias fits better given the structure shown.`
    )
  }

  if (tradeCorrect) {
    correct.push(
      input.scenario.tradeDecision === "skip"
        ? "Good skip — low-quality structure deserves patience."
        : "Reasonable trade environment for practice bias."
    )
  } else {
    missed.push(
      input.scenario.tradeDecision === "skip"
        ? "This chart is better skipped until structure clears up."
        : "Waiting would have been safer on this setup."
    )
  }

  if (chartPts >= 20) correct.push("Solid markup on swings and structure.")
  else if (input.chartScore > 0)
    missed.push("Review swing highs and lows on the chart.")

  return {
    score,
    passed: score >= 60,
    classificationCorrect,
    biasCorrect,
    tradeCorrect,
    chartScore: input.chartScore,
    correct,
    missed,
    tip: input.scenario.improvementTip,
    summary:
      score >= 80
        ? "Strong trend reading — keep reinforcing the pattern."
        : score >= 60
          ? "Decent read — tighten structure and bias alignment."
          : "Slow down: classify trend first, then decide bias and action.",
  }
}

export function scoreChallengeAnswer(
  scenario: TrendSpotterScenario,
  answer: TrendClassification | null
): boolean {
  return answer === scenario.classification
}

function labelClassification(c: TrendClassification): string {
  switch (c) {
    case "uptrend":
      return "an uptrend"
    case "downtrend":
      return "a downtrend"
    case "range":
      return "a range"
    case "messy":
      return "messy / no clear trend"
  }
}
