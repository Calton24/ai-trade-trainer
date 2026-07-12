"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  RotateCcwIcon,
  XCircleIcon,
} from "lucide-react"

import { ChartReplayControls } from "@/components/simulator/chart-replay-controls"
import { useChartReplay } from "@/components/simulator/use-chart-replay"
import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fitViewport, type ChartViewport } from "@/lib/execution-lab/chart-viewport"
import { useExecutionAttemptTracking } from "@/lib/execution-analytics/use-execution-attempt"
import { createDefaultPlan } from "@/lib/execution-lab/default-plan"
import type { ChartDrawing, DrawingTool } from "@/lib/execution-lab/drawings"
import { computeTradeMetrics } from "@/lib/execution-lab/sizing"
import { generateTradeReview } from "@/lib/execution-lab/trade-review"
import { validateExecution } from "@/lib/execution-lab/scoring"
import {
  type ActiveTrade,
  type TradePhase,
  checkCandleExit,
  closeTradeEarly,
  detectPlanningViolations,
  moveStopToBreakeven,
  scoreManagement,
} from "@/lib/execution-lab/trade-management"
import { computeFloatingWithLevels } from "@/lib/execution-lab/terminal-metrics"
import { sliceVisibleCandles } from "@/lib/simulator/replay"
import type { ExecutionMode, ExecutionScenario, ExecutionTradePlan } from "@/lib/execution-lab/types"
import { cn } from "@/lib/utils"

import { ChartDrawingToolbar } from "./chart-drawing-toolbar"
import { ChartViewportControls } from "./chart-viewport-controls"
import { ExecutionChart } from "./execution-chart"
import { ExecutionTicket } from "./execution-ticket"
import { TradeReviewPanel } from "./trade-review-panel"
import { TradeStatusPanel } from "./trade-status-panel"

interface ExecutionWorkspaceProps {
  scenario: ExecutionScenario
  mode?: ExecutionMode
  onNext?: () => void
}

export function ExecutionWorkspace({
  scenario,
  mode = "practice",
  onNext,
}: ExecutionWorkspaceProps) {
  const { recordExecutionAttempt } = useUserState()
  const { markInteraction, completeAttempt } = useExecutionAttemptTracking({
    scenarioId: scenario.id,
    mode,
  })
  const [phase, setPhase] = useState<TradePhase>("planning")
  const [submitted, setSubmitted] = useState(false)
  const [validation, setValidation] = useState<ReturnType<typeof validateExecution> | null>(null)
  const [outcome, setOutcome] = useState<
    "win" | "loss" | "skipped" | "open" | "breakeven" | "manual" | null
  >(null)
  const [activeTrade, setActiveTrade] = useState<ActiveTrade | null>(null)
  const [plan, setPlan] = useState<ExecutionTradePlan>(() => createDefaultPlan(scenario))
  const [viewport, setViewport] = useState<ChartViewport>(() =>
    fitViewport(scenario.chart.candles.length)
  )
  const [drawings, setDrawings] = useState<ChartDrawing[]>([])
  const [activeTool, setActiveTool] = useState<DrawingTool>("cursor")
  const [magnet, setMagnet] = useState(false)
  const [ticketOpen, setTicketOpen] = useState(true)

  const replay = useChartReplay({
    minIndex: 8,
    maxIndex: scenario.replayEndIndex,
    initialIndex: scenario.pauseIndex,
  })

  const allCandles = scenario.chart.candles
  const visibleCandles = sliceVisibleCandles(allCandles, replay.currentIndex)
  const atDecisionPoint = replay.currentIndex >= scenario.pauseIndex

  const metrics = useMemo(() => {
    if (plan.direction !== "buy" && plan.direction !== "sell") return null
    return computeTradeMetrics({
      direction: plan.direction,
      entry: plan.entry,
      stop: plan.stop,
      target: plan.target,
      accountSize: plan.accountSize,
      riskPercent: plan.riskPercent,
      pipSize: scenario.pipSize,
      pipValuePerLot: scenario.pipValuePerLot,
      lotsOverride: plan.lots,
    })
  }, [plan, scenario])

  const floating = useMemo(() => {
    if (!activeTrade || activeTrade.status === "closed") {
      return { pips: 0, pnl: 0, rr: 0, distToSlPips: 0, distToTpPips: 0 }
    }
    const c = allCandles[replay.currentIndex]
    if (!c) return { pips: 0, pnl: 0, rr: 0, distToSlPips: 0, distToTpPips: 0 }
    return computeFloatingWithLevels({
      direction: activeTrade.direction,
      entry: activeTrade.entry,
      stop: activeTrade.stop,
      target: activeTrade.target,
      currentPrice: c.close,
      lots: activeTrade.lots,
      pipSize: scenario.pipSize,
      pipValuePerLot: scenario.pipValuePerLot,
    })
  }, [activeTrade, replay.currentIndex, allCandles, scenario])

  const planningViolations = useMemo(
    () => (phase === "complete" ? detectPlanningViolations(scenario, plan) : []),
    [phase, scenario, plan]
  )

  const tradeReview = useMemo(() => {
    if (!validation || phase !== "complete") return null
    return generateTradeReview(scenario, plan, validation, outcome, {
      violations: [...planningViolations, ...(activeTrade?.violations ?? [])],
      managementScore: scoreManagement(activeTrade, outcome),
    })
  }, [validation, phase, scenario, plan, outcome, planningViolations, activeTrade])

  const handleChange = useCallback(
    (patch: Partial<ExecutionTradePlan>) => {
      markInteraction()
      setPlan((p) => {
        const next = { ...p, ...patch }
        if ((patch.direction === "buy" || patch.direction === "sell") && !patch.lots) {
          const m = computeTradeMetrics({
            direction: next.direction as "buy" | "sell",
            entry: next.entry,
            stop: next.stop,
            target: next.target,
            accountSize: next.accountSize,
            riskPercent: next.riskPercent,
            pipSize: scenario.pipSize,
            pipValuePerLot: scenario.pipValuePerLot,
          })
          next.lots = m.lots
        }
        return next
      })
    },
    [scenario, markInteraction]
  )

  const finalizeTrade = useCallback(
    (
      tradeOutcome: "win" | "loss" | "skipped" | "open" | "breakeven" | "manual",
      trade: ActiveTrade | null
    ) => {
      const result = validateExecution(scenario, {
        ...plan,
        lots: plan.lots || metrics?.lots || 0,
      })
      const violations = [
        ...detectPlanningViolations(scenario, plan),
        ...(trade?.violations ?? []),
      ]
      const managementScore = scoreManagement(trade, tradeOutcome)

      setValidation(result)
      setOutcome(tradeOutcome)
      setPhase("complete")
      setSubmitted(true)
      replay.pause()

      recordExecutionAttempt({
        scenarioId: scenario.id,
        mode,
        direction: plan.direction,
        strategy: plan.strategy,
        entry: plan.entry,
        stop: plan.stop,
        target: plan.target,
        lots: plan.lots || metrics?.lots || 0,
        riskPercent: plan.riskPercent,
        accountSize: plan.accountSize,
        confidence: plan.confidence,
        executionScore: result.score,
        outcome:
          tradeOutcome === "win"
            ? "win"
            : tradeOutcome === "loss"
              ? "loss"
              : tradeOutcome === "skipped"
                ? "skipped"
                : "open",
        pips: metrics?.stopPips ?? 0,
        rr: metrics?.rr ?? 0,
      })

      void completeAttempt({
        direction: plan.direction,
        strategy: plan.strategy,
        entry: plan.entry,
        stop: plan.stop,
        target: plan.target,
        lots: plan.lots || metrics?.lots || 0,
        accountSize: plan.accountSize,
        riskPercent: plan.riskPercent,
        confidence: plan.confidence,
        hintsUsed: 0,
        revealUsed: false,
        ruleViolations: violations,
        managementScore,
        outcome: tradeOutcome,
      })
      if (trade) setActiveTrade(trade)
    },
    [scenario, plan, metrics, mode, recordExecutionAttempt, replay, completeAttempt]
  )

  const handlePlaceOrder = () => {
    markInteraction()
    if (plan.direction === "no-trade" || plan.direction === "wait") {
      const correctSkip =
        scenario.idealDirection === "no-trade" || scenario.idealDirection === "wait"
      finalizeTrade(correctSkip ? "skipped" : "loss", null)
      return
    }

    const trade: ActiveTrade = {
      direction: plan.direction,
      entry: plan.entry,
      stop: plan.stop,
      target: plan.target,
      lots: plan.lots || metrics?.lots || 0,
      entryIndex: replay.currentIndex,
      status: "open",
      closeIndex: null,
      closePrice: null,
      closeReason: null,
      movedToBreakeven: false,
      closedEarly: false,
      violations: detectPlanningViolations(scenario, plan),
    }

    setActiveTrade(trade)
    setPhase("managing")
    setSubmitted(true)
    replay.play()
  }

  const activeTradeRef = useRef(activeTrade)
  activeTradeRef.current = activeTrade

  useEffect(() => {
    if (phase !== "managing") return
    const trade = activeTradeRef.current
    if (!trade || trade.status === "closed") return

    const candle = allCandles[replay.currentIndex]
    if (!candle) return

    const exit = checkCandleExit(trade, candle, replay.currentIndex)
    if (exit.hit && exit.reason) {
      const closed: ActiveTrade = {
        ...trade,
        status: "closed",
        closeIndex: replay.currentIndex,
        closePrice: exit.price,
        closeReason: exit.reason,
      }
      finalizeTrade(exit.reason === "tp" ? "win" : "loss", closed)
      return
    }

    if (replay.atEnd) {
      const closed = closeTradeEarly(trade, candle, replay.currentIndex, scenario.pipSize)
      finalizeTrade("manual", closed)
    }
  }, [replay.currentIndex, replay.atEnd, phase, allCandles, finalizeTrade])

  const handleMoveToBE = () => {
    if (!activeTrade) return
    const updated = moveStopToBreakeven(activeTrade)
    setActiveTrade(updated)
    setPlan((p) => ({ ...p, stop: p.entry }))
  }

  const handleCloseEarly = () => {
    if (!activeTrade) return
    const candle = allCandles[replay.currentIndex]
    if (!candle) return
    const closed = closeTradeEarly(activeTrade, candle, replay.currentIndex, scenario.pipSize)
    finalizeTrade(floating.pnl >= 0 ? "manual" : "loss", closed)
  }

  const reset = () => {
    setPhase("planning")
    setSubmitted(false)
    setValidation(null)
    setOutcome(null)
    setActiveTrade(null)
    replay.reset()
    setPlan(createDefaultPlan(scenario))
    setDrawings([])
    setViewport(fitViewport(scenario.chart.candles.length))
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.code === "Space") {
        e.preventDefault()
        replay.isPlaying ? replay.pause() : replay.play()
      } else if (e.code === "ArrowRight") replay.next()
      else if (e.code === "ArrowLeft") replay.prev()
      else if (e.code === "KeyR") setViewport(fitViewport(allCandles.length))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [replay, allCandles.length])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{scenario.title}</h1>
            <Badge variant="secondary">{scenario.difficulty}</Badge>
            <Badge variant="outline">{mode}</Badge>
            {phase === "managing" && <Badge className="bg-primary/10 text-primary">Live</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{scenario.description}</p>
        </div>
        <Button variant="outline" size="sm" render={<Link href="/execution-lab" />}>
          All scenarios
        </Button>
      </div>

      {!atDecisionPoint && phase === "planning" && (
        <p className="text-sm text-primary">
          Replay to candle {scenario.pauseIndex + 1} to unlock the terminal.
        </p>
      )}

      <div className="flex flex-col gap-4 xl:flex-row">
        <div className="hidden shrink-0 xl:block">
          <ChartDrawingToolbar
            activeTool={activeTool}
            magnet={magnet}
            drawings={drawings}
            onToolChange={setActiveTool}
            onMagnetToggle={() => setMagnet((m) => !m)}
            onUndo={() => setDrawings((d) => d.slice(0, -1))}
            onClear={() => setDrawings([])}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <ChartDrawingToolbar
              compact
              className="xl:hidden"
              activeTool={activeTool}
              magnet={magnet}
              drawings={drawings}
              onToolChange={setActiveTool}
              onMagnetToggle={() => setMagnet((m) => !m)}
              onUndo={() => setDrawings((d) => d.slice(0, -1))}
              onClear={() => setDrawings([])}
            />
            <ChartViewportControls
              onFit={() => setViewport(fitViewport(allCandles.length))}
              onReset={() => setViewport(fitViewport(allCandles.length))}
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-border/60">
            <ExecutionChart
              candles={visibleCandles}
              allCandles={allCandles}
              levels={{ entry: plan.entry, stop: plan.stop, target: plan.target }}
              direction={plan.direction}
              onLevelsChange={(levels) =>
                handleChange({ entry: levels.entry, stop: levels.stop, target: levels.target })
              }
              locked={phase !== "planning" || !atDecisionPoint}
              showLevels={
                (plan.direction === "buy" || plan.direction === "sell") && atDecisionPoint
              }
              height={440}
              viewport={viewport}
              onViewportChange={setViewport}
              drawings={drawings}
              onDrawingsChange={setDrawings}
              activeTool={activeTool}
              magnet={magnet}
            />
          </div>

          <ChartReplayControls
            isPlaying={replay.isPlaying}
            speed={replay.speed}
            currentIndex={replay.currentIndex}
            maxIndex={scenario.replayEndIndex}
            minIndex={8}
            onPlay={replay.play}
            onPause={replay.pause}
            onNext={replay.next}
            onPrev={replay.prev}
            onReset={replay.reset}
            onSpeedChange={replay.setSpeed}
          />

          <TradeStatusPanel
            trade={activeTrade}
            floatingPips={floating.pips}
            floatingPnL={floating.pnl}
            currentRR={floating.rr}
            distToSlPips={floating.distToSlPips}
            distToTpPips={floating.distToTpPips}
            phase={phase}
            onMoveToBreakeven={handleMoveToBE}
            onCloseEarly={handleCloseEarly}
          />
        </div>

        <div className={cn("w-full shrink-0 xl:w-[340px]", !ticketOpen && "hidden xl:block")}>
          <ExecutionTicket
            scenario={scenario}
            plan={{ ...plan, lots: plan.lots || metrics?.lots || 0 }}
            onChange={handleChange}
            onSubmit={handlePlaceOrder}
            submitted={submitted}
            disabled={!atDecisionPoint && phase === "planning"}
            phase={phase}
            floatingPnL={floating.pnl}
          />
        </div>
      </div>

      <button
        type="button"
        className="rounded-lg border border-border/60 py-2 text-sm text-muted-foreground xl:hidden"
        onClick={() => setTicketOpen((o) => !o)}
      >
        {ticketOpen ? "Hide Ticket" : "Show Trading Ticket"}
      </button>

      {phase === "complete" && validation && (
        <>
          {tradeReview && <TradeReviewPanel report={tradeReview} />}
          <div className="rounded-xl border border-border/60 bg-card/50 p-5">
            <div className="flex items-center justify-between">
              <p className="font-medium">
                Execution Score:{" "}
                <span className={cn(validation.passed ? "text-primary" : "text-destructive")}>
                  {validation.score}/100
                </span>
              </p>
              {outcome && <Badge variant={outcome === "win" ? "default" : "secondary"}>{outcome}</Badge>}
            </div>
            <ul className="mt-3 flex flex-col gap-2">
              {validation.feedback.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  {f.ok ? (
                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                  ) : (
                    <XCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
                  )}
                  <span className="text-muted-foreground">{f.message}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={reset}>
                <RotateCcwIcon data-icon="inline-start" />
                Try again
              </Button>
              {onNext && (
                <Button size="sm" onClick={onNext}>
                  Next chart
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
