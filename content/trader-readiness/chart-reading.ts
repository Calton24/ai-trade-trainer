import type { ChartReadingExercise } from "@/lib/trader-readiness/types"

export const CHART_READING_EXERCISES: ChartReadingExercise[] = [
  {
    id: "cr-uptrend",
    chartScenarioId: "task-spot-trend",
    title: "Trend identification",
    instruction:
      "Mark the most recent higher low that confirms the uptrend on this chart.",
    scoringWeights: {
      trend: 20,
      support: 20,
      resistance: 20,
      breakout: 20,
      retest: 20,
    },
  },
]

export function getChartReadingExercise(id?: string): ChartReadingExercise {
  return CHART_READING_EXERCISES.find((e) => e.id === id) ?? CHART_READING_EXERCISES[0]
}
