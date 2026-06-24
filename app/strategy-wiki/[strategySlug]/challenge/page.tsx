import { notFound } from "next/navigation"

import { StrategyChallengePageClient } from "@/components/strategy-wiki/strategy-challenge-page-client"
import { getStrategyBySlug } from "@/content/strategies"

export default async function StrategyChallengePage({
  params,
}: {
  params: Promise<{ strategySlug: string }>
}) {
  const { strategySlug } = await params
  const strategy = getStrategyBySlug(strategySlug)
  if (!strategy) notFound()
  return <StrategyChallengePageClient strategy={strategy} />
}
