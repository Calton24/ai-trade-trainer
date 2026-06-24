"use client"

import { ChartLabWorkspace } from "@/components/chart-lab/chart-lab-workspace"
import { useUserState } from "@/components/providers/user-state-provider"
import type { ChartScenario } from "@/lib/charts/types"

interface ChartLabPageClientProps {
  scenario: ChartScenario
}

export function ChartLabPageClient({ scenario }: ChartLabPageClientProps) {
  const { recordChartLabActivity } = useUserState()
  const interactive = Boolean(scenario.expectedAnswer)

  return (
    <ChartLabWorkspace
      scenario={scenario}
      variant="full"
      onComplete={(result) => {
        if (interactive) {
          recordChartLabActivity(scenario.id, scenario.title, result.score)
        }
      }}
    />
  )
}
