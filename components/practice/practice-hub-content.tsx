"use client"

import Link from "next/link"
import { memo, useMemo, useState } from "react"
import { ArrowRightIcon, LockIcon } from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { SkillRadar } from "@/components/skills/skill-radar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PRACTICE_DRILLS } from "@/lib/skills/definitions"
import type { MarketReadingLevel } from "@/lib/skills/types"
import { cn } from "@/lib/utils"

const FILTERS: (MarketReadingLevel | "all")[] = [
  "all",
  "Beginner",
  "Developing",
  "Intermediate",
  "Advanced",
  "Professional",
]

export const PracticeHubContent = memo(function PracticeHubContent() {
  const { skillProfile, dailyChallenge, journalInsights } = useUserState()
  const [filter, setFilter] = useState<MarketReadingLevel | "all">("all")

  const drills = useMemo(() => {
    if (filter === "all") return PRACTICE_DRILLS
    return PRACTICE_DRILLS.filter((d) => d.difficulty === filter)
  }, [filter])

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Practice
            </h1>
            <p className="text-muted-foreground">
              Deliberate reps — no lessons required. Analyse charts until it
              becomes instinct.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">
              {skillProfile.chartsAnalysed} charts analysed
            </span>
            <Badge variant="secondary">{skillProfile.marketReadingLevel}</Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Daily Challenge
            </p>
            <h2 className="mt-1 text-lg font-semibold">{dailyChallenge.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {dailyChallenge.description}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Button render={<Link href={dailyChallenge.href} />}>
                {dailyChallenge.completed ? "Challenge complete" : "Start challenge"}
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <span className="text-xs text-muted-foreground">
                +{dailyChallenge.xpReward} XP
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/50 p-5">
            <p className="text-sm font-medium">Skill Overview</p>
            <SkillRadar categories={skillProfile.categories} className="mt-2" />
            <p className="mt-2 text-center text-2xl font-semibold tabular-nums">
              {skillProfile.marketReadingScore > 0
                ? `${skillProfile.marketReadingScore}%`
                : "—"}
            </p>
            <p className="text-center text-xs text-muted-foreground">
              Market Reading Score
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          <p className="text-sm font-medium">Skill Tree</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skillProfile.categories.map((cat) => (
              <div key={cat.id}>
                <div className="flex items-center justify-between text-sm">
                  <span>{cat.label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {cat.score > 0 ? `${cat.score}%` : "—"}
                  </span>
                </div>
                <Progress value={cat.score} className="mt-1.5 h-2" />
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {cat.level}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  filter === f
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 text-muted-foreground hover:border-primary/40"
                )}
              >
                {f === "all" ? "All levels" : f}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {drills.map((drill) => (
              <div
                key={drill.id}
                className={cn(
                  "flex flex-col rounded-xl border p-5 transition-colors",
                  drill.available
                    ? "border-border/60 bg-card/50 hover:border-primary/30"
                    : "border-border/40 bg-muted/20 opacity-70"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium">{drill.title}</h3>
                  {drill.badge && (
                    <Badge variant="secondary" className="shrink-0 text-[10px]">
                      {drill.badge}
                    </Badge>
                  )}
                </div>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {drill.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {drill.difficulty} · ~{drill.estimatedMinutes} min
                  </span>
                  {drill.available ? (
                    <Button
                      size="sm"
                      variant="outline"
                      render={<Link href={drill.href} />}
                    >
                      Practise
                    </Button>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <LockIcon className="size-3" />
                      Soon
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {journalInsights.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <p className="text-sm font-medium">Journal Intelligence</p>
            <ul className="mt-3 flex flex-col gap-2">
              {journalInsights.map((insight) => (
                <li
                  key={insight.id}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm",
                    insight.severity === "warning" &&
                      "border-destructive/30 bg-destructive/5",
                    insight.severity === "positive" &&
                      "border-primary/30 bg-primary/5",
                    insight.severity === "info" && "border-border/50"
                  )}
                >
                  {insight.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AppShell>
  )
})
