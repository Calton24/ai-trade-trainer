"use client"

import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import { getStrategyBySlug } from "@/content/strategies"
import { masteryLabel } from "@/lib/strategy-wiki/mastery"
import { getStrategyProgressRecord } from "@/lib/user-state/strategy-wiki"

interface StrategyResultsContentProps {
  strategySlug: string
  sessionId: string
}

export function StrategyResultsContent({
  strategySlug,
  sessionId,
}: StrategyResultsContentProps) {
  const { state } = useUserState()
  const strategy = getStrategyBySlug(strategySlug)

  const practice = state.strategyWiki.practiceAttempts.find(
    (a) => a.id === sessionId
  )
  const challenge = state.strategyWiki.challengeAttempts.find(
    (a) => a.id === sessionId
  )

  const progress = strategy
    ? getStrategyProgressRecord(state.strategyWiki, strategy.id)
    : null

  return (
    <AppShell>
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          render={<Link href={`/strategy-wiki/${strategySlug}`} />}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          {strategy?.title ?? "Strategy"}
        </Button>

        <h1 className="text-2xl font-semibold">Session results</h1>

        {practice && (
          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <p className="text-sm text-muted-foreground">Practice session</p>
            <p className="mt-2 text-3xl font-bold">{practice.totalScore}/100</p>
            <p className="mt-2 text-sm">
              Trade/skip: {practice.tradeDecision ?? "—"} · Confidence:{" "}
              {practice.confidenceRating}/5
            </p>
            {practice.reasoning && (
              <p className="mt-3 text-sm text-muted-foreground">
                &ldquo;{practice.reasoning}&rdquo;
              </p>
            )}
          </div>
        )}

        {challenge && (
          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <p className="text-sm text-muted-foreground">Challenge session</p>
            <p className="mt-2 text-3xl font-bold">
              {challenge.score}/{challenge.total}
            </p>
            <p className="mt-2 text-sm">{challenge.hitRate}% hit rate</p>
            {challenge.missedIds.length > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                Missed {challenge.missedIds.length} scenario
                {challenge.missedIds.length === 1 ? "" : "s"}
              </p>
            )}
          </div>
        )}

        {!practice && !challenge && (
          <p className="text-muted-foreground">Session not found.</p>
        )}

        {progress && (
          <div className="rounded-xl border border-border/60 bg-card/50 p-4 text-sm">
            <p>Mastery: {masteryLabel(progress.masteryLevel)}</p>
            <p className="mt-1">
              {progress.practiceAttempts} practice attempts · {progress.averageScore}%
              average
            </p>
          </div>
        )}

        <Button
          render={<Link href={`/strategy-wiki/${strategySlug}/practice`} />}
        >
          Continue practising
        </Button>
      </div>
    </AppShell>
  )
}
