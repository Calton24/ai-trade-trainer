import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon, LineChartIcon } from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getInteractiveScenarios } from "@/content/chart-scenarios"

export const metadata: Metadata = {
  title: "Chart Lab — TradeTrainer AI",
  description:
    "Practice reading charts by marking structure, levels, and trades on generated scenarios.",
}

export default function ChartLabIndexPage() {
  const scenarios = getInteractiveScenarios()

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary">
            <LineChartIcon className="size-5" />
            <span className="text-sm font-medium">Chart Lab</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Prove you can read the chart
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Pick a scenario, mark the structure or trade the task asks for, and
            get instant beginner-friendly feedback. Every chart is generated for
            practice — no real money, no live trading.
          </p>
          <p className="text-[11px] text-muted-foreground/70">
            Educational simulation only. Not financial advice or a trade
            recommendation.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario) => (
            <Link
              key={scenario.id}
              href={`/chart-lab/${scenario.id}`}
              className="group flex flex-col gap-3 rounded-xl border border-border/60 bg-card/50 p-5 transition-colors hover:border-primary/30 hover:bg-card"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary" className="capitalize">
                  {scenario.difficulty}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {scenario.estimatedMinutes} min
                </span>
              </div>
              <div>
                <h2 className="font-medium">{scenario.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {scenario.description}
                </p>
              </div>
              <div className="mt-auto flex items-center gap-1 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Open lab
                <ArrowRightIcon className="size-3.5" />
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center">
          <Button variant="outline" render={<Link href="/training" />}>
            Classic chart drills with AI coach
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
