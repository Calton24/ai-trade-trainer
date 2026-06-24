"use client"

import Link from "next/link"
import { ArrowRightIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { getPillarById } from "@/content/trader-readiness"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { TraderReadinessStats } from "@/lib/trader-readiness/types"
import { traderLevelDescription, traderLevelRange } from "@/lib/trader-readiness/levels"
import { cn } from "@/lib/utils"

interface ReadinessScoreCardProps {
  stats: TraderReadinessStats
  compact?: boolean
}

export function ReadinessScoreCard({ stats, compact }: ReadinessScoreCardProps) {
  if (!stats.hasBaseline) {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <p className="text-sm font-medium text-primary">Trader Readiness</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Take your first diagnostic assessment to discover strengths, weaknesses,
          and a personalised learning roadmap.
        </p>
        <Button className="mt-4" render={<Link href="/trader-readiness/assessment" />}>
          Start Assessment
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>
    )
  }

  if (compact) {
    return (
      <Link
        href="/trader-readiness"
        className="block rounded-xl border border-border/60 bg-card/50 p-4 transition-colors hover:border-primary/30"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Trader Readiness</p>
          <Badge variant="outline">{stats.traderLevelLabel}</Badge>
        </div>
        <p className="mt-2 text-3xl font-bold text-primary">{stats.overallScore}%</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Weakest: {stats.weakestPillarLabel}
        </p>
      </Link>
    )
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Trader Readiness Score</p>
            <p className="text-4xl font-bold text-primary">{stats.overallScore}%</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>{stats.traderLevelLabel}</Badge>
            <Badge variant="outline">{traderLevelRange(stats.traderLevel)}</Badge>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            {traderLevelDescription(stats.traderLevel)}
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          {Object.entries(stats.pillarScores).map(([id, score]) => {
            const pillar = getPillarById(id)
            const isWeakest = id === stats.weakestPillar
            const isStrongest = id === stats.strongestPillar
            return (
              <div key={id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5">
                    <span>{pillar.icon}</span>
                    <span className={cn(isWeakest && "text-destructive", isStrongest && "text-primary")}>
                      {pillar.title}
                    </span>
                    {isWeakest && <TrendingDownIcon className="size-3 text-destructive" />}
                    {isStrongest && <TrendingUpIcon className="size-3 text-primary" />}
                  </span>
                  <span className="font-medium">{score}%</span>
                </div>
                <Progress value={score} className="h-1.5" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
