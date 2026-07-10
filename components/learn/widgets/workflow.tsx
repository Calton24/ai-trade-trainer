"use client"

import { useState } from "react"
import { CheckCircle2Icon, RotateCcwIcon, XCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type {
  DailyChecklistWidget,
  JournalReviewWidget,
  WatchlistBuilderWidget,
} from "@/lib/course/widgets"
import { cn } from "@/lib/utils"

/** Interactive checklist — every item must be ticked to complete. */
export function DailyChecklist({ widget }: { widget: DailyChecklistWidget }) {
  const [done, setDone] = useState<Set<number>>(new Set())

  const toggle = (i: number) => {
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const complete = done.size === widget.items.length

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <p className="font-medium">{widget.title}</p>
      <div className="mt-4 flex flex-col gap-2">
        {widget.items.map((item, i) => (
          <button
            key={item}
            type="button"
            onClick={() => toggle(i)}
            className={cn(
              "flex items-start gap-3 rounded-lg border px-4 py-2.5 text-left transition-colors",
              done.has(i)
                ? "border-primary/40 bg-primary/5"
                : "border-border/60 hover:border-primary/40"
            )}
          >
            <CheckCircle2Icon
              className={cn(
                "mt-0.5 size-4 shrink-0",
                done.has(i) ? "text-primary" : "text-muted-foreground/40"
              )}
            />
            <span
              className={cn(
                "text-sm",
                done.has(i) ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {item}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {done.size}/{widget.items.length} complete
        </p>
        {complete && (
          <p className="text-sm font-medium text-primary">
            Checklist complete — this is the routine.
          </p>
        )}
      </div>
    </div>
  )
}

/** Pick the best N pairs from a set of cards; graded with explanations. */
export function WatchlistBuilder({
  widget,
}: {
  widget: WatchlistBuilderWidget
}) {
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [checked, setChecked] = useState(false)

  const toggle = (pair: string) => {
    if (checked) return
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(pair)) next.delete(pair)
      else if (next.size < widget.maxPicks) next.add(pair)
      return next
    })
  }

  const goodPicks = widget.pairs.filter((p) => p.goodPick).map((p) => p.pair)
  const correctCount = [...picked].filter((p) => goodPicks.includes(p)).length

  const trendLabel = {
    up: "Uptrend",
    down: "Downtrend",
    range: "Range",
    messy: "Messy",
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <p className="font-medium">{widget.prompt}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Pick up to {widget.maxPicks} pairs.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {widget.pairs.map((p) => {
          const isPicked = picked.has(p.pair)
          const showResult = checked && (isPicked || p.goodPick)
          const wasRight = isPicked === p.goodPick
          return (
            <button
              key={p.pair}
              type="button"
              onClick={() => toggle(p.pair)}
              disabled={checked}
              className={cn(
                "rounded-lg border p-4 text-left transition-colors",
                checked && showResult && wasRight && "border-primary/50 bg-primary/5",
                checked && showResult && !wasRight && "border-destructive/50 bg-destructive/5",
                !checked && isPicked && "border-primary bg-primary/10",
                !checked && !isPicked && "border-border/60 hover:border-primary/40"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{p.pair}</span>
                <span className="text-xs text-muted-foreground">
                  {trendLabel[p.trend]}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5",
                    p.withDxy
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {p.withDxy ? "DXY agrees" : "DXY conflicts"}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5",
                    p.cleanStructure
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {p.cleanStructure ? "Clean structure" : "Choppy"}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5",
                    p.newsRisk
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {p.newsRisk ? "High-impact news" : "No news"}
                </span>
              </div>
              {checked && showResult && (
                <p
                  className={cn(
                    "mt-2 text-xs",
                    wasRight ? "text-primary" : "text-destructive"
                  )}
                >
                  {p.explain}
                </p>
              )}
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex items-center gap-3">
        {!checked ? (
          <Button
            size="sm"
            disabled={picked.size === 0}
            onClick={() => setChecked(true)}
          >
            Check watchlist
          </Button>
        ) : (
          <>
            <p className="text-sm font-medium">
              {correctCount}/{goodPicks.length} strong pairs found
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setPicked(new Set())
                setChecked(false)
              }}
            >
              <RotateCcwIcon data-icon="inline-start" />
              Try again
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

/** Journal review: label each entry (emotion mistake, rule break, good process…). */
export function JournalReview({ widget }: { widget: JournalReviewWidget }) {
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const answeredCount = Object.keys(answers).length
  const correctCount = widget.entries.filter(
    (e, i) => answers[i] === e.correct
  ).length

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <p className="font-medium">{widget.prompt}</p>
      <div className="mt-4 flex flex-col gap-4">
        {widget.entries.map((entry, i) => {
          const picked = answers[i]
          const isCorrect = picked === entry.correct
          return (
            <div key={i} className="rounded-lg border border-border/60 p-4">
              <p className="text-sm italic leading-relaxed text-muted-foreground">
                “{entry.summary}”
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    disabled={Boolean(picked)}
                    onClick={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs transition-colors",
                      picked === opt
                        ? isCorrect
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-destructive bg-destructive/10 text-destructive"
                        : picked && opt === entry.correct
                          ? "border-primary/60 bg-primary/5 text-primary"
                          : "border-border/60 text-muted-foreground hover:border-primary/40 disabled:opacity-60"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {picked && (
                <p
                  className={cn(
                    "mt-3 flex items-start gap-1.5 text-xs",
                    isCorrect ? "text-primary" : "text-destructive"
                  )}
                >
                  {isCorrect ? (
                    <CheckCircle2Icon className="mt-0.5 size-3.5 shrink-0" />
                  ) : (
                    <XCircleIcon className="mt-0.5 size-3.5 shrink-0" />
                  )}
                  <span className="text-muted-foreground">{entry.explain}</span>
                </p>
              )}
            </div>
          )
        })}
      </div>
      {answeredCount === widget.entries.length && (
        <div className="mt-4 flex items-center gap-3">
          <p className="text-sm font-medium">
            {correctCount}/{widget.entries.length} correctly identified
          </p>
          <Button size="sm" variant="outline" onClick={() => setAnswers({})}>
            <RotateCcwIcon data-icon="inline-start" />
            Review again
          </Button>
        </div>
      )}
    </div>
  )
}
