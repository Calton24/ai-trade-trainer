"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { CheckCircle2Icon, RotateCcwIcon, XCircleIcon } from "lucide-react"

import { ChartCanvas } from "@/components/chart-lab/chart-canvas"
import { ChartReplayControls } from "@/components/simulator/chart-replay-controls"
import { useChartReplay } from "@/components/simulator/use-chart-replay"
import { Button } from "@/components/ui/button"
import { generateScenario } from "@/lib/charts/generate-scenario"
import type { StructureReplayWidget } from "@/lib/course/widgets"
import { sliceVisibleCandles } from "@/lib/simulator/replay"
import { categoryForContinuationAnswer, type PatternCategory } from "@/lib/user-state/pattern-recognition"
import { cn } from "@/lib/utils"

import { usePatternAttemptRecorder } from "./use-pattern-attempt"

const TREND_OPTIONS = ["Uptrend", "Downtrend", "Range", "Transition"] as const
const DEFAULT_PREDICT_OPTIONS = [
  "Continuation",
  "Reversal",
  "Range",
  "Need more confirmation",
]

interface StructureReplayProps {
  widget: StructureReplayWidget
  lessonId?: string
}

export function StructureReplay({ widget, lessonId }: StructureReplayProps) {
  const { record, resetSession } = usePatternAttemptRecorder(lessonId)

  const startIndex = widget.startIndex ?? 8
  const scenario = useMemo(
    () =>
      generateScenario({
        kind: widget.scenarioKind,
        seed: widget.seed,
        base: 2350,
      }),
    [widget.scenarioKind, widget.seed]
  )

  const maxIndex = scenario.candles.length - 1
  const replay = useChartReplay({
    minIndex: 0,
    maxIndex,
    initialIndex: startIndex,
  })

  const visibleCandles = sliceVisibleCandles(scenario.candles, replay.currentIndex)
  const atPause = replay.currentIndex >= widget.pauseIndex
  const [confidence, setConfidence] = useState<number | null>(null)
  const [answer, setAnswer] = useState<string | null>(null)

  const correctAnswer =
    widget.task === "classify-trend" ? widget.correctTrend : widget.correct
  const isCorrect = answer !== null && answer === correctAnswer
  const options =
    widget.task === "classify-trend"
      ? [...TREND_OPTIONS]
      : (widget.options ?? DEFAULT_PREDICT_OPTIONS)

  const reset = useCallback(() => {
    replay.reset()
    setConfidence(null)
    setAnswer(null)
    resetSession()
  }, [replay, resetSession])

  const category: PatternCategory =
    widget.task === "classify-trend"
      ? "trend-detection"
      : categoryForContinuationAnswer(widget.correct ?? "Continuation")

  useEffect(() => {
    if (!answer || confidence === null) return
    record({
      category,
      widgetKind: "structure-replay",
      correct: isCorrect ? 1 : 0,
      total: 1,
      confidence,
    })
  }, [answer, confidence, category, isCorrect, record])

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <p className="font-medium">{widget.prompt}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Reveal candles one at a time. When you reach the pause point, answer before
        the full picture is obvious.
      </p>

      <div className="mt-4 overflow-hidden rounded-lg border border-border/50 bg-background/40">
        <ChartCanvas candles={visibleCandles} height={320} />
      </div>

      <ChartReplayControls
        className="mt-3"
        isPlaying={replay.isPlaying}
        speed={replay.speed}
        currentIndex={replay.currentIndex}
        maxIndex={maxIndex}
        minIndex={0}
        onPlay={replay.play}
        onPause={replay.pause}
        onNext={replay.next}
        onPrev={replay.prev}
        onReset={reset}
        onSpeedChange={replay.setSpeed}
      />

      {!atPause && (
        <p className="mt-3 text-sm text-muted-foreground">
          Reveal to candle {widget.pauseIndex + 1} to unlock the question (
          {replay.currentIndex + 1}/{widget.pauseIndex + 1}).
        </p>
      )}

      {atPause && confidence === null && answer === null && (
        <>
          <p className="mt-4 text-sm font-medium">
            Before you answer — how confident are you in your read?
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[25, 50, 75, 90].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setConfidence(pct)}
                className="rounded-full border border-border/60 px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40"
              >
                {pct}%
              </button>
            ))}
          </div>
        </>
      )}

      {atPause && confidence !== null && answer === null && (
        <>
          <p className="mt-4 text-sm font-medium">
            {widget.task === "classify-trend"
              ? "What trend does this structure describe?"
              : "What is the market most likely attempting next?"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setAnswer(opt)}
                className="rounded-full border border-border/60 px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40"
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}

      {answer !== null && (
        <div
          className={cn(
            "mt-4 flex items-start gap-2 rounded-lg border p-3 text-sm",
            isCorrect
              ? "border-primary/40 bg-primary/5"
              : "border-destructive/40 bg-destructive/5"
          )}
        >
          {isCorrect ? (
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
          ) : (
            <XCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
          )}
          <span className="text-muted-foreground">
            {!isCorrect && correctAnswer ? `Correct answer: ${correctAnswer}. ` : ""}
            {widget.explain}
          </span>
        </div>
      )}

      {answer !== null && (
        <Button size="sm" variant="outline" className="mt-4" onClick={reset}>
          <RotateCcwIcon data-icon="inline-start" />
          Try again
        </Button>
      )}
    </div>
  )
}
