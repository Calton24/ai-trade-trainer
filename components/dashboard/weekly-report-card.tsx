"use client"

import Link from "next/link"
import { memo } from "react"
import { BarChart3Icon, TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SKILL_LABELS } from "@/lib/skills/definitions"
import type { WeeklyReport } from "@/lib/skills/types"
import { cn } from "@/lib/utils"

export const WeeklyReportCard = memo(function WeeklyReportCard({
  report,
}: {
  report: WeeklyReport
}) {
  const maxCharts = Math.max(1, ...report.dailyActivity.map((d) => d.charts))

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-6">
      <div className="flex items-center gap-2">
        <BarChart3Icon className="size-4 text-primary" />
        <p className="text-sm font-medium">Weekly Report</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-2xl font-semibold tabular-nums">
            {report.hoursTrained}h
          </p>
          <p className="text-xs text-muted-foreground">Hours trained</p>
        </div>
        <div>
          <p className="text-2xl font-semibold tabular-nums">
            {report.chartsAnalysed}
          </p>
          <p className="text-xs text-muted-foreground">Charts analysed</p>
        </div>
        <div>
          <p className="text-2xl font-semibold tabular-nums">
            {report.replayAccuracy > 0 ? `${report.replayAccuracy}%` : "—"}
          </p>
          <p className="text-xs text-muted-foreground">Replay accuracy</p>
        </div>
        <div>
          <p
            className={cn(
              "flex items-center gap-1 text-2xl font-semibold tabular-nums",
              report.improvement >= 0 ? "text-primary" : "text-destructive"
            )}
          >
            {report.improvement >= 0 ? (
              <TrendingUpIcon className="size-4" />
            ) : (
              <TrendingDownIcon className="size-4" />
            )}
            {report.improvement >= 0 ? "+" : ""}
            {report.improvement}
          </p>
          <p className="text-xs text-muted-foreground">Week trend</p>
        </div>
      </div>

      <div className="mt-4 flex items-end gap-1.5" style={{ height: 48 }}>
        {report.dailyActivity.map((d) => (
          <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-sm bg-primary/70 transition-all"
              style={{
                height: `${Math.max(4, (d.charts / maxCharts) * 40)}px`,
              }}
            />
            <span className="text-[10px] text-muted-foreground">{d.day}</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{report.recommendedFocus}</p>
      {report.weakestSkill && (
        <p className="mt-1 text-xs text-muted-foreground">
          Weakest: {SKILL_LABELS[report.weakestSkill]} · Strongest:{" "}
          {report.strongestSkill ? SKILL_LABELS[report.strongestSkill] : "—"}
        </p>
      )}

      <Button className="mt-4" size="sm" variant="outline" render={<Link href="/progress" />}>
        Full progress report
      </Button>
    </div>
  )
})
