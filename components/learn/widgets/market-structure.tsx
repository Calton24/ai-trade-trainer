"use client"

import { useEffect, useMemo, useState } from "react"
import { CheckCircle2Icon, RotateCcwIcon, XCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type {
  ContinuationPredictorWidget,
  SwingLabel,
  SwingLabelerWidget,
  TrendBuilderWidget,
} from "@/lib/course/widgets"
import { categoryForContinuationAnswer } from "@/lib/user-state/pattern-recognition"
import { cn } from "@/lib/utils"

import { CHART_H, CHART_W, SwingChart, svgX, svgY } from "./swing-chart"
import { usePatternAttemptRecorder } from "./use-pattern-attempt"

const HIGH_LABELS: SwingLabel[] = ["HH", "LH"]
const LOW_LABELS: SwingLabel[] = ["HL", "LL"]

/**
 * Trend Detective — label each swing HH/HL/LH/LL, then classify the trend.
 * The available labels are constrained by whether each point is a high or low
 * (you can't label a trough a "Higher High").
 */
export function SwingLabeler({
  widget,
  lessonId,
}: {
  widget: SwingLabelerWidget
  lessonId?: string
}) {
  const { record, resetSession } = usePatternAttemptRecorder(lessonId)
  const [labels, setLabels] = useState<Record<number, SwingLabel>>({})
  const [active, setActive] = useState<number | null>(null)
  const [checkedLabels, setCheckedLabels] = useState(false)
  const [trendPick, setTrendPick] = useState<string | null>(null)

  const allLabeled = widget.points.every((_, i) => labels[i])
  const labelResults = useMemo(() => {
    if (!checkedLabels) return undefined
    const out: Record<number, { correct: boolean; label: string }> = {}
    widget.points.forEach((p, i) => {
      out[i] = { correct: labels[i] === p.label, label: labels[i] ?? "?" }
    })
    return out
  }, [checkedLabels, labels, widget.points])

  const correctCount = widget.points.filter((p, i) => labels[i] === p.label).length
  const trendOptions = ["Uptrend", "Downtrend", "Range", "Transition"]

  const reset = () => {
    setLabels({})
    setActive(null)
    setCheckedLabels(false)
    setTrendPick(null)
    resetSession()
  }

  useEffect(() => {
    if (trendPick === null) return
    const labelCorrect = widget.points.filter((p, i) => labels[i] === p.label).length
    const trendCorrect = trendPick === widget.trend ? 1 : 0
    record({
      category: "trend-detection",
      widgetKind: "swing-labeler",
      correct: labelCorrect + trendCorrect,
      total: widget.points.length + 1,
    })
  }, [trendPick, labels, widget.points, widget.trend, record])

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <p className="font-medium">{widget.prompt}</p>

      <div className="mt-4 overflow-hidden rounded-lg border border-border/50 bg-background/40">
        <SwingChart
          points={widget.points}
          selectedIndex={active ?? undefined}
          labeledPoints={labelResults}
          onSelectPoint={checkedLabels ? undefined : (i) => setActive(i)}
        />
      </div>

      {!checkedLabels && (
        <>
          <p className="mt-3 text-sm text-muted-foreground">
            {active === null
              ? "Tap a numbered swing point on the chart to label it."
              : `Point ${active + 1} is a swing ${widget.points[active].type}. Choose its label:`}
          </p>
          {active !== null && (
            <div className="mt-2 flex flex-wrap gap-2">
              {(widget.points[active].type === "high" ? HIGH_LABELS : LOW_LABELS).map(
                (opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setLabels((l) => ({ ...l, [active]: opt }))
                      setActive(null)
                    }}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm transition-colors",
                      labels[active] === opt
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {opt}
                  </button>
                )
              )}
            </div>
          )}
          {/* Labeled-so-far chips */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {widget.points.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "rounded-md border px-2 py-0.5 text-xs",
                  labels[i]
                    ? "border-primary/40 bg-primary/5 text-primary"
                    : "border-border/50 text-muted-foreground"
                )}
              >
                {i + 1}: {labels[i] ?? "—"}
              </span>
            ))}
          </div>
          <Button
            size="sm"
            className="mt-4"
            disabled={!allLabeled}
            onClick={() => setCheckedLabels(true)}
          >
            Check labels
          </Button>
        </>
      )}

      {checkedLabels && (
        <>
          <p
            className={cn(
              "mt-3 text-sm font-medium",
              correctCount === widget.points.length ? "text-primary" : "text-destructive"
            )}
          >
            {correctCount}/{widget.points.length} swings labeled correctly
          </p>

          {/* Trend classification step */}
          {trendPick === null ? (
            <>
              <p className="mt-4 text-sm font-medium">
                Now: what trend does this structure describe?
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {trendOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTrendPick(opt)}
                    className="rounded-full border border-border/60 px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div
              className={cn(
                "mt-4 flex items-start gap-2 rounded-lg border p-3 text-sm",
                trendPick === widget.trend
                  ? "border-primary/40 bg-primary/5"
                  : "border-destructive/40 bg-destructive/5"
              )}
            >
              {trendPick === widget.trend ? (
                <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
              ) : (
                <XCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
              )}
              <span className="text-muted-foreground">
                {trendPick === widget.trend ? "" : `Correct answer: ${widget.trend}. `}
                {widget.trendExplain}
              </span>
            </div>
          )}

          <Button size="sm" variant="outline" className="mt-4" onClick={reset}>
            <RotateCcwIcon data-icon="inline-start" />
            Try again
          </Button>
        </>
      )}
    </div>
  )
}

const DEFAULT_PREDICT_OPTIONS = [
  "Continuation",
  "Reversal",
  "Range",
  "Need more confirmation",
]

/** Continuation Predictor — the chart pauses; predict the next move. */
export function ContinuationPredictor({
  widget,
  lessonId,
}: {
  widget: ContinuationPredictorWidget
  lessonId?: string
}) {
  const { record, resetSession } = usePatternAttemptRecorder(lessonId)
  const [picked, setPicked] = useState<string | null>(null)
  const options = widget.options ?? DEFAULT_PREDICT_OPTIONS
  const isCorrect = picked === widget.correct

  useEffect(() => {
    if (!picked) return
    record({
      category: categoryForContinuationAnswer(widget.correct),
      widgetKind: "continuation-predictor",
      correct: isCorrect ? 1 : 0,
      total: 1,
    })
  }, [picked, isCorrect, widget.correct, record])

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <p className="font-medium">{widget.prompt}</p>

      <div className="mt-4 overflow-hidden rounded-lg border border-border/50 bg-background/40">
        <SwingChart points={widget.points} showFutureHint />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            disabled={Boolean(picked)}
            onClick={() => setPicked(opt)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              picked === opt
                ? isCorrect
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-destructive bg-destructive/10 text-destructive"
                : picked && opt === widget.correct
                  ? "border-primary/60 bg-primary/5 text-primary"
                  : "border-border/60 text-muted-foreground hover:border-primary/40 disabled:opacity-60"
            )}
          >
            {opt}
          </button>
        ))}
      </div>

      {picked && (
        <div
          className={cn(
            "mt-4 flex items-start gap-2 text-sm",
            isCorrect ? "text-primary" : "text-destructive"
          )}
        >
          {isCorrect ? (
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
          ) : (
            <XCircleIcon className="mt-0.5 size-4 shrink-0" />
          )}
          <span className="text-muted-foreground">
            {isCorrect ? "" : `Most likely: ${widget.correct}. `}
            {widget.explain}
          </span>
        </div>
      )}

      {picked && (
        <Button
          size="sm"
          variant="outline"
          className="mt-4"
          onClick={() => {
            setPicked(null)
            resetSession()
          }}
        >
          <RotateCcwIcon data-icon="inline-start" />
          Try again
        </Button>
      )}
    </div>
  )
}

/**
 * Trend Builder — tap the chart to place alternating swing points, then the
 * widget grades whether the pattern forms the requested trend.
 */
export function TrendBuilder({
  widget,
  lessonId,
}: {
  widget: TrendBuilderWidget
  lessonId?: string
}) {
  const { record, resetSession } = usePatternAttemptRecorder(lessonId)
  const [placed, setPlaced] = useState<{ x: number; y: number }[]>([])
  const [checked, setChecked] = useState(false)

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (checked || placed.length >= widget.pointCount) return
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * CHART_W
    const y = ((e.clientY - rect.top) / rect.height) * CHART_H
    // Convert SVG y back into price-space (higher = higher price)
    const priceY = ((CHART_H - 6 - y) / (CHART_H - 12)) * 100
    setPlaced((p) => [...p, { x, y: Math.max(0, Math.min(100, priceY)) }])
  }

  // Grade: alternating highs/lows must trend up (uptrend) or down (downtrend).
  const grade = useMemo(() => {
    if (placed.length < widget.pointCount) return null
    const highs = placed.filter((_, i) => i % 2 === 0)
    const lows = placed.filter((_, i) => i % 2 === 1)
    const monotonic = (arr: { y: number }[], up: boolean) =>
      arr.every((p, i) => i === 0 || (up ? p.y > arr[i - 1].y : p.y < arr[i - 1].y))
    const up = widget.target === "Uptrend"
    const highsOk = monotonic(highs, up)
    const lowsOk = monotonic(lows, up)
    return { ok: highsOk && lowsOk, highsOk, lowsOk }
  }, [placed, widget.pointCount, widget.target])

  const linePoints = placed.map((p) => `${svgX(p.x)},${svgY(p.y)}`).join(" ")

  const reset = () => {
    setPlaced([])
    setChecked(false)
    resetSession()
  }

  useEffect(() => {
    if (!checked || !grade) return
    record({
      category: "trend-building",
      widgetKind: "trend-builder",
      correct: grade.ok ? 1 : 0,
      total: 1,
    })
  }, [checked, grade, record])

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <p className="font-medium">{widget.prompt}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Tap {widget.pointCount} points, alternating peaks and troughs (start with a
        peak), to build a clean {widget.target.toLowerCase()}. Points placed:{" "}
        {placed.length}/{widget.pointCount}.
      </p>

      <div className="mt-4 overflow-hidden rounded-lg border border-border/50 bg-background/40">
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          className="w-full touch-none"
          onClick={handleClick}
          style={{ cursor: placed.length < widget.pointCount && !checked ? "crosshair" : "default" }}
          role="img"
          aria-label="Trend builder canvas"
        >
          <line
            x1={0}
            y1={CHART_H - 4}
            x2={CHART_W}
            y2={CHART_H - 4}
            stroke="var(--border)"
            strokeWidth={0.3}
          />
          {placed.length > 1 && (
            <polyline
              points={linePoints}
              fill="none"
              stroke={
                checked
                  ? grade?.ok
                    ? "var(--primary)"
                    : "var(--destructive)"
                  : "var(--primary)"
              }
              strokeWidth={0.7}
              strokeLinejoin="round"
              opacity={0.6}
            />
          )}
          {placed.map((p, i) => (
            <circle
              key={i}
              cx={svgX(p.x)}
              cy={svgY(p.y)}
              r={1.8}
              fill="var(--card)"
              stroke={i % 2 === 0 ? "var(--primary)" : "var(--muted-foreground)"}
              strokeWidth={0.6}
            />
          ))}
        </svg>
      </div>

      <div className="mt-4 flex items-center gap-3">
        {!checked ? (
          <>
            <Button
              size="sm"
              disabled={placed.length < widget.pointCount}
              onClick={() => setChecked(true)}
            >
              Check structure
            </Button>
            {placed.length > 0 && (
              <Button size="sm" variant="ghost" onClick={reset}>
                <RotateCcwIcon data-icon="inline-start" />
                Clear
              </Button>
            )}
          </>
        ) : (
          <>
            <p
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium",
                grade?.ok ? "text-primary" : "text-destructive"
              )}
            >
              {grade?.ok ? (
                <CheckCircle2Icon className="size-4" />
              ) : (
                <XCircleIcon className="size-4" />
              )}
              {grade?.ok
                ? `Clean ${widget.target.toLowerCase()}!`
                : widget.target === "Uptrend"
                  ? "Not quite — an uptrend needs each peak higher than the last (HH) and each trough higher than the last (HL)."
                  : "Not quite — a downtrend needs each peak lower than the last (LH) and each trough lower than the last (LL)."}
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
