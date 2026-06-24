"use client"

import Link from "next/link"
import { useMemo } from "react"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  TargetIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getPillarById } from "@/content/trader-readiness"
import { traderLevelDescription } from "@/lib/trader-readiness/levels"
import { getCoachingNote } from "@/lib/trader-readiness/recommendations"
import { cn } from "@/lib/utils"

interface ReadinessResultsProps {
  sessionId: string
}

export function ReadinessResults({ sessionId }: ReadinessResultsProps) {
  const { state, traderReadinessStats } = useUserState()

  const session = useMemo(
    () =>
      state.traderReadiness.assessmentAttempts.find((a) => a.id === sessionId),
    [state.traderReadiness.assessmentAttempts, sessionId]
  )

  if (!session) {
    return (
      <AppShell>
        <EmptyState
          icon={TargetIcon}
          title="Assessment not found"
          description="This result may have been cleared or saved on another device."
          action={
            <Button render={<Link href="/trader-readiness" />}>
              Back to Trader Readiness
            </Button>
          }
        />
      </AppShell>
    )
  }

  const stats = traderReadinessStats

  return (
    <AppShell>
      <div className="mx-auto flex max-w-2xl flex-col gap-6 py-4">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 w-fit"
          render={<Link href="/trader-readiness" />}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          Trader Readiness
        </Button>

        <div className="flex flex-col items-center gap-4 text-center">
          <TargetIcon className="size-12 text-primary" />
          <h1 className="text-2xl font-semibold">Assessment Complete</h1>
          <p className="text-5xl font-bold text-primary">{session.overallScore}%</p>
          <Badge className="text-sm">{stats.traderLevelLabel}</Badge>
          <p className="text-sm text-muted-foreground">
            {new Date(session.completedAt).toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          <h2 className="font-semibold">Skill Breakdown</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(session.pillarScores).map(([id, score]) => {
              const pillar = getPillarById(id)
              const isWeakest = id === session.weakestPillar
              const isStrongest = id === session.strongestPillar
              return (
                <div key={id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5">
                      {pillar.title}
                      {isWeakest && (
                        <TrendingDownIcon className="size-3 text-destructive" />
                      )}
                      {isStrongest && (
                        <TrendingUpIcon className="size-3 text-primary" />
                      )}
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        isWeakest && "text-destructive",
                        isStrongest && "text-primary"
                      )}
                    >
                      {score}%
                    </span>
                  </div>
                  <Progress value={score} className="h-1.5" />
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="font-semibold text-primary">Your Readiness Roadmap</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Weakest Area</span>
              <span className="font-medium text-destructive">
                {stats.weakestPillarLabel}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recommended Next</span>
              <span className="font-medium">{stats.recommendedFocus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Readiness</span>
              <span className="font-medium">{stats.traderLevelLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time to Improve</span>
              <span className="font-medium">{stats.estimatedTimeToImprove}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next Milestone</span>
              <span className="font-medium">{stats.nextMilestone}</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {traderLevelDescription(session.traderLevel)}
          </p>
        </div>

        {session.detectedWeaknesses.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <h2 className="font-semibold">Detected Weaknesses</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {session.detectedWeaknesses.map((w) => (
                <Badge key={w} variant="outline">
                  {w}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          <h2 className="font-semibold">AI Coaching Note</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {getCoachingNote(stats)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button render={<Link href={stats.recommendedHref} />}>
            Start recommended path
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button variant="outline" render={<Link href="/trader-readiness/assessment" />}>
            Retake assessment
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          +{session.xpEarned} Trader Readiness XP earned
        </p>
      </div>
    </AppShell>
  )
}
