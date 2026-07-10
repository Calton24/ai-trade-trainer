"use client"

import Link from "next/link"
import { memo } from "react"
import {
  ArrowRightIcon,
  BrainIcon,
  FlameIcon,
  LineChartIcon,
  TargetIcon,
} from "lucide-react"

import { SkillRadar } from "@/components/skills/skill-radar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { SkillProfile } from "@/lib/skills/types"
import { SKILL_LABELS } from "@/lib/skills/definitions"
import { cn } from "@/lib/utils"

const PRIMARY_SKILLS = [
  "trend-detection",
  "continuation",
  "reversal",
  "support-resistance",
] as const

export const MarketReadingHero = memo(function MarketReadingHero({
  profile,
}: {
  profile: SkillProfile
}) {
  const displayCategories = profile.categories.filter(
    (c) => c.id === "pattern-recognition" || c.id === "market-reading"
  )

  return (
    <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/90 to-card/60 p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <BrainIcon className="size-4" />
            <span className="text-sm font-medium">Market Reading</span>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div>
              <p className="text-4xl font-semibold tabular-nums tracking-tight">
                {profile.marketReadingScore > 0
                  ? `${profile.marketReadingScore}%`
                  : "—"}
              </p>
              <p className="text-sm text-muted-foreground">
                Overall Market Reading
              </p>
            </div>
            <Badge variant="secondary" className="mb-1">
              {profile.marketReadingLevel}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <LineChartIcon className="size-3.5" />
              {profile.chartsAnalysed} charts analysed
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <TargetIcon className="size-3.5" />
              {profile.replaySessions} replays
            </span>
            <span className="flex items-center gap-1.5 text-primary">
              <FlameIcon className="size-3.5" />
              {profile.practiceStreak}d practice streak
            </span>
            {profile.confidenceAccuracy > 0 && (
              <span className="text-muted-foreground">
                Confidence accuracy {profile.confidenceAccuracy}%
              </span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {PRIMARY_SKILLS.map((id) => {
              const skill = profile.skills[id]
              if (skill.score <= 0 && skill.attemptCount === 0) return null
              return (
                <div key={id}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{SKILL_LABELS[id]}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {skill.score > 0 ? `${skill.score}%` : "—"}
                      {skill.weekTrend !== 0 && (
                        <span
                          className={cn(
                            "ml-1 text-xs",
                            skill.weekTrend > 0 ? "text-primary" : "text-destructive"
                          )}
                        >
                          {skill.weekTrend > 0 ? "+" : ""}
                          {skill.weekTrend}
                        </span>
                      )}
                    </span>
                  </div>
                  <Progress
                    value={skill.score}
                    className="mt-1.5 h-1.5"
                  />
                  {skill.lastPracticeAt && (
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      Last:{" "}
                      {new Date(skill.lastPracticeAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 lg:w-56">
          <SkillRadar categories={displayCategories} />
          <Button className="w-full" render={<Link href="/practice" />}>
            Today&apos;s Practice
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </div>
  )
})
