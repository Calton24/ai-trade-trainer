"use client"

import Link from "next/link"
import { ArrowRightIcon, ShieldCheckIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PILLAR_LABELS, PHASE_LABELS } from "@/lib/competence/types"
import type { CompetenceScores } from "@/lib/competence/types"
import type { LivePhaseState } from "@/lib/competence/types"
import { cn } from "@/lib/utils"

interface CompetenceScoreCardProps {
  scores: CompetenceScores
  phase: LivePhaseState
  compact?: boolean
}

export function CompetenceScoreCard({
  scores,
  phase,
  compact,
}: CompetenceScoreCardProps) {
  const phaseLabel = PHASE_LABELS[phase.currentPhase]

  if (compact) {
    return (
      <Link
        href="/progression/live-transition"
        className="block rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 transition-colors hover:border-emerald-500/40"
      >
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-sm font-medium">
            <ShieldCheckIcon className="size-4 text-emerald-600" />
            Competence Score
          </p>
          <Badge variant="outline">{phaseLabel}</Badge>
        </div>
        <p className="mt-2 text-3xl font-bold text-emerald-600">
          {scores.overallScore}%
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Weakest:{" "}
          {scores.weakestArea
            ? PILLAR_LABELS[scores.weakestArea]
            : "Building baseline"}
        </p>
      </Link>
    )
  }

  const pillars: { key: keyof CompetenceScores; label: string }[] = [
    { key: "knowledgeScore", label: PILLAR_LABELS["market-knowledge"] },
    { key: "chartScore", label: PILLAR_LABELS["chart-recognition"] },
    { key: "tradeSelectionScore", label: PILLAR_LABELS["trade-selection"] },
    { key: "riskScore", label: PILLAR_LABELS["risk-management"] },
    { key: "psychologyScore", label: PILLAR_LABELS.psychology },
    { key: "consistencyScore", label: PILLAR_LABELS.consistency },
    { key: "executionScore", label: PILLAR_LABELS.execution },
  ]

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">
              Behavioural Competence Score
            </p>
            <p className="text-4xl font-bold text-emerald-600">
              {scores.overallScore}%
            </p>
          </div>
          <Badge>{phaseLabel}</Badge>
          <p className="max-w-md text-sm text-muted-foreground">
            Scored from drills, journals, streaks, and execution — not quizzes
            alone. This drives your path to simulated and live trading.
          </p>
          <Button render={<Link href="/progression/live-transition" />}>
            View Live Trading Path
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>

        <div className="w-full max-w-sm space-y-3">
          {pillars.map(({ key, label }) => {
            const score = scores[key] as number
            const isWeakest =
              scores.weakestArea &&
              label === PILLAR_LABELS[scores.weakestArea]
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={cn(isWeakest && "font-medium text-amber-600")}
                  >
                    {label}
                  </span>
                  <span>{score}%</span>
                </div>
                <Progress value={score} className="h-1.5" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
