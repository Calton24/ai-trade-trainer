"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { ArrowRightIcon, BarChart3Icon, RefreshCwIcon } from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { PageHeader } from "@/components/shared/page-header"
import { StatsGridSkeleton, TableSkeleton } from "@/components/shared/skeleton-patterns"
import { SurfaceCard } from "@/components/shared/surface-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { LearnerAnalyticsResponse } from "@/lib/execution-analytics/types"
import { cn } from "@/lib/utils"

export function LearnerPerformanceContent() {
  const [data, setData] = useState<LearnerAnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/execution/analytics/learner")
      if (res.status === 501) {
        setData(null)
        setError("Analytics sync requires Supabase configuration.")
        return
      }
      if (!res.ok) throw new Error("Failed to load")
      setData(await res.json())
    } catch {
      setError("Could not load performance data.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      void load()
    })
    return () => cancelAnimationFrame(frame)
  }, [load])

  const o = data?.overview

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Execution Performance"
          description="Process quality over profit — decision accuracy, patience, and calibration."
          action={
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCwIcon className={cn("size-3.5", loading && "animate-spin")} />
              Refresh
            </Button>
          }
        />

        {loading && (
          <>
            <StatsGridSkeleton count={8} />
            <TableSkeleton rows={4} cols={6} />
          </>
        )}

        {error && !loading && (
          <ErrorState
            title="Could not load performance"
            description={error}
            onRetry={load}
          />
        )}

        {!loading && o && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Completed" value={`${o.scenariosCompleted}`} sub={`${o.completionRate}% rate`} />
            <Stat label="Avg execution" value={`${o.averageExecutionScore}%`} sub="process score" />
            <Stat label="Avg time" value={formatDuration(o.averageDurationSeconds)} sub="per scenario" />
            <Stat label="No-trade accuracy" value={`${o.noTradeAccuracy}%`} sub="patience skill" />
            <Stat label="Strategy accuracy" value={`${o.strategySelectionAccuracy}%`} />
            <Stat label="Confidence calibration" value={`${o.confidenceCalibration}%`} />
            <Stat label="Hints / completion" value={o.hintsPerCompleted.toFixed(1)} />
            <Stat label="Reveal rate" value={`${o.revealRate}%`} />
          </div>
        )}

        {!loading && data && data.coachingRecommendations.length > 0 && (
          <SurfaceCard variant="primary" padding="md" className="app-fade-in">
            <p className="font-medium">Coaching focus (recent attempts)</p>
            <ul className="mt-3 space-y-2">
              {data.coachingRecommendations.map((rec) => (
                <li
                  key={rec.href + rec.label}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 bg-background/40 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{rec.label}</p>
                    <p className="text-xs text-muted-foreground">{rec.reason}</p>
                  </div>
                  <Button size="sm" variant="outline" render={<Link href={rec.href} />}>
                    Practise
                  </Button>
                </li>
              ))}
            </ul>
          </SurfaceCard>
        )}

        {!loading && data && (
          <section>
            <h2 className="text-lg font-semibold">By academy</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {data.byPack.map((pack) => (
                <SurfaceCard key={pack.packId} padding="md">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{pack.packTitle}</p>
                    {pack.recentTrend !== 0 && (
                      <Badge variant="outline">
                        {pack.recentTrend > 0 ? "+" : ""}
                        {pack.recentTrend}% trend
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {pack.completed}/{pack.attempts} attempts passed
                      </span>
                      <span>{pack.completionRate}%</span>
                    </div>
                    <Progress value={pack.completionRate} className="h-1.5" />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <span>Avg score: {pack.averageScore}%</span>
                    {pack.weakestSkill && <span>Focus: {pack.weakestSkill}</span>}
                  </div>
                  <Button
                    className="mt-3"
                    size="sm"
                    variant="outline"
                    render={<Link href={`/execution-lab?pack=${pack.packId}`} />}
                  >
                    Open pack
                  </Button>
                </SurfaceCard>
              ))}
            </div>
          </section>
        )}

        {!loading && data && data.recentAttempts.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold">Recent attempts</h2>
            <div className="mt-4 overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="border-b border-border/60 bg-muted/30 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2">Scenario</th>
                    <th className="px-4 py-2">Mode</th>
                    <th className="px-4 py-2">Score</th>
                    <th className="px-4 py-2">Decision</th>
                    <th className="px-4 py-2">Hints</th>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {data.recentAttempts.map((a) => (
                    <tr key={a.id} className="border-b border-border/40 last:border-0">
                      <td className="px-4 py-2 font-medium">{a.scenarioTitle}</td>
                      <td className="px-4 py-2 capitalize">{a.mode}</td>
                      <td className="px-4 py-2 tabular-nums">
                        {a.executionScore != null ? `${a.executionScore}%` : "—"}
                      </td>
                      <td className="px-4 py-2">
                        {a.decision}
                        {a.decisionCorrect === false && (
                          <span className="ml-1 text-destructive">✗</span>
                        )}
                      </td>
                      <td className="px-4 py-2 tabular-nums">{a.hintsUsed}</td>
                      <td className="px-4 py-2 tabular-nums">
                        {a.durationSeconds ? formatDuration(a.durationSeconds) : "—"}
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          render={
                            <Link
                              href={`/execution-lab/${a.scenarioId}?mode=${a.mode}`}
                            />
                          }
                        >
                          Retry
                          <ArrowRightIcon data-icon="inline-end" className="size-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {!loading && !data && !error && (
          <EmptyState
            icon={BarChart3Icon}
            title="No execution history yet"
            description="Complete your first scenario while signed in to track decision quality, patience, and calibration."
            action={
              <Button render={<Link href="/execution-lab?pack=continuation-academy" />}>
                Start Continuation Academy
              </Button>
            }
          />
        )}
      </div>
    </AppShell>
  )
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <SurfaceCard padding="sm">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </SurfaceCard>
  )
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}
