"use client"

import { ExpandIcon } from "lucide-react"

import { ChartLabWorkspace } from "@/components/chart-lab/chart-lab-workspace"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getChartScenario } from "@/content/chart-scenarios"
import type { ChartScenario } from "@/lib/charts/types"

interface ChartLabProps {
  scenarioId?: string
  scenario?: ChartScenario
  /** Optional caption shown above the chart in lessons. */
  caption?: string
}

const CONCEPT_LABELS: Record<string, string> = {
  candlesticks: "Candlesticks",
  "swing-high-low": "Market structure",
  trend: "Trend",
  support: "Support",
  resistance: "Resistance",
  breakout: "Breakout",
  fakeout: "Fakeout",
  "break-retest": "Break & retest",
  "icc-indication": "ICC",
  "icc-correction": "ICC",
  "icc-continuation": "ICC",
  "risk-reward": "Risk/reward",
}

export function ChartLab({ scenarioId, scenario: scenarioProp, caption }: ChartLabProps) {
  const scenario = scenarioProp ?? (scenarioId ? getChartScenario(scenarioId) : undefined)

  if (!scenario) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 bg-card/40 p-6 text-center text-sm text-muted-foreground">
        Chart scenario not found.
      </div>
    )
  }

  const interactive = Boolean(scenario.expectedAnswer)

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card/50">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{scenario.title}</p>
            <Badge variant="secondary" className="text-[10px]">
              {CONCEPT_LABELS[scenario.concept] ?? scenario.concept}
            </Badge>
            {interactive && (
              <Badge className="text-[10px]">Practice</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {caption ?? scenario.description}
          </p>
        </div>

        <Dialog>
          <DialogTrigger
            render={
              <Button variant="outline" size="sm" className="shrink-0">
                <ExpandIcon data-icon="inline-start" />
                Expand
              </Button>
            }
          />
          <DialogContent
            showCloseButton
            className="flex max-h-[92vh] max-w-[min(1180px,96vw)] flex-col overflow-y-auto sm:max-w-[min(1180px,96vw)]"
          >
            <DialogHeader>
              <DialogTitle>{scenario.title}</DialogTitle>
              <DialogDescription>
                {interactive
                  ? "Read the concept, then prove you can see it on the chart."
                  : scenario.description}
              </DialogDescription>
            </DialogHeader>
            <ChartLabWorkspace scenario={scenario} variant="full" />
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-4">
        <ChartLabWorkspace scenario={scenario} variant="embed" />
      </div>
    </div>
  )
}
