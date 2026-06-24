import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { TrendExerciseWorkspace } from "@/components/trend-spotter/trend-exercise-workspace"
import { getTrendScenario } from "@/content/trend-spotter"

interface PageProps {
  params: Promise<{ exerciseId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { exerciseId } = await params
  const scenario = getTrendScenario(exerciseId)
  return {
    title: scenario
      ? `${scenario.title} — Trend Exercise`
      : "Trend Exercise",
  }
}

export default async function TrendExercisePage({ params }: PageProps) {
  const { exerciseId } = await params
  const scenario = getTrendScenario(exerciseId)
  if (!scenario) notFound()
  return <TrendExerciseWorkspace scenario={scenario} />
}
