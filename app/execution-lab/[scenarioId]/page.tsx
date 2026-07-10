import type { Metadata } from "next"

import { ExecutionScenarioContent } from "@/components/execution-lab/execution-scenario-content"
import { ALL_EXECUTION_SCENARIOS } from "@/content/execution-lab"

export function generateStaticParams() {
  return ALL_EXECUTION_SCENARIOS.map((s) => ({ scenarioId: s.id }))
}

export const metadata: Metadata = {
  title: "Execution Scenario | Trade Trainer",
}

export default async function ExecutionScenarioPage({
  params,
}: {
  params: Promise<{ scenarioId: string }>
}) {
  const { scenarioId } = await params
  return <ExecutionScenarioContent scenarioId={scenarioId} />
}
