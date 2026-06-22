"use client"

import {
  CheckCircle2Icon,
  LightbulbIcon,
  SparklesIcon,
  XCircleIcon,
} from "lucide-react"

import type { ChartScoreResult } from "@/lib/charts/types"
import { cn } from "@/lib/utils"

interface ChartFeedbackProps {
  result: ChartScoreResult
}

export function ChartFeedback({ result }: ChartFeedbackProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-4",
        result.passed
          ? "border-primary/20 bg-primary/5"
          : "border-amber-500/20 bg-amber-500/5"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {result.passed ? (
            <CheckCircle2Icon className="size-5 text-primary" />
          ) : (
            <XCircleIcon className="size-5 text-amber-500" />
          )}
          <span className="text-sm font-medium">
            {result.passed ? "Nice read" : "Almost there"}
          </span>
        </div>
        <span className="font-mono text-lg font-semibold">{result.score}%</span>
      </div>

      <p className="text-sm text-muted-foreground">{result.summary}</p>

      {result.correct.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {result.correct.map((item, i) => (
            <li key={`c-${i}`} className="flex items-start gap-2 text-sm">
              <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {result.improvements.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {result.improvements.map((item, i) => (
            <li key={`i-${i}`} className="flex items-start gap-2 text-sm">
              <XCircleIcon className="mt-0.5 size-4 shrink-0 text-amber-500" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-background/40 p-3">
        <LightbulbIcon className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-sm text-muted-foreground">{result.tip}</p>
      </div>

      {result.passed && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <SparklesIcon className="size-4" />
          <span>You can now spot this pattern on a live chart.</span>
        </div>
      )}
    </div>
  )
}
