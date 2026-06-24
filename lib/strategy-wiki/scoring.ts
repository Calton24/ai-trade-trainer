import type {
  StrategyPracticeExercise,
  StrategyPracticeScore,
  StrategyTradeDecision,
} from "@/lib/strategy-wiki/types"

export function scoreStrategyPractice(input: {
  exercise: StrategyPracticeExercise
  chartScore: number
  tradeDecision: StrategyTradeDecision | null
  reasoning: string
}): StrategyPracticeScore {
  const tradeCorrect =
    input.tradeDecision === input.exercise.expectedTradeDecision
  const chartPts = Math.round((input.chartScore / 100) * 50)
  const tradePts = tradeCorrect ? 30 : 0
  const reasonPts = input.reasoning.trim().length >= 15 ? 20 : 0
  const score = Math.min(100, chartPts + tradePts + reasonPts)

  const correct: string[] = []
  const missed: string[] = []

  if (chartPts >= 40) correct.push("Solid chart markup on the key setup levels.")
  else if (input.chartScore > 0)
    missed.push("Review where to mark entry, stop, and target on this setup.")

  if (tradeCorrect) {
    correct.push(
      input.exercise.expectedTradeDecision === "skip"
        ? "Good discipline — this chart is better skipped."
        : "Reasonable trade/skip call for this practice scenario."
    )
  } else {
    missed.push(
      input.exercise.expectedTradeDecision === "skip"
        ? "This setup quality suggests waiting rather than forcing a trade."
        : "The setup was present — review the trigger and confirmation steps."
    )
  }

  if (reasonPts > 0) correct.push("Clear written reasoning.")
  else missed.push("Add a one-sentence plan before submitting.")

  return {
    score,
    passed: score >= 60,
    chartScore: input.chartScore,
    tradeCorrect,
    correct,
    missed,
    tip: input.exercise.improvementTip,
    summary:
      score >= 80
        ? "Strong repetition — keep drilling this setup."
        : score >= 60
          ? "Good effort — one more pass on the setup steps."
          : "Review the playbook steps, then retry this exercise.",
  }
}

export function scoreChallengeAnswer(
  expectedPresent: boolean,
  userSaysPresent: boolean
): boolean {
  return expectedPresent === userSaysPresent
}
