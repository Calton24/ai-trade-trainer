"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  RotateCcwIcon,
  XCircleIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { GuidedCompletionSummary } from "@/lib/execution-lab/guided/types"
import type { ExecutionValidation } from "@/lib/execution-lab/types"
import { cn } from "@/lib/utils"

interface GuidedCompletionProps {
  scenarioTitle: string
  validation: ExecutionValidation
  outcome: "win" | "loss" | "skipped" | "open" | null
  summary: GuidedCompletionSummary
  onRetry: () => void
  onNext?: () => void
}

export function GuidedCompletion({
  scenarioTitle,
  validation,
  outcome,
  summary,
  onRetry,
  onNext,
}: GuidedCompletionProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-card/50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Session Complete
          </p>
          <h2 className="text-lg font-semibold">{scenarioTitle}</h2>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">{summary.durationMinutes} min</Badge>
          {outcome && outcome !== "open" && (
            <Badge variant={outcome === "win" ? "default" : "secondary"}>
              {outcome}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Execution" value={`${validation.score}%`} />
        <Stat label="Hints used" value={String(summary.hintsUsed)} />
        <Stat label="Reveal" value={summary.revealUsed ? "Yes" : "No"} />
        <Stat
          label="Result"
          value={validation.passed ? "Pass" : "Review"}
          accent={validation.passed}
        />
      </div>

      {summary.greatDecisions.length > 0 && (
        <div>
          <p className="text-sm font-medium">Great decisions</p>
          <ul className="mt-2 space-y-1">
            {summary.greatDecisions.map((g) => (
              <li key={g} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary.mistakes.length > 0 && (
        <div>
          <p className="text-sm font-medium">Areas to improve</p>
          <ul className="mt-2 space-y-1">
            {summary.mistakes.map((m) => (
              <li key={m} className="flex items-start gap-2 text-sm text-muted-foreground">
                <XCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="text-sm font-medium">Execution report</p>
        <ul className="mt-2 space-y-1">
          {validation.feedback.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              {f.ok ? (
                <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
              ) : (
                <XCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
              )}
              {f.message}
            </li>
          ))}
        </ul>
      </div>

      {summary.recommendations.length > 0 && (
        <div>
          <p className="text-sm font-medium">Recommended practice</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {summary.recommendations.map((r) => (
              <Button key={r.href} size="sm" variant="outline" render={<Link href={r.href} />}>
                {r.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2">
        <Button size="sm" variant="outline" onClick={onRetry}>
          <RotateCcwIcon data-icon="inline-start" />
          Replay scenario
        </Button>
        {onNext && (
          <Button size="sm" onClick={onNext}>
            Next scenario
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        )}
        <Button size="sm" variant="ghost" render={<Link href="/execution-lab" />}>
          Back to lab
        </Button>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-background/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("mt-1 font-mono text-lg font-semibold", accent && "text-primary")}>
        {value}
      </p>
    </div>
  )
}
