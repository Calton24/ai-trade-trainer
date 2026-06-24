import { notFound, redirect } from "next/navigation"

import { getStrategyBySlug } from "@/content/strategies"

export default async function StrategyLessonPage({
  params,
}: {
  params: Promise<{ strategySlug: string; lessonSlug: string }>
}) {
  const { strategySlug, lessonSlug } = await params
  const strategy = getStrategyBySlug(strategySlug)
  if (!strategy) notFound()

  if (lessonSlug === "overview") {
    redirect(`/strategy-wiki/${strategySlug}`)
  }

  const step = strategy.setupSteps.find(
    (s) => s.id === lessonSlug || s.id.endsWith(lessonSlug)
  )
  if (!step) notFound()

  redirect(`/strategy-wiki/${strategySlug}#${step.id}`)
}
