"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CardSkeleton } from "@/components/shared/skeleton-patterns"
import { SurfaceCard } from "@/components/shared/surface-card"
import type { CoachingRecommendation } from "@/lib/execution-analytics/types"

export function AnalyticsCoachBoost() {
  const [recs, setRecs] = useState<CoachingRecommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/execution/analytics/learner")
        if (!res.ok) return
        const data = await res.json()
        setRecs(data.coachingRecommendations ?? [])
      } catch {
        // optional boost — silent when analytics unavailable
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return <CardSkeleton className="border-primary/20" />
  }

  if (recs.length === 0) return null

  return (
    <SurfaceCard variant="primary" padding="md" className="app-fade-in">
      <div className="flex items-center gap-2">
        <SparklesIcon className="size-4 text-primary" aria-hidden />
        <p className="text-sm font-medium">Execution Lab coach</p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Based on your recent scenario attempts (last 30 days).
      </p>
      <ul className="mt-3 space-y-2">
        {recs.slice(0, 2).map((rec) => (
          <li
            key={rec.href + rec.label}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 bg-background/40 px-3 py-2 text-sm"
          >
            <div className="min-w-0">
              <span className="font-medium">{rec.label}</span>
              <span className="ml-2 text-muted-foreground">{rec.reason}</span>
            </div>
            <Button size="sm" variant="outline" render={<Link href={rec.href} />}>
              Go
            </Button>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  )
}
