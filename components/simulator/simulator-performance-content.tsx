"use client"

import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { StatCard } from "@/components/shared/stat-card"
import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SIMULATOR_STAGES } from "@/content/simulator/stages"
import { PILLAR_LABELS } from "@/lib/competence/types"

export function SimulatorPerformanceContent() {
  const { simulatorStats, competenceScores } = useUserState()

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" render={<Link href="/simulator" />}>
            <ArrowLeftIcon className="size-4" />
            Simulator
          </Button>
          <h1 className="text-2xl font-semibold">Performance Analytics</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Win Rate"
            value={`${simulatorStats.winRate}%`}
            subtext="Simulator sessions"
          />
          <StatCard
            label="Average R:R"
            value={simulatorStats.averageRR > 0 ? `${simulatorStats.averageRR}:1` : "—"}
            subtext="Trade planning"
          />
          <StatCard
            label="Psychology Score"
            value={`${simulatorStats.psychologyScore}%`}
            subtext="Trade management"
          />
          <StatCard
            label="Risk Score"
            value={`${simulatorStats.riskScore}%`}
            subtext="Planning discipline"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-card/50 p-6 space-y-4">
            <h2 className="font-semibold">Setup analysis</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Best setup</p>
                <p className="font-medium capitalize">
                  {simulatorStats.bestSetup?.replace(/-/g, " ") ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Weakest setup</p>
                <p className="font-medium capitalize">
                  {simulatorStats.worstSetup?.replace(/-/g, " ") ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Charts reviewed</p>
                <p className="font-medium">{simulatorStats.chartsReviewed}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Trades journaled</p>
                <p className="font-medium">{simulatorStats.tradesJournaled}</p>
              </div>
            </div>
            {simulatorStats.mostCommonMistake && (
              <p className="text-sm text-amber-600">
                Most common weakness:{" "}
                {simulatorStats.mostCommonMistake.replace(/-/g, " ")}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border/60 bg-card/50 p-6 space-y-4">
            <h2 className="font-semibold">Feeds Trader Readiness</h2>
            <p className="text-sm text-muted-foreground">
              Simulator performance blends into your behavioural competence score.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall competence</span>
                <span>{competenceScores.overallScore}%</span>
              </div>
              <Progress value={competenceScores.overallScore} />
            </div>
            {competenceScores.weakestArea && (
              <p className="text-sm">
                Recommended focus:{" "}
                <Link
                  href={competenceScores.recommendedNextModule}
                  className="text-primary underline-offset-2 hover:underline"
                >
                  {PILLAR_LABELS[competenceScores.weakestArea]}
                </Link>
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          <h2 className="mb-4 font-semibold">Stage completion</h2>
          <div className="space-y-3">
            {SIMULATOR_STAGES.map((s) => {
              const attempts = simulatorStats.sessionsCompleted
              const done = simulatorStats.stagesCompleted >= s.order
              return (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <span>{s.title}</span>
                  <span className={done ? "text-emerald-600" : "text-muted-foreground"}>
                    {done ? "Complete" : attempts > 0 ? "In progress" : "Not started"}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
