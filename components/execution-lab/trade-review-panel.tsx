"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ChevronDownIcon, StarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SurfaceCard } from "@/components/shared/surface-card"
import type { TradeReviewReport } from "@/lib/execution-lab/trade-review"
import { cn } from "@/lib/utils"

interface TradeReviewPanelProps {
  report: TradeReviewReport
  className?: string
}

export function TradeReviewPanel({ report, className }: TradeReviewPanelProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      const frame = requestAnimationFrame(() => setAnimatedScore(report.overallScore))
      return () => cancelAnimationFrame(frame)
    }

    const target = report.overallScore
    const duration = 600
    const start = performance.now()
    let frameId = 0

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(target * eased))
      if (progress < 1) frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [report.overallScore])

  const visibleSections = expanded ? report.sections : report.sections.slice(0, 3)

  return (
    <SurfaceCard className={cn("app-fade-in", className)} padding="md">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Professional Trade Review
          </p>
          <h3 className="mt-1 text-lg font-semibold">{report.market}</h3>
          <p className="text-sm text-muted-foreground">
            {report.behaviour} · {report.decision} · {report.outcome}
          </p>
        </div>
        <div className="text-right">
          <p
            className="text-3xl font-semibold tabular-nums text-primary"
            aria-label={`Execution score ${report.overallScore} percent`}
          >
            {animatedScore}%
          </p>
          <p className="text-sm font-medium">{report.letterGrade}</p>
          <Badge variant="outline" className="mt-1">
            Institutional {report.institutionalGrade}%
          </Badge>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {visibleSections.map((section) => (
          <div
            key={section.label}
            className="flex items-start justify-between gap-4 border-b border-border/40 pb-3 last:border-0"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{section.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{section.commentary}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="flex" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={cn(
                      "size-3.5",
                      i < section.stars ? "fill-primary text-primary" : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              <span className="w-10 text-right font-mono text-sm tabular-nums">
                {section.score}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {report.sections.length > 3 && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full text-muted-foreground"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Show less" : `Show all ${report.sections.length} sections`}
          <ChevronDownIcon
            className={cn("size-4 transition-transform duration-200", expanded && "rotate-180")}
            data-icon="inline-end"
          />
        </Button>
      )}

      <div className="mt-4 rounded-lg border border-border/50 bg-background/40 p-4">
        <p className="text-sm font-medium">
          Would I take this trade?{" "}
          <span className={report.wouldTakeTrade ? "text-primary" : "text-muted-foreground"}>
            {report.wouldTakeTrade ? "YES" : "NO — wait for better conditions"}
          </span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{report.professionalCommentary}</p>
      </div>

      {report.violations.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-destructive">Rule Violations</p>
          <ul className="mt-2 space-y-1">
            {report.violations.map((v, i) => (
              <li key={i} className="text-xs text-muted-foreground">
                · {v.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Suggested next drill</p>
        <Button size="sm" variant="outline" render={<Link href={report.suggestedDrill.href} />}>
          {report.suggestedDrill.label}
        </Button>
      </div>
    </SurfaceCard>
  )
}
