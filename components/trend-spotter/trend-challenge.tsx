"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeftIcon, RotateCcwIcon, TrophyIcon } from "lucide-react"

import { ChartLabWorkspace } from "@/components/chart-lab/chart-lab-workspace"
import { AppShell } from "@/components/layout/app-shell"
import { ClassificationButtons } from "@/components/trend-spotter/classification-buttons"
import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getChartScenario } from "@/content/chart-scenarios"
import {
  getChallengeDeck,
  getRecommendedLessonForClassification,
} from "@/content/trend-spotter"
import { scoreChallengeAnswer } from "@/lib/trend-spotter/scoring"
import type { TrendClassification } from "@/lib/trend-spotter/types"

export function TrendChallenge() {
  const { recordTrendChallenge } = useUserState()
  const deck = useMemo(() => getChallengeDeck(10), [])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<(TrendClassification | null)[]>(
    Array(deck.length).fill(null)
  )
  const [finished, setFinished] = useState(false)
  const [saved, setSaved] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const current = deck[index]
  const chartScenario = current
    ? getChartScenario(current.chartScenarioId)
    : undefined

  const score = deck.reduce((acc, s, i) => {
    const a = answers[i]
    return acc + (a && scoreChallengeAnswer(s, a) ? 1 : 0)
  }, 0)

  const missed = deck.filter(
    (s, i) => answers[i] && !scoreChallengeAnswer(s, answers[i])
  )

  const progress = deck.length > 0 ? ((index + 1) / deck.length) * 100 : 0

  const handleSelect = (value: TrendClassification) => {
    const next = [...answers]
    next[index] = value
    setAnswers(next)
    if (index < deck.length - 1) {
      setTimeout(() => setIndex((i) => i + 1), 300)
    } else {
      setFinished(true)
    }
  }

  const handleFinish = () => {
    if (saved) return
    const missedIds = deck
      .filter((s, i) => answers[i] && !scoreChallengeAnswer(s, answers[i]))
      .map((s) => s.id)
    const xpEarned = score * 5 + (score === deck.length ? 25 : 0)
    const id = crypto.randomUUID()
    recordTrendChallenge({
      id,
      score,
      total: deck.length,
      missedIds,
      xpEarned,
    })
    setSessionId(id)
    setSaved(true)
  }

  useEffect(() => {
    if (finished && !saved) handleFinish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, saved])

  if (finished) {
    const accuracy = Math.round((score / deck.length) * 100)
    const weakest = missed.length > 0 ? missed[0]?.classification : null
    const recommendedSlug = weakest
      ? getRecommendedLessonForClassification(weakest)
      : "what-is-a-trend"

    return (
      <AppShell>
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-8 text-center">
          <TrophyIcon className="size-12 text-primary" />
          <h1 className="text-2xl font-semibold">Challenge complete</h1>
          <p className="text-4xl font-bold text-primary">
            {score}/{deck.length}
          </p>
          <p className="text-muted-foreground">{accuracy}% accuracy</p>

          {weakest && (
            <p className="text-sm text-muted-foreground">
              Weakest area:{" "}
              <span className="capitalize text-foreground">{weakest}</span>
            </p>
          )}

          {missed.length > 0 && (
            <div className="w-full rounded-xl border border-border/60 p-4 text-left">
              <p className="text-sm font-medium">Charts missed</p>
              <ul className="mt-2 flex flex-col gap-1">
                {missed.map((s) => (
                  <li key={s.id} className="text-xs text-muted-foreground">
                    {s.title} — expected{" "}
                    <span className="capitalize">{s.classification}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2">
            {sessionId && (
              <Button
                render={
                  <Link href={`/trend-spotter/results/${sessionId}`} />
                }
              >
                View full results
              </Button>
            )}
            <Button
              render={
                <Link href={`/trend-spotter/lessons/${recommendedSlug}`} />
              }
            >
              Recommended lesson
            </Button>
            {missed.length > 0 && (
              <Button
                variant="outline"
                render={
                  <Link
                    href={`/trend-spotter/exercises/${missed[0]?.id}`}
                  />
                }
              >
                Retry missed chart
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setIndex(0)
                setAnswers(Array(deck.length).fill(null))
                setFinished(false)
                setSaved(false)
                setSessionId(null)
              }}
            >
              <RotateCcwIcon data-icon="inline-start" />
              Play again
            </Button>
            <Button variant="ghost" render={<Link href="/trend-spotter" />}>
              Back to Trend Spotter
            </Button>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 -ml-2"
            render={<Link href="/trend-spotter" />}
          >
            <ArrowLeftIcon data-icon="inline-start" />
            Trend Spotter
          </Button>
          <h1 className="text-xl font-semibold">Quick 10-Chart Challenge</h1>
          <p className="text-sm text-muted-foreground">
            Chart {index + 1} of {deck.length} — classify fast
          </p>
          <Progress value={progress} className="mt-3 h-2" />
        </div>

        {chartScenario && (
          <div className="overflow-hidden rounded-xl border border-border/60">
            <ChartLabWorkspace scenario={chartScenario} variant="embed" />
          </div>
        )}

        <ClassificationButtons
          value={answers[index]}
          onChange={handleSelect}
          size="sm"
        />
      </div>
    </AppShell>
  )
}
