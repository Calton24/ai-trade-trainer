"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { AdminBlocked } from "@/components/admin/admin-blocked"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HEALTH_LABEL_DISPLAY } from "@/lib/execution-analytics/quality-score"
import type { AdminAnalyticsResponse, ScenarioAdminMetrics } from "@/lib/execution-analytics/types"
import { cn } from "@/lib/utils"

interface ScenarioAnalyticsAdminProps {
  adminEmail: string
}

const HEALTH_STYLES: Record<string, string> = {
  "too-easy": "border-emerald-500/40 bg-emerald-500/10 text-emerald-600",
  healthy: "border-primary/40 bg-primary/10 text-primary",
  "too-hard": "border-destructive/40 bg-destructive/10 text-destructive",
  confusing: "border-amber-500/40 bg-amber-500/10 text-amber-600",
  "needs-data": "border-border/60 bg-muted/30 text-muted-foreground",
}

export function ScenarioAnalyticsAdmin({ adminEmail }: ScenarioAnalyticsAdminProps) {
  const [data, setData] = useState<AdminAnalyticsResponse | null>(null)
  const [pack, setPack] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [mode, setMode] = useState("")
  const [loading, setLoading] = useState(true)

  const query = useMemo(() => {
    const p = new URLSearchParams()
    if (pack) p.set("pack", pack)
    if (difficulty) p.set("difficulty", difficulty)
    if (mode) p.set("mode", mode)
    return p.toString()
  }, [pack, difficulty, mode])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/execution/analytics/admin?${query}`)
      if (res.ok) setData(await res.json())
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 pb-16 md:p-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Internal · Admin only
        </p>
        <h1 className="text-2xl font-semibold">Scenario Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Aggregate scenario quality — signed in as {adminEmail}. No cross-user raw data.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterSelect
          label="Pack"
          value={pack}
          onChange={setPack}
          options={data?.filters.packs ?? []}
        />
        <FilterSelect
          label="Difficulty"
          value={difficulty}
          onChange={setDifficulty}
          options={data?.filters.difficulties ?? []}
        />
        <FilterSelect
          label="Mode"
          value={mode}
          onChange={setMode}
          options={data?.filters.modes ?? []}
        />
        <Button size="sm" variant="outline" onClick={load} disabled={loading}>
          Refresh
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="border-b border-border/60 bg-muted/30 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Scenario</th>
              <th className="px-3 py-2">Health</th>
              <th className="px-3 py-2">Starts</th>
              <th className="px-3 py-2">Done</th>
              <th className="px-3 py-2">Abandon %</th>
              <th className="px-3 py-2">Avg score</th>
              <th className="px-3 py-2">Med score</th>
              <th className="px-3 py-2">Hints</th>
              <th className="px-3 py-2">Reveal %</th>
              <th className="px-3 py-2">Avg time</th>
              <th className="px-3 py-2">Decision %</th>
              <th className="px-3 py-2">Top mistake</th>
              <th className="px-3 py-2">Quality</th>
            </tr>
          </thead>
          <tbody>
            {(data?.scenarios ?? []).map((row) => (
              <ScenarioRow key={row.scenarioId} row={row} />
            ))}
          </tbody>
        </table>
        {!loading && (data?.scenarios.length ?? 0) === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">
            No attempt data yet. Learners need to complete scenarios while signed in.
          </p>
        )}
      </div>
    </div>
  )
}

function ScenarioRow({ row }: { row: ScenarioAdminMetrics }) {
  return (
    <tr className="border-b border-border/40 last:border-0">
      <td className="px-3 py-2">
        <p className="font-medium">{row.title}</p>
        <p className="text-xs text-muted-foreground">
          {row.scenarioId} · {row.symbol} · {row.difficulty}
        </p>
      </td>
      <td className="px-3 py-2">
        <Badge
          variant="outline"
          className={cn("text-[10px]", HEALTH_STYLES[row.healthLabel])}
        >
          {HEALTH_LABEL_DISPLAY[row.healthLabel]}
        </Badge>
      </td>
      <td className="px-3 py-2 tabular-nums">{row.totalStarts}</td>
      <td className="px-3 py-2 tabular-nums">{row.completions}</td>
      <td className="px-3 py-2 tabular-nums">{row.abandonmentRate}%</td>
      <td className="px-3 py-2 tabular-nums">{row.averageExecutionScore}%</td>
      <td className="px-3 py-2 tabular-nums">{row.medianExecutionScore}%</td>
      <td className="px-3 py-2 tabular-nums">{row.averageHintsUsed}</td>
      <td className="px-3 py-2 tabular-nums">{row.revealRate}%</td>
      <td className="px-3 py-2 tabular-nums">{formatTime(row.averageCompletionTimeSeconds)}</td>
      <td className="px-3 py-2 tabular-nums">{row.decisionCorrectnessRate}%</td>
      <td className="px-3 py-2 text-xs text-muted-foreground">{row.topMistake ?? "—"}</td>
      <td className="px-3 py-2 tabular-nums">
        {row.qualityScore != null ? row.qualityScore : "—"}
      </td>
    </tr>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {label}
      <select
        className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  return `${Math.round(seconds / 60)}m`
}
