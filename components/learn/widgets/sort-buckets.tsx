"use client"

import { useMemo, useState } from "react"
import { CheckCircle2Icon, RotateCcwIcon, XCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { SortBucketsWidget } from "@/lib/course/widgets"
import { cn } from "@/lib/utils"

/** Tap-to-sort exercise: assign each item to the correct bucket. */
export function SortBuckets({ widget }: { widget: SortBucketsWidget }) {
  const [placements, setPlacements] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)

  const items = useMemo(
    () => [...widget.items].sort((a, b) => a.label.localeCompare(b.label)),
    [widget.items]
  )

  const allPlaced = items.every((i) => placements[i.label])
  const correctCount = items.filter(
    (i) => placements[i.label] === i.bucket
  ).length

  const assign = (label: string, bucket: string) => {
    if (checked) return
    setPlacements((p) => ({ ...p, [label]: p[label] === bucket ? "" : bucket }))
  }

  const reset = () => {
    setPlacements({})
    setChecked(false)
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <p className="font-medium">{widget.prompt}</p>
      <div className="mt-4 flex flex-col gap-3">
        {items.map((item) => {
          const placed = placements[item.label]
          const isCorrect = checked && placed === item.bucket
          const isWrong = checked && placed !== item.bucket
          return (
            <div
              key={item.label}
              className={cn(
                "rounded-lg border p-3",
                isCorrect && "border-primary/40 bg-primary/5",
                isWrong && "border-destructive/40 bg-destructive/5",
                !checked && "border-border/60"
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium">{item.label}</span>
                <div className="flex flex-wrap gap-1.5">
                  {widget.buckets.map((bucket) => (
                    <button
                      key={bucket}
                      type="button"
                      onClick={() => assign(item.label, bucket)}
                      disabled={checked}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs transition-colors",
                        placed === bucket
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/60 text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      {bucket}
                    </button>
                  ))}
                </div>
              </div>
              {isWrong && (
                <p className="mt-2 flex items-start gap-1.5 text-xs text-destructive">
                  <XCircleIcon className="mt-0.5 size-3.5 shrink-0" />
                  Correct: {item.bucket}
                  {item.explain ? ` — ${item.explain}` : ""}
                </p>
              )}
              {isCorrect && item.explain && (
                <p className="mt-2 flex items-start gap-1.5 text-xs text-primary">
                  <CheckCircle2Icon className="mt-0.5 size-3.5 shrink-0" />
                  {item.explain}
                </p>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-4 flex items-center gap-3">
        {!checked ? (
          <Button size="sm" disabled={!allPlaced} onClick={() => setChecked(true)}>
            Check answers
          </Button>
        ) : (
          <>
            <p className="text-sm font-medium">
              {correctCount}/{items.length} correct
            </p>
            <Button size="sm" variant="outline" onClick={reset}>
              <RotateCcwIcon data-icon="inline-start" />
              Try again
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
