"use client"

import { StrategyPracticeWorkspace } from "@/components/strategy-wiki/strategy-practice-workspace"
import { StrategyProgressionGate } from "@/components/strategy-wiki/strategy-progression-gate"
import type { TradingStrategy } from "@/lib/strategy-wiki/types"
import type { StrategyPracticeExercise } from "@/lib/strategy-wiki/types"

interface StrategyPracticePageClientProps {
  strategy: TradingStrategy
  exercise: StrategyPracticeExercise
  exerciseIndex: number
  totalExercises: number
}

export function StrategyPracticePageClient({
  strategy,
  exercise,
  exerciseIndex,
  totalExercises,
}: StrategyPracticePageClientProps) {
  return (
    <StrategyProgressionGate strategy={strategy} mode="practice">
      <StrategyPracticeWorkspace
        strategy={strategy}
        exercise={exercise}
        exerciseIndex={exerciseIndex}
        totalExercises={totalExercises}
      />
    </StrategyProgressionGate>
  )
}
