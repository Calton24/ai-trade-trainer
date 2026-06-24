"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeftIcon, RotateCcwIcon, TrophyIcon } from "lucide-react"

import { ChartLabWorkspace } from "@/components/chart-lab/chart-lab-workspace"
import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getChartScenario } from "@/content/chart-scenarios"
import { getStrategyChallengeDeck } from "@/lib/strategy-wiki/challenge"
import { scoreChallengeAnswer } from "@/lib/strategy-wiki/scoring"
import type { TradingStrategy } from "@/lib/strategy-wiki/types"

interface StrategyChallengeProps {
  strategy: TradingStrategy
}

export function StrategyChallenge({ strategy }: StrategyChallengeProps) {
  const { recordStrategyChallenge } = useUserState()
  const scenarioIds = strategy.chartExamples.map((e) => e.chartScenarioId)
  const deck = useMemo(
    () => getStrategyChallengeDeck(strategy.id, scenarioIds, 10),
    [strategy.id, scenarioIds]
  )

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<(boolean | null)[]>(
    Array(deck.length).fill(null)
  )
  const [tradeDecisions, setTradeDecisions] = useState<
    ("trade" | "skip" | null)[]
  >(Array(deck.length).fill(null))
  const [finished, setFinished] = useState(false)
  const [saved, setSaved] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [phase, setPhase] = useState<"present" | "decision">("present")

  const current = deck[index]
  const chartScenario = current
    ? getChartScenario(current.chartScenarioId)
    : undefined

  const score = deck.reduce((acc, s, i) => {
    const a = answers[i]
    if (a === null) return acc
    const presentCorrect = scoreChallengeAnswer(s.setupPresent, a)
    const decision = tradeDecisions[i]
    const decisionCorrect =
      !a || !s.setupPresent
        ? decision === "skip"
        : decision === "trade"
    return acc + (presentCorrect && decisionCorrect ? 1 : 0)
  }, 0)

  const hitRate = deck.length > 0 ? Math.round((score / deck.length) * 100) : 0
  const falsePositives = deck.filter(
    (s, i) => answers[i] === true && !s.setupPresent
  ).length
  const missed = deck.filter(
    (s, i) => answers[i] === false && s.setupPresent
  )

  const handlePresent = (present: boolean) => {
    const next = [...answers]
    next[index] = present
    setAnswers(next)
    if (!present) {
      const td = [...tradeDecisions]
      td[index] = "skip"
      setTradeDecisions(td)
      advance()
    } else {
      setPhase("decision")
    }
  }

  const handleDecision = (decision: "trade" | "skip") => {
    const td = [...tradeDecisions]
    td[index] = decision
    setTradeDecisions(td)
    advance()
  }

  const advance = () => {
    setPhase("present")
    if (index < deck.length - 1) {
      setTimeout(() => setIndex((i) => i + 1), 300)
    } else {
      setFinished(true)
    }
  }

  const handleFinish = () => {
    if (saved) return
    const missedIds = deck
      .filter((s, i) => {
        const a = answers[i]
        if (a === null) return false
        const presentCorrect = scoreChallengeAnswer(s.setupPresent, a)
        const decision = tradeDecisions[i]
        const decisionCorrect =
          !a || !s.setupPresent ? decision === "skip" : decision === "trade"
        return !(presentCorrect && decisionCorrect)
      })
      .map((s) => s.id)
    const xpEarned = score * 5 + (score === deck.length ? 25 : 0)
    const id = crypto.randomUUID()
    recordStrategyChallenge({
      id,
      strategyId: strategy.id,
      score,
      total: deck.length,
      hitRate,
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
    return (
      <AppShell>
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-8 text-center">
          <TrophyIcon className="size-12 text-primary" />
          <h1 className="text-2xl font-semibold">Challenge complete</h1>
          <p className="text-4xl font-bold text-primary">
            {score}/{deck.length}
          </p>
          <p className="text-muted-foreground">{hitRate}% hit rate</p>
          <div className="text-sm text-muted-foreground">
            <p>False positives: {falsePositives}</p>
            <p>Missed setups: {missed.length}</p>
          </div>
          {missed.length > 0 && (
            <p className="text-sm">
              Recommended drill: review{" "}
              <Link
                href={`/strategy-wiki/${strategy.slug}/practice`}
                className="text-primary underline"
              >
                practice exercises
              </Link>
            </p>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              render={<Link href={`/strategy-wiki/${strategy.slug}`} />}
            >
              Back to playbook
            </Button>
            {sessionId && (
              <Button
                render={
                  <Link
                    href={`/strategy-wiki/${strategy.slug}/results/${sessionId}`}
                  />
                }
              >
                View results
              </Button>
            )}
          </div>
        </div>
      </AppShell>
    )
  }

  if (!chartScenario) {
    return (
      <AppShell>
        <p className="text-muted-foreground">Chart not found.</p>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 -ml-2"
            render={<Link href={`/strategy-wiki/${strategy.slug}`} />}
          >
            <ArrowLeftIcon data-icon="inline-start" />
            {strategy.title}
          </Button>
          <h1 className="text-xl font-semibold">Strategy challenge</h1>
          <p className="text-sm text-muted-foreground">
            Chart {index + 1} of {deck.length}
          </p>
          <Progress value={((index + 1) / deck.length) * 100} className="mt-3" />
        </div>

        <ChartLabWorkspace scenario={chartScenario} variant="embed" />

        {phase === "present" ? (
          <div className="flex flex-col gap-3">
            <p className="font-medium">
              Is the {strategy.title} setup present on this chart?
            </p>
            <div className="flex gap-3">
              <Button className="flex-1" onClick={() => handlePresent(true)}>
                Yes — setup present
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => handlePresent(false)}
              >
                No — not present
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="font-medium">Trade or skip this setup?</p>
            <div className="flex gap-3">
              <Button className="flex-1" onClick={() => handleDecision("trade")}>
                Trade
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => handleDecision("skip")}
              >
                Skip
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
