"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import { ArrowRightIcon, CrosshairIcon, Gamepad2Icon, GraduationCapIcon } from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { ExecutionAcademyPackCard } from "@/components/execution-lab/execution-academy-pack-card"
import { useUserState } from "@/components/providers/user-state-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  EXECUTION_PACKS,
  EXECUTION_SCENARIOS,
  getPackScenarios,
  pickRandomScenario,
} from "@/content/execution-lab"
import type { ExecutionMode, ExecutionPackId } from "@/lib/execution-lab/types"
import { computeAllPackProgress } from "@/lib/execution-lab/pack-progress"
import { cn } from "@/lib/utils"

const MODES: {
  id: ExecutionMode
  label: string
  description: string
  icon: typeof GraduationCapIcon
  available: boolean
}[] = [
  {
    id: "guided",
    label: "Academy",
    description: "Step-by-step coaching through every decision.",
    icon: GraduationCapIcon,
    available: true,
  },
  {
    id: "practice",
    label: "Practice",
    description: "Analyse, plan, size, and submit — minimal hints.",
    icon: CrosshairIcon,
    available: true,
  },
  {
    id: "arcade",
    label: "Arcade",
    description: "Random charts back-to-back. Ranked reps.",
    icon: Gamepad2Icon,
    available: true,
  },
]

const PACK_IDS: ExecutionPackId[] = ["continuation", "reversal", "patience", "eod"]

function isPackId(value: string | null): value is ExecutionPackId {
  return PACK_IDS.includes(value as ExecutionPackId)
}

export function ExecutionLabContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { executionStats, state } = useUserState()
  const [mode, setMode] = useState<ExecutionMode>("guided")

  const packFilter = searchParams.get("pack")
  const activePack = isPackId(packFilter) ? packFilter : null

  const packProgress = useMemo(() => computeAllPackProgress(state), [state])

  const startArcade = () => {
    const scenario = pickRandomScenario()
    router.push(`/execution-lab/${scenario.id}?mode=arcade`)
  }

  const browseScenarios = activePack ? getPackScenarios(activePack) : []

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Execution Lab
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Professional deliberate practice — four academies, 80 scenarios, guided
              coaching, and institutional trade review.
            </p>
          </div>
          {executionStats.attempts > 0 && (
            <div className="text-right text-sm">
              <p className="font-medium">{executionStats.averageScore}% avg execution</p>
              <p className="text-muted-foreground">
                {executionStats.attempts} trades simulated
              </p>
              <Button
                className="mt-2"
                variant="ghost"
                size="sm"
                render={<Link href="/execution-lab/performance" />}
              >
                View performance
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              disabled={!m.available}
              onClick={() => m.available && setMode(m.id)}
              className={cn(
                "rounded-xl border p-4 text-left transition-colors",
                mode === m.id && m.available
                  ? "border-primary bg-primary/10"
                  : "border-border/60 bg-card/50",
                !m.available && "opacity-50"
              )}
            >
              <m.icon className="size-5 text-primary" />
              <p className="mt-2 font-medium">{m.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
            </button>
          ))}
        </div>

        {mode === "guided" && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
            <p className="font-medium">Academy Mode</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your mentor walks you through behaviour, structure, strategy, and
              execution — with contextual coaching on every step.
            </p>
          </div>
        )}

        {mode === "arcade" && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
            <p className="font-medium">Arcade Session</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Random market. Random setup. Trade it. Next chart. No hints.
            </p>
            <Button className="mt-4" onClick={startArcade}>
              Start Arcade Session
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold">Professional Academies</h2>
          <p className="text-sm text-muted-foreground">
            Four training programs — 20 scenarios each. Bronze → Master progression.
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {EXECUTION_PACKS.map((pack) => {
              const progress = packProgress.find((p) => p.packId === pack.id)!
              return (
                <ExecutionAcademyPackCard
                  key={pack.id}
                  pack={pack}
                  progress={progress}
                  mode={mode}
                />
              )
            })}
          </div>
        </div>

        {activePack && (
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">
                {EXECUTION_PACKS.find((p) => p.id === activePack)?.title}
              </h2>
              <Button variant="ghost" size="sm" render={<Link href="/execution-lab" />}>
                All academies
              </Button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {browseScenarios.map((s) => (
                <Link
                  key={s.id}
                  href={`/execution-lab/${s.id}?mode=${mode}`}
                  className="group rounded-xl border border-border/60 bg-card/50 p-5 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium group-hover:text-primary">{s.title}</p>
                    <Badge variant="outline" className="shrink-0 text-[10px]">
                      {s.difficulty}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {s.symbol} · {s.behaviour ?? s.category}
                    {s.session ? ` · ${s.session}` : ""}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!activePack && (
          <div>
            <h2 className="text-lg font-semibold">Core Scenarios</h2>
            <p className="text-sm text-muted-foreground">
              Quick-start demos — trend, continuation, reversal, break & retest, and
              no-trade.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {EXECUTION_SCENARIOS.map((s) => (
                <Link
                  key={s.id}
                  href={`/execution-lab/${s.id}?mode=${mode}`}
                  className="group rounded-xl border border-border/60 bg-card/50 p-5 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium group-hover:text-primary">{s.title}</p>
                    <Badge variant="outline" className="shrink-0 text-[10px]">
                      {s.difficulty}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {s.symbol} · {s.category.replace("-", " ")}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-border/60 bg-card/50 p-5">
          <p className="text-sm font-medium">Funded Trader Journey</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Progress through demo → challenge → funded account. Coming in the next
            milestone.
          </p>
          <Button className="mt-3" variant="outline" render={<Link href="/career" />}>
            Preview Journey
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
