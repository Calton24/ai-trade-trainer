"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  InfoIcon,
  TargetIcon,
  TrophyIcon,
} from "lucide-react"

import { ChartLab } from "@/components/chart-lab/chart-lab"
import { TopicGuide } from "@/components/learning-map/progression-gate"
import { AppShell } from "@/components/layout/app-shell"
import {
  StrategyCard,
  StrategyFlashcardCTA,
  StrategyMasteryBadge,
} from "@/components/strategy-wiki/strategy-card"
import { useUserState } from "@/components/providers/user-state-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getStrategyBySlug } from "@/content/strategies"
import { getNodeById } from "@/content/learning-map/nodes"
import { isNodeComplete } from "@/lib/learning-map/unlocks"
import {
  getStrategyOverviewNodeId,
  getStrategyUnlocksAfter,
} from "@/lib/learning-map/strategy-gates"
import { STRATEGY_WIKI_DISCLAIMER } from "@/lib/strategy-wiki/challenge"
import { getStrategyProgressRecord } from "@/lib/user-state/strategy-wiki"
import type { TradingStrategy } from "@/lib/strategy-wiki/types"
import { cn } from "@/lib/utils"

interface StrategyDetailContentProps {
  strategy: TradingStrategy
}

export function StrategyDetailContent({ strategy }: StrategyDetailContentProps) {
  const {
    state,
    isStrategyLessonDone,
    markStrategyLessonComplete,
  } = useUserState()
  const progress = getStrategyProgressRecord(state.strategyWiki, strategy.id)
  const lessonDone = isStrategyLessonDone(strategy.id)
  const [expandedChart, setExpandedChart] = useState<string | null>(
    strategy.chartExamples[0]?.id ?? null
  )

  const related = strategy.relatedStrategySlugs
    .map((slug) => getStrategyBySlug(slug))
    .filter(Boolean) as TradingStrategy[]

  const overviewNodeId = getStrategyOverviewNodeId(strategy.slug)
  const overviewNode = overviewNodeId ? getNodeById(overviewNodeId) : null
  const prerequisites =
    overviewNode?.prerequisites
      .map((id) => {
        const node = getNodeById(id)
        if (!node) return null
        return {
          title: node.title,
          href: node.href,
          completed: isNodeComplete(state, id),
        }
      })
      .filter((p): p is NonNullable<typeof p> => p !== null) ?? []
  const unlocksAfter = getStrategyUnlocksAfter(strategy.slug)
  const flashcardsHref = strategy.flashcardDeckSlug
    ? `/flashcards/session?deck=${strategy.flashcardDeckSlug}`
    : undefined

  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit"
            render={<Link href="/strategy-wiki" />}
          >
            <ArrowLeftIcon data-icon="inline-start" />
            Strategy Wiki
          </Button>
          <div className="flex items-center gap-2 text-primary">
            <BookOpenIcon className="size-4" />
            <span className="text-sm font-medium">{strategy.category}</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {strategy.title}
          </h1>
          <p className="text-muted-foreground">{strategy.summary}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {strategy.difficulty === "beginner-intermediate"
                ? "Beginner–Intermediate"
                : strategy.difficulty}
            </Badge>
            <StrategyMasteryBadge level={progress.masteryLevel} />
            {lessonDone && (
              <Badge className="border-primary/20 bg-primary/10 text-primary">
                <CheckCircle2Icon className="size-3" />
                Playbook read
              </Badge>
            )}
          </div>
          <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground/70">
            <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
            {STRATEGY_WIKI_DISCLAIMER}
          </p>
        </div>

        <TopicGuide
          title={strategy.title}
          summary={strategy.summary}
          whyMatters={strategy.whenToUse}
          prerequisites={prerequisites}
          unlocksAfter={unlocksAfter}
          practiceHref={
            strategy.practiceExercises.length > 0
              ? `/strategy-wiki/${strategy.slug}/practice`
              : undefined
          }
          flashcardsHref={flashcardsHref}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-card/50 p-4">
            <p className="text-xs text-muted-foreground">Best market condition</p>
            <p className="mt-1 text-sm">{strategy.bestMarketCondition}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/50 p-4">
            <p className="text-xs text-muted-foreground">Timeframes</p>
            <p className="mt-1 text-sm">{strategy.timeframes.join(", ")}</p>
          </div>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold">When to use it</h2>
          <p className="text-sm text-muted-foreground">{strategy.whenToUse}</p>
          <h2 className="font-semibold">When to avoid it</h2>
          <p className="text-sm text-muted-foreground">{strategy.whenToAvoid}</p>
        </section>

        <section>
          <h2 className="mb-4 font-semibold">Step-by-step setup</h2>
          <div className="flex flex-col gap-3">
            {strategy.setupSteps.map((step, i) => (
              <div
                key={step.id}
                className="rounded-xl border border-border/60 bg-card/50 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {step.explanation}
                    </p>
                    {step.beginnerTip && (
                      <p className="mt-2 text-xs text-primary/80">
                        Tip: {step.beginnerTip}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!lessonDone && (
            <Button
              className="mt-4"
              onClick={() => markStrategyLessonComplete(strategy.id, strategy.title)}
            >
              Mark playbook as read
            </Button>
          )}
        </section>

        <section>
          <h2 className="mb-4 font-semibold">Chart examples</h2>
          <div className="flex flex-col gap-3">
            {strategy.chartExamples.map((ex) => (
              <div
                key={ex.id}
                className="rounded-xl border border-border/60 bg-card/50 overflow-hidden"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between p-4 text-left"
                  onClick={() =>
                    setExpandedChart(expandedChart === ex.id ? null : ex.id)
                  }
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          ex.variant === "clean" && "text-emerald-400",
                          ex.variant === "failed" && "text-red-400",
                          ex.variant === "skip" && "text-amber-400"
                        )}
                      >
                        {ex.variant}
                      </Badge>
                      <span className="font-medium">{ex.title}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{ex.caption}</p>
                  </div>
                  <ChevronDownIcon
                    className={cn(
                      "size-4 shrink-0 transition-transform",
                      expandedChart === ex.id && "rotate-180"
                    )}
                  />
                </button>
                {expandedChart === ex.id && (
                  <div className="border-t border-border/40 p-4">
                    <ChartLab scenarioId={ex.chartScenarioId} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-card/50 p-4">
            <p className="text-xs font-medium text-muted-foreground">Entry logic</p>
            <p className="mt-1 text-sm">{strategy.entryLogic}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/50 p-4">
            <p className="text-xs font-medium text-muted-foreground">Stop loss</p>
            <p className="mt-1 text-sm">{strategy.stopLossLogic}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/50 p-4">
            <p className="text-xs font-medium text-muted-foreground">Take profit</p>
            <p className="mt-1 text-sm">{strategy.takeProfitLogic}</p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-semibold">Invalidation rules</h2>
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            {strategy.invalidationRules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-semibold">Common beginner mistakes</h2>
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            {strategy.commonMistakes.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </section>

        {lessonDone && (
          <StrategyFlashcardCTA
            deckSlug={strategy.flashcardDeckSlug}
            strategyTitle={strategy.title}
          />
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            className="flex-1"
            render={
              <Link href={`/strategy-wiki/${strategy.slug}/practice`} />
            }
          >
            <TargetIcon data-icon="inline-start" />
            Practice exercises
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            render={
              <Link href={`/strategy-wiki/${strategy.slug}/challenge`} />
            }
          >
            <TrophyIcon data-icon="inline-start" />
            10-scenario challenge
          </Button>
        </div>

        {progress.practiceAttempts > 0 && (
          <div className="rounded-xl border border-border/60 bg-card/50 p-4 text-sm">
            <p>
              Practice attempts: {progress.practiceAttempts} · Average:{" "}
              {progress.averageScore}% · Best: {progress.bestScore}%
            </p>
          </div>
        )}

        {related.length > 0 && (
          <section>
            <h2 className="mb-4 font-semibold">Related strategies</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((s) => (
                <StrategyCard
                  key={s.id}
                  strategy={s}
                  masteryLevel={
                    getStrategyProgressRecord(state.strategyWiki, s.id).masteryLevel
                  }
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  )
}
