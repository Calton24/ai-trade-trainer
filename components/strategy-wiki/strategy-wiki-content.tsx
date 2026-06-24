"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  BookOpenIcon,
  InfoIcon,
  LayersIcon,
  TargetIcon,
  TrophyIcon,
  ZapIcon,
} from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { StrategyCard } from "@/components/strategy-wiki/strategy-card"
import { useUserState } from "@/components/providers/user-state-provider"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ALL_STRATEGIES,
  getFeaturedStrategies,
  STRATEGY_CATEGORIES,
} from "@/content/strategies"
import { STRATEGY_WIKI_DISCLAIMER } from "@/lib/strategy-wiki/challenge"
import { getStrategyProgressRecord } from "@/lib/user-state/strategy-wiki"
import type { StrategyCategory } from "@/lib/strategy-wiki/types"
import { cn } from "@/lib/utils"

const DIFFICULTY_FILTERS = ["beginner", "intermediate", "beginner-intermediate"] as const

export function StrategyWikiContent() {
  const { state, strategyWikiStats } = useUserState()
  const [categoryFilter, setCategoryFilter] = useState<StrategyCategory | "all">(
    "all"
  )
  const [difficultyFilter, setDifficultyFilter] = useState<
    (typeof DIFFICULTY_FILTERS)[number] | "all"
  >("all")

  const isNew =
    state.strategyWiki.completedStrategyIds.length === 0 &&
    state.strategyWiki.practiceAttempts.length === 0

  const filtered = useMemo(() => {
    return ALL_STRATEGIES.filter((s) => {
      if (categoryFilter !== "all" && s.category !== categoryFilter) return false
      if (difficultyFilter !== "all" && s.difficulty !== difficultyFilter)
        return false
      return true
    })
  }, [categoryFilter, difficultyFilter])

  const featured = getFeaturedStrategies()
  const continueStrategy = strategyWikiStats.recommendedStrategySlug
    ? ALL_STRATEGIES.find(
        (s) => s.slug === strategyWikiStats.recommendedStrategySlug
      )
    : null

  const recentSessions = [...state.strategyWiki.practiceAttempts]
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    .slice(0, 3)

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-primary">
            <BookOpenIcon className="size-5" />
            <span className="text-sm font-medium">Strategy Wiki</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Strategy Wiki
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Learn trading setups step by step, then practise them on generated
            charts until the pattern becomes familiar.
          </p>
          <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground/70">
            <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
            {STRATEGY_WIKI_DISCLAIMER}
          </p>
        </div>

        {isNew ? (
          <EmptyState
            icon={TargetIcon}
            title="Start your first setup"
            description="Start with Break & Retest or Support and Resistance to learn your first repeatable setup."
            action={
              <Button render={<Link href="/strategy-wiki/break-retest" />}>
                Explore Break & Retest
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {continueStrategy && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 sm:col-span-2 lg:col-span-1">
                <span className="text-xs font-medium text-primary">
                  Continue practising
                </span>
                <p className="mt-1 font-semibold">{continueStrategy.title}</p>
                <Button
                  className="mt-3"
                  size="sm"
                  render={
                    <Link href={`/strategy-wiki/${continueStrategy.slug}/practice`} />
                  }
                >
                  Practice now
                </Button>
              </div>
            )}
            {strategyWikiStats.weakestStrategyTitle && (
              <div className="rounded-xl border border-border/60 bg-card/50 p-5">
                <span className="text-xs text-muted-foreground">Weakest strategy</span>
                <p className="mt-1 font-semibold">
                  {strategyWikiStats.weakestStrategyTitle}
                </p>
                <Button
                  className="mt-3"
                  size="sm"
                  variant="outline"
                  render={
                    <Link
                      href={`/strategy-wiki/${strategyWikiStats.weakestStrategySlug}`}
                    />
                  }
                >
                  Review playbook
                </Button>
              </div>
            )}
            {strategyWikiStats.recommendedStrategyTitle && (
              <div className="rounded-xl border border-border/60 bg-card/50 p-5">
                <span className="text-xs text-muted-foreground">Recommended next</span>
                <p className="mt-1 font-semibold">
                  {strategyWikiStats.recommendedStrategyTitle}
                </p>
                <Button
                  className="mt-3"
                  size="sm"
                  variant="outline"
                  render={
                    <Link
                      href={`/strategy-wiki/${strategyWikiStats.recommendedStrategySlug}`}
                    />
                  }
                >
                  Open strategy
                </Button>
              </div>
            )}
          </div>
        )}

        {!isNew && recentSessions.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">
              Recent strategy sessions
            </h2>
            <div className="flex flex-col gap-2">
              {recentSessions.map((s) => {
                const strategy = ALL_STRATEGIES.find((st) => st.id === s.strategyId)
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border border-border/40 px-4 py-3 text-sm"
                  >
                    <span>
                      {strategy?.title ?? s.strategyId} · {s.totalScore}/100
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      render={
                        <Link
                          href={`/strategy-wiki/${strategy?.slug}/results/${s.id}`}
                        />
                      }
                    >
                      View
                    </Button>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <section>
          <div className="mb-4 flex items-center gap-2">
            <ZapIcon className="size-4 text-primary" />
            <h2 className="font-semibold">Featured beginner strategies</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
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

        <section>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <LayersIcon className="size-4 text-primary" />
            <h2 className="font-semibold">All strategies</h2>
            <div className="ml-auto flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setCategoryFilter("all")}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs",
                  categoryFilter === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                All
              </button>
              {STRATEGY_CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategoryFilter(c)}
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs",
                    categoryFilter === c
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {(["all", ...DIFFICULTY_FILTERS] as const).map((d) => (
              <Badge
                key={d}
                variant={difficultyFilter === d ? "default" : "outline"}
                className="cursor-pointer text-[10px]"
                onClick={() => setDifficultyFilter(d)}
              >
                {d === "all"
                  ? "All levels"
                  : d === "beginner-intermediate"
                    ? "Beginner–Intermediate"
                    : d.charAt(0).toUpperCase() + d.slice(1)}
              </Badge>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
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

        <div className="rounded-xl border border-border/60 bg-card/50 p-5">
          <div className="flex items-center gap-2">
            <TrophyIcon className="size-4 text-primary" />
            <span className="font-medium">Challenge mode</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Test pattern recognition with 10-scenario drills on any strategy.
          </p>
          <Button
            className="mt-4"
            size="sm"
            variant="outline"
            render={<Link href="/strategy-wiki/break-retest/challenge" />}
          >
            Try Break & Retest challenge
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
