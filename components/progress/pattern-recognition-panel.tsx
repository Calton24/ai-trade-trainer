"use client"

import Link from "next/link"
import { BrainIcon, TrendingUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  getPatternCategoryLabel,
  type PatternCategory,
  type PatternRecognitionStats,
} from "@/lib/user-state/pattern-recognition"
import { cn } from "@/lib/utils"

const CATEGORIES: { key: keyof PatternRecognitionStats; category: PatternCategory }[] =
  [
    { key: "trendDetection", category: "trend-detection" },
    { key: "continuation", category: "continuation" },
    { key: "reversal", category: "reversal" },
    { key: "trendBuilding", category: "trend-building" },
    { key: "supportResistance", category: "support-resistance" },
  ]

export function PatternRecognitionPanel({
  stats,
}: {
  stats: PatternRecognitionStats
}) {
  if (stats.totalAttempts === 0 && stats.supportResistance === 0) return null

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BrainIcon className="size-4 text-primary" />
            <p className="text-sm font-medium">Pattern Recognition</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            How well you read the market — from structure drills, replays, and chart
            practice.
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold tabular-nums">
            {stats.overall > 0 ? `${stats.overall}%` : "—"}
          </p>
          <p className="text-xs text-muted-foreground">Overall market reading</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {CATEGORIES.map(({ key, category }) => {
          const score = stats[key] as number
          if (score <= 0) return null
          const isWeakest = stats.weakestArea === category
          const isStrongest = stats.strongestArea === category
          return (
            <div key={category}>
              <div className="flex items-center justify-between text-sm">
                <span
                  className={cn(
                    isWeakest && "text-destructive",
                    isStrongest && "text-primary"
                  )}
                >
                  {getPatternCategoryLabel(category)}
                  {isWeakest && score < 80 && (
                    <span className="ml-1.5 text-xs text-destructive/80">
                      · focus area
                    </span>
                  )}
                </span>
                <span className="tabular-nums text-muted-foreground">{score}%</span>
              </div>
              <Progress value={score} className="mt-1.5 h-1.5" />
            </div>
          )
        })}
      </div>

      {stats.weakestArea && stats.weakestArea !== stats.strongestArea && (
        <p className="mt-4 text-xs text-muted-foreground">
          {stats.overall >= 80
            ? `Strong overall. Sharpen ${getPatternCategoryLabel(stats.weakestArea).toLowerCase()} to round out your reads.`
            : `You're building skill — extra reps on ${getPatternCategoryLabel(stats.weakestArea).toLowerCase()} will move the needle fastest.`}
        </p>
      )}

      <Button
        className="mt-4"
        size="sm"
        variant="outline"
        render={<Link href="/paths/market-structure-mastery" />}
      >
        <TrendingUpIcon data-icon="inline-start" />
        Market Structure drills
      </Button>
    </div>
  )
}
