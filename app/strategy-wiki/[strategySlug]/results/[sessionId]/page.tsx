"use client"

import { use } from "react"

import { StrategyResultsContent } from "@/components/strategy-wiki/strategy-results-content"

export default function StrategyResultsPage({
  params,
}: {
  params: Promise<{ strategySlug: string; sessionId: string }>
}) {
  const { strategySlug, sessionId } = use(params)
  return (
    <StrategyResultsContent strategySlug={strategySlug} sessionId={sessionId} />
  )
}
