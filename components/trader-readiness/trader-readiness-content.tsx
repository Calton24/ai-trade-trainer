"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ClockIcon,
  InfoIcon,
  TargetIcon,
} from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { ReadinessScoreCard } from "@/components/trader-readiness/readiness-score-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  getTotalEstimatedMinutes,
  READINESS_PILLARS,
  TRADER_READINESS_DISCLAIMER,
} from "@/content/trader-readiness"
import { getCoachingNote } from "@/lib/trader-readiness/recommendations"

export function TraderReadinessContent() {
  const { traderReadinessStats, state } = useUserState()
  const strategyCompleted =
    state.strategyWiki.completedStrategyIds.length >= 1
  const estimatedMinutes = getTotalEstimatedMinutes(strategyCompleted)
  const latest = state.traderReadiness.assessmentAttempts[0]

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-primary">
            <TargetIcon className="size-5" />
            <span className="text-sm font-medium">Trader Readiness</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Trader Readiness Assessment
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            This is not an exam. It is a diagnostic system designed to identify
            your strengths, weaknesses, and readiness for live markets. The goal
            is to answer: what is the single biggest thing preventing you from
            becoming consistently profitable?
          </p>
          <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground/70">
            <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
            {TRADER_READINESS_DISCLAIMER}
          </p>
        </div>

        <ReadinessScoreCard stats={traderReadinessStats} />

        {traderReadinessStats.hasBaseline && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-card/50 p-6">
              <h2 className="font-semibold">Readiness Roadmap</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Level</span>
                  <span className="font-medium">{traderReadinessStats.traderLevelLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Strongest Skill</span>
                  <span className="font-medium text-primary">
                    {traderReadinessStats.strongestPillarLabel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weakest Skill</span>
                  <span className="font-medium text-destructive">
                    {traderReadinessStats.weakestPillarLabel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recommended Focus</span>
                  <span className="font-medium">
                    {traderReadinessStats.recommendedFocus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Time to Improve</span>
                  <span className="font-medium">
                    {traderReadinessStats.estimatedTimeToImprove}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Milestone</span>
                  <span className="font-medium">{traderReadinessStats.nextMilestone}</span>
                </div>
              </div>
              <Button
                className="mt-4"
                variant="outline"
                render={<Link href={traderReadinessStats.recommendedHref} />}
              >
                Start recommended path
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </div>

            <div className="rounded-xl border border-border/60 bg-card/50 p-6">
              <h2 className="font-semibold">Suggested Actions</h2>
              <ul className="mt-4 space-y-2">
                {traderReadinessStats.suggestedActions.map((action) => (
                  <li
                    key={action}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                    {action}
                  </li>
                ))}
              </ul>

              {traderReadinessStats.detectedWeaknesses.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium">Detected Weaknesses</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {traderReadinessStats.detectedWeaknesses.map((w) => (
                      <Badge key={w} variant="outline">
                        {w}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <p className="text-sm font-medium text-primary">AI Coaching Note</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {getCoachingNote(traderReadinessStats)}
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">
                {traderReadinessStats.hasBaseline
                  ? "Retake Assessment"
                  : "Start Full Assessment"}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <ClockIcon className="size-4" />
                ~{estimatedMinutes} minutes across {READINESS_PILLARS.filter(
                  (p) => !p.requiresStrategyCompletion || strategyCompleted
                ).length}{" "}
                pillars
              </p>
            </div>
            <Button render={<Link href="/trader-readiness/assessment" />}>
              {traderReadinessStats.hasBaseline ? "Retake Assessment" : "Begin Assessment"}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {READINESS_PILLARS.filter(
              (p) => !p.requiresStrategyCompletion || strategyCompleted
            ).map((pillar) => {
              const score = traderReadinessStats.pillarScores[pillar.id]
              return (
                <div
                  key={pillar.id}
                  className="rounded-lg border border-border/40 bg-background/50 p-4"
                >
                  <div className="flex items-center gap-2">
                    <span>{pillar.icon}</span>
                    <p className="text-sm font-medium">{pillar.title}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {pillar.description}
                  </p>
                  {score > 0 && (
                    <p className="mt-2 text-sm font-medium text-primary">
                      Last score: {score}%
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {latest && (
          <div className="text-center text-xs text-muted-foreground">
            Last assessment: {new Date(latest.completedAt).toLocaleString()} ·{" "}
            {traderReadinessStats.assessmentsCompleted} assessment
            {traderReadinessStats.assessmentsCompleted !== 1 ? "s" : ""} completed
          </div>
        )}
      </div>
    </AppShell>
  )
}
