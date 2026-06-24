import { notFound } from "next/navigation"

import { StrategyDetailContent } from "@/components/strategy-wiki/strategy-detail-content"
import { getStrategyBySlug } from "@/content/strategies"

export default async function StrategyDetailPage({
  params,
}: {
  params: Promise<{ strategySlug: string }>
}) {
  const { strategySlug } = await params
  const strategy = getStrategyBySlug(strategySlug)
  if (!strategy) notFound()
  return <StrategyDetailContent strategy={strategy} />
}
