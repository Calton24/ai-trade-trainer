"use client"

import Link from "next/link"
import { useMemo } from "react"
import {
  ArrowLeftIcon,
  RotateCcwIcon,
  TrendingUpIcon,
  TrophyIcon,
} from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  getRecommendedLessonForClassification,
  getTrendScenario,
} from "@/content/trend-spotter"

interface TrendSessionResultsProps {
  sessionId: string
}

export function TrendSessionResults({ sessionId }: TrendSessionResultsProps) {
  const { state } = useUserState()

  const session = useMemo(() => {
    const exercise = state.trendSpotter.exerciseAttempts.find(
      (a) => a.id === sessionId
    )
    if (exercise) return { type: "exercise" as const, data: exercise }

    const challenge = state.trendSpotter.challengeAttempts.find(
      (a) => a.id === sessionId
    )
    if (challenge) return { type: "challenge" as const, data: challenge }

    return null
  }, [state.trendSpotter, sessionId])

  if (!session) {
    return (
      <AppShell>
        <EmptyState
          icon={TrendingUpIcon}
          title="Session not found"
          description="This result may have been cleared or saved on another device."
          action={
            <Button render={<Link href="/trend-spotter" />}>
              Back to Trend Spotter
            </Button>
          }
        />
      </AppShell>
    )
  }

  if (session.type === "challenge") {
    const { data } = session
    const accuracy = Math.round((data.score / data.total) * 100)
    const missed = data.missedIds
      .map((id) => getTrendScenario(id))
      .filter(Boolean)
    const weakest = missed[0]?.classification ?? null
    const recommendedSlug = weakest
      ? getRecommendedLessonForClassification(weakest)
      : "what-is-a-trend"

    return (
      <AppShell>
        <div className="mx-auto flex max-w-lg flex-col gap-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 w-fit"
            render={<Link href="/trend-spotter" />}
          >
            <ArrowLeftIcon data-icon="inline-start" />
            Trend Spotter
          </Button>

          <div className="flex flex-col items-center gap-4 text-center">
            <TrophyIcon className="size-12 text-primary" />
            <h1 className="text-2xl font-semibold">10-Chart Challenge</h1>
            <p className="text-4xl font-bold text-primary">
              {data.score}/{data.total}
            </p>
            <p className="text-muted-foreground">{accuracy}% accuracy</p>
            <p className="text-xs text-muted-foreground">
              {new Date(data.completedAt).toLocaleString()}
            </p>
          </div>

          {weakest && (
            <div className="rounded-xl border border-border/60 p-4">
              <p className="text-sm font-medium">Weakest trend skill</p>
              <Badge variant="outline" className="mt-2 capitalize">
                {weakest}
              </Badge>
            </div>
          )}

          {missed.length > 0 && (
            <div className="rounded-xl border border-border/60 p-4">
              <p className="text-sm font-medium">Charts missed</p>
              <ul className="mt-3 flex flex-col gap-2">
                {missed.map((s) =>
                  s ? (
                    <li
                      key={s.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{s.title}</span>
                      <Button
                        size="xs"
                        variant="outline"
                        render={
                          <Link href={`/trend-spotter/exercises/${s.id}`} />
                        }
                      >
                        Retry
                      </Button>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              render={
                <Link href={`/trend-spotter/lessons/${recommendedSlug}`} />
              }
            >
              Recommended lesson
            </Button>
            <Button
              variant="outline"
              render={<Link href="/trend-spotter/challenge" />}
            >
              <RotateCcwIcon data-icon="inline-start" />
              Play again
            </Button>
          </div>
        </div>
      </AppShell>
    )
  }

  const { data } = session
  const scenario = getTrendScenario(data.exerciseId)
  const passed = data.totalScore >= 60

  return (
    <AppShell>
      <div className="mx-auto flex max-w-lg flex-col gap-6 py-4">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 w-fit"
          render={<Link href="/trend-spotter" />}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          Trend Spotter
        </Button>

        <div>
          <h1 className="text-2xl font-semibold">
            {scenario?.title ?? "Trend Exercise"}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(data.completedAt).toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-border/60 p-6 text-center">
          <p
            className={
              passed ? "text-4xl font-bold text-emerald-400" : "text-4xl font-bold text-amber-400"
            }
          >
            {data.totalScore}/100
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {passed ? "Passed" : "Keep practising — review structure first"}
          </p>
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 p-3">
            <dt className="text-muted-foreground">Classification</dt>
            <dd className="mt-1 capitalize font-medium">
              {data.classification ?? "—"}
            </dd>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <dt className="text-muted-foreground">Bias</dt>
            <dd className="mt-1 capitalize font-medium">{data.bias ?? "—"}</dd>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <dt className="text-muted-foreground">Decision</dt>
            <dd className="mt-1 capitalize font-medium">
              {data.tradeDecision ?? "—"}
            </dd>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <dt className="text-muted-foreground">Chart markup</dt>
            <dd className="mt-1 font-medium">{data.chartScore}%</dd>
          </div>
        </dl>

        {data.reasoning && (
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-sm font-medium">Your reasoning</p>
            <p className="mt-1 text-sm text-muted-foreground">{data.reasoning}</p>
          </div>
        )}

        {scenario && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium text-primary">Correct read</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {scenario.explanation}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {scenario && (
            <Button
              variant="outline"
              render={
                <Link href={`/trend-spotter/exercises/${scenario.id}`} />
              }
            >
              <RotateCcwIcon data-icon="inline-start" />
              Retry exercise
            </Button>
          )}
          <Button render={<Link href="/trend-spotter/challenge" />}>
            Quick challenge
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
