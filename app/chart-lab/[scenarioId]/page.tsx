import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { ChartLabWorkspace } from "@/components/chart-lab/chart-lab-workspace"
import { AppShell } from "@/components/layout/app-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  getAllChartScenarios,
  getChartScenario,
} from "@/content/chart-scenarios"

interface ChartLabPageProps {
  params: Promise<{ scenarioId: string }>
}

export async function generateStaticParams() {
  return getAllChartScenarios().map((s) => ({ scenarioId: s.id }))
}

export async function generateMetadata({
  params,
}: ChartLabPageProps): Promise<Metadata> {
  const { scenarioId } = await params
  const scenario = getChartScenario(scenarioId)
  if (!scenario) return { title: "Chart Lab" }
  return {
    title: `${scenario.title} — Chart Lab`,
    description: scenario.description,
  }
}

export default async function ChartLabPage({ params }: ChartLabPageProps) {
  const { scenarioId } = await params
  const scenario = getChartScenario(scenarioId)
  if (!scenario) notFound()

  return (
    <AppShell>
      <div className="flex flex-col gap-5">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          render={<Link href="/chart-lab" />}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          All practice scenarios
        </Button>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {scenario.title}
            </h1>
            <Badge variant="secondary">{scenario.symbol}</Badge>
            <Badge variant="secondary">{scenario.timeframe}</Badge>
            <Badge className="capitalize">{scenario.difficulty}</Badge>
          </div>
          <p className="max-w-2xl text-muted-foreground">
            Read the concept, then prove you can see it on the chart. Charts are
            generated for practice, so you can learn without risking real money.
          </p>
        </div>

        <ChartLabWorkspace scenario={scenario} variant="full" />
      </div>
    </AppShell>
  )
}
