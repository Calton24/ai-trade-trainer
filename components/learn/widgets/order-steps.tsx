"use client"

import { useMemo, useState } from "react"
import { ArrowDownIcon, ArrowUpIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { OrderStepsWidget } from "@/lib/course/widgets"
import { cn } from "@/lib/utils"

function seededShuffle(steps: string[]): string[] {
  const a = [...steps]
  let s = steps.length * 31 + 7
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  // Ensure it's not accidentally already correct
  if (a.every((v, i) => v === steps[i]) && a.length > 1) {
    ;[a[0], a[1]] = [a[1], a[0]]
  }
  return a
}

/** Reorder shuffled steps into the correct sequence using up/down controls. */
export function OrderSteps({ widget }: { widget: OrderStepsWidget }) {
  const initial = useMemo(() => seededShuffle(widget.steps), [widget.steps])
  const [order, setOrder] = useState<string[]>(initial)
  const [checked, setChecked] = useState(false)

  const move = (index: number, dir: -1 | 1) => {
    if (checked) return
    const target = index + dir
    if (target < 0 || target >= order.length) return
    const next = [...order]
    ;[next[index], next[target]] = [next[target], next[index]]
    setOrder(next)
  }

  const correctCount = order.filter((s, i) => s === widget.steps[i]).length
  const allCorrect = correctCount === widget.steps.length

  const reset = () => {
    setOrder(seededShuffle(widget.steps))
    setChecked(false)
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <p className="font-medium">{widget.prompt}</p>
      <div className="mt-4 flex flex-col gap-2">
        {order.map((step, i) => {
          const isCorrect = checked && step === widget.steps[i]
          const isWrong = checked && step !== widget.steps[i]
          return (
            <div
              key={step}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2",
                isCorrect && "border-primary/40 bg-primary/5",
                isWrong && "border-destructive/40 bg-destructive/5",
                !checked && "border-border/60"
              )}
            >
              <span className="text-xs font-semibold text-muted-foreground">
                {i + 1}
              </span>
              <span className="flex-1 text-sm">{step}</span>
              {!checked && (
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded border border-border/60 p-1 text-muted-foreground hover:border-primary/40 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ArrowUpIcon className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === order.length - 1}
                    className="rounded border border-border/60 p-1 text-muted-foreground hover:border-primary/40 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ArrowDownIcon className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-4 flex items-center gap-3">
        {!checked ? (
          <Button size="sm" onClick={() => setChecked(true)}>
            Check order
          </Button>
        ) : (
          <>
            <p
              className={cn(
                "text-sm font-medium",
                allCorrect ? "text-primary" : "text-destructive"
              )}
            >
              {allCorrect
                ? "Perfect order!"
                : `${correctCount}/${widget.steps.length} in the right place`}
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
