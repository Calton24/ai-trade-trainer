"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

import { AppShell } from "@/components/layout/app-shell"
import { ExecutionWorkspace } from "@/components/execution-lab/execution-workspace"
import { GuidedWorkspace } from "@/components/execution-lab/guided-workspace"
import { getExecutionScenario, pickRandomScenario } from "@/content/execution-lab"
import type { ExecutionMode } from "@/lib/execution-lab/types"

function ExecutionScenarioInner({ scenarioId }: { scenarioId: string }) {
  const router = useRouter()
  const params = useSearchParams()
  const mode = (params.get("mode") as ExecutionMode) ?? "practice"
  const scenario = getExecutionScenario(scenarioId)

  if (!scenario) {
    return (
      <AppShell>
        <p className="text-muted-foreground">Scenario not found.</p>
      </AppShell>
    )
  }

  const handleNext =
    mode === "arcade"
      ? () => {
          const next = pickRandomScenario([scenario.id])
          router.push(`/execution-lab/${next.id}?mode=arcade`)
        }
      : undefined

  return (
    <AppShell>
      {mode === "guided" ? (
        <GuidedWorkspace scenario={scenario} mode={mode} onNext={handleNext} />
      ) : (
        <ExecutionWorkspace scenario={scenario} mode={mode} onNext={handleNext} />
      )}
    </AppShell>
  )
}

export function ExecutionScenarioContent({ scenarioId }: { scenarioId: string }) {
  return (
    <Suspense>
      <ExecutionScenarioInner scenarioId={scenarioId} />
    </Suspense>
  )
}
