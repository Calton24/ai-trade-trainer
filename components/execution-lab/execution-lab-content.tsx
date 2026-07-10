"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowRightIcon, CrosshairIcon, Gamepad2Icon, GraduationCapIcon } from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ALL_EXECUTION_SCENARIOS,
  EXECUTION_SCENARIOS,
  pickRandomScenario,
} from "@/content/execution-lab"
import type { ExecutionMode } from "@/lib/execution-lab/types"
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

export function ExecutionLabContent() {
  const router = useRouter()
  const { executionStats } = useUserState()
  const [mode, setMode] = useState<ExecutionMode>("guided")

  const startArcade = () => {
    const scenario = pickRandomScenario()
    router.push(`/execution-lab/${scenario.id}?mode=arcade`)
  }

  const reversalPack = ALL_EXECUTION_SCENARIOS.filter((s) => s.id.startsWith("rev-"))

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Execution Lab
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Trade simulated markets with a real ticket — drag entry, stop, and
              target on the chart. Size positions, validate risk, and get coached
              like a mentor.
            </p>
          </div>
          {executionStats.attempts > 0 && (
            <div className="text-right text-sm">
              <p className="font-medium">{executionStats.averageScore}% avg execution</p>
              <p className="text-muted-foreground">
                {executionStats.attempts} trades simulated
              </p>
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
              {!m.available && (
                <Badge className="mt-2" variant="secondary">
                  Coming soon
                </Badge>
              )}
            </button>
          ))}
        </div>

        {mode === "guided" && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
            <p className="font-medium">Academy Mode</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your mentor walks you through market context, structure, strategy, and
              execution — with progressive hints so you never get stuck.
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
          <h2 className="text-lg font-semibold">Reversal Academy Pack</h2>
          <p className="text-sm text-muted-foreground">
            20 curated scenarios — healthy continuation, false reversals, London/NY
            sessions, Gold, EOD setups, and no-trade charts.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reversalPack.map((s) => (
              <Link
                key={s.id}
                href={`/execution-lab/${s.id}?mode=${mode}`}
                className="group rounded-xl border border-primary/20 bg-primary/5 p-5 transition-colors hover:border-primary/40"
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
                  {s.reversalGrade ? ` · Grade ${s.reversalGrade}` : ""}
                </p>
              </Link>
            ))}
          </div>
          <Button className="mt-4" variant="outline" render={<Link href="/paths/market-behaviour-academy" />}>
            Open Reversal Academy path
          </Button>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Core Scenarios</h2>
          <p className="text-sm text-muted-foreground">
            Curated setups — trend, continuation, reversal, break & retest, and no-trade
            scenarios.
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

        <div className="rounded-xl border border-border/60 bg-card/50 p-5">
          <p className="text-sm font-medium">Funded Trader Journey</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Progress through demo → £10k challenge → £25k → £50k → funded account.
            Prop-firm rules, drawdown limits, and payouts. Coming in the next milestone.
          </p>
          <Button className="mt-3" variant="outline" render={<Link href="/career" />}>
            Preview Journey
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
