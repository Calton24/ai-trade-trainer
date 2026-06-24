"use client"

import { use } from "react"
import { notFound } from "next/navigation"

import { StrategyPracticePageClient } from "@/components/strategy-wiki/strategy-practice-page-client"
import { getStrategyBySlug } from "@/content/strategies"

export default function StrategyPracticePage({
  params,
  searchParams,
}: {
  params: Promise<{ strategySlug: string }>
  searchParams: Promise<{ exercise?: string }>
}) {
  const { strategySlug } = use(params)
  const { exercise: exerciseParam } = use(searchParams)
  const strategy = getStrategyBySlug(strategySlug)
  if (!strategy || strategy.practiceExercises.length === 0) notFound()

  const exerciseIndex = Math.min(
    Math.max(0, parseInt(exerciseParam ?? "0", 10) || 0),
    strategy.practiceExercises.length - 1
  )
  const exercise = strategy.practiceExercises[exerciseIndex]

  return (
    <StrategyPracticePageClient
      strategy={strategy}
      exercise={exercise}
      exerciseIndex={exerciseIndex}
      totalExercises={strategy.practiceExercises.length}
    />
  )
}
