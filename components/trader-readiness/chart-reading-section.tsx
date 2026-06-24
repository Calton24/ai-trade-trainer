"use client"

import { useState } from "react"

import { ChartLabWorkspace } from "@/components/chart-lab/chart-lab-workspace"
import { getChartScenario } from "@/content/chart-scenarios"
import type { ChartReadingExercise } from "@/lib/trader-readiness/types"

interface ChartReadingSectionProps {
  exercise: ChartReadingExercise
  onComplete: (score: number) => void
}

export function ChartReadingSection({
  exercise,
  onComplete,
}: ChartReadingSectionProps) {
  const [score, setScore] = useState<number | null>(null)
  const scenario = getChartScenario(exercise.chartScenarioId)

  if (!scenario) {
    return (
      <p className="text-sm text-muted-foreground">Chart scenario not found.</p>
    )
  }

  if (score !== null) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/50 p-5">
        <p className="font-medium">Chart Reading — {score}%</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {score >= 70
            ? "Good chart recognition. Keep practising complex setups."
            : "Review trend structure and level marking in Chart Lab."}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{exercise.instruction}</p>
      <ChartLabWorkspace
        scenario={scenario}
        variant="embed"
        onComplete={(result) => {
          setScore(result.score)
          onComplete(result.score)
        }}
      />
    </div>
  )
}
