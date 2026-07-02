"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  BarChart3Icon,
  LockIcon,
  PlayIcon,
} from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { TraderRoadmapWidget } from "@/components/simulator/trader-roadmap-widget"
import { useUserState } from "@/components/providers/user-state-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SIMULATOR_STAGES } from "@/content/simulator/stages"
import { cn } from "@/lib/utils"

export function SimulatorContent() {
  const { simulatorStats, state, isSimulatorStageUnlocked } = useUserState()
  const completed = state.simulator.completedStageIds

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Trading Simulator
            </h1>
            <p className="text-muted-foreground">
              Prove competence with replay charts, trade decisions, and journaling —
              not just content consumption.
            </p>
          </div>
          <Button variant="outline" render={<Link href="/simulator/performance" />}>
            <BarChart3Icon className="size-4" />
            Performance
          </Button>
        </div>

        <TraderRoadmapWidget xp={state.progress.xp} />

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Simulator progress</p>
              <p className="text-2xl font-bold">
                {simulatorStats.stagesCompleted} / {simulatorStats.totalStages} stages
              </p>
            </div>
            <div className="w-full max-w-xs">
              <Progress
                value={
                  (simulatorStats.stagesCompleted / simulatorStats.totalStages) * 100
                }
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {SIMULATOR_STAGES.map((s) => {
            const unlocked = isSimulatorStageUnlocked(s.id)
            const done = completed.includes(s.id)
            return (
              <div
                key={s.id}
                className={cn(
                  "flex flex-col rounded-xl border p-5",
                  unlocked
                    ? "border-border/60 bg-card/50"
                    : "border-border/40 bg-muted/20 opacity-80"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Stage {s.order}</p>
                    <h2 className="font-semibold">{s.title}</h2>
                  </div>
                  {done ? (
                    <Badge className="bg-emerald-600">Complete</Badge>
                  ) : unlocked ? (
                    <Badge variant="outline">Unlocked</Badge>
                  ) : (
                    <LockIcon className="size-4 text-muted-foreground" />
                  )}
                </div>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {s.description}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  ~{s.estimatedMinutes} min · +{s.xpReward} XP
                </p>
                {unlocked ? (
                  <Button className="mt-4" render={<Link href={`/simulator/${s.id}`} />}>
                    <PlayIcon className="size-4" />
                    {done ? "Practice again" : "Start stage"}
                    <ArrowRightIcon data-icon="inline-end" />
                  </Button>
                ) : (
                  <p className="mt-4 text-xs text-muted-foreground">
                    Complete the previous stage to unlock.
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
