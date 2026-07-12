"use client"

import Link from "next/link"
import { useCallback, useMemo, useState } from "react"

import { ChartReplayControls } from "@/components/simulator/chart-replay-controls"
import { useChartReplay } from "@/components/simulator/use-chart-replay"
import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useExecutionAttemptTracking } from "@/lib/execution-analytics/use-execution-attempt"
import { detectFillOutcome } from "@/lib/execution-lab/fills"
import {
  BEHAVIOUR_OPTIONS,
  buildGuidedSteps,
  buildRecommendations,
  EVIDENCE_OPTIONS,
  getMentorMessage,
  MARKET_OPTIONS,
  TIMEFRAME_OPTIONS,
  TREND_OPTIONS,
  validateGuidedStep,
} from "@/lib/execution-lab/guided"
import type {
  BehaviourAnswer,
  EvidenceTag,
  GuidedSessionState,
  GuidedStepId,
  TrendAnswer,
} from "@/lib/execution-lab/guided/types"
import { computeTradeMetrics } from "@/lib/execution-lab/sizing"
import { createDefaultPlan } from "@/lib/execution-lab/default-plan"
import { generateTradeReview } from "@/lib/execution-lab/trade-review"
import { validateExecution } from "@/lib/execution-lab/scoring"
import { sliceVisibleCandles } from "@/lib/simulator/replay"
import type {
  ExecutionMode,
  ExecutionScenario,
  ExecutionTradePlan,
  StrategyChoice,
} from "@/lib/execution-lab/types"
import type { ChartPoint } from "@/lib/charts/types"
import { cn } from "@/lib/utils"

import { ExecutionChart, type ChartMarker } from "./execution-chart"
import { ExecutionTicket } from "./execution-ticket"
import { GuidedCompletion } from "./guided-completion"
import { GuidedStepPanel } from "./guided-step-panel"
import { MentorPanel } from "./mentor-panel"
import { TradeReviewPanel } from "./trade-review-panel"

const STRATEGY_LABELS: Record<StrategyChoice, string> = {
  continuation: "Continuation",
  reversal: "Reversal",
  "break-retest": "Break & Retest",
  "liquidity-sweep": "Liquidity Sweep",
  range: "Range",
  "no-trade": "No Trade",
}

function createSession(): GuidedSessionState {
  const now = Date.now()
  return {
    stepIndex: 0,
    completedSteps: [],
    stepMetrics: {},
    sessionStartedAt: now,
    stepStartedAt: now,
    marketAnswer: null,
    timeframeAnswer: null,
    trendAnswer: null,
    behaviourAnswer: null,
    evidenceAnswers: [],
    strategyAnswer: null,
    markedSwingHighs: [],
    markedSwingLows: [],
    markedZones: [],
    hintLevel: 0,
    revealed: false,
  }
}

function bumpMetric(
  session: GuidedSessionState,
  stepId: GuidedStepId,
  patch: Partial<{ hintsUsed: number; revealUsed: boolean; attempts: number }>
): GuidedSessionState {
  const prev = session.stepMetrics[stepId] ?? {
    hintsUsed: 0,
    revealUsed: false,
    attempts: 0,
    timeMs: 0,
  }
  return {
    ...session,
    stepMetrics: {
      ...session.stepMetrics,
      [stepId]: {
        ...prev,
        ...patch,
        timeMs: prev.timeMs + (Date.now() - session.stepStartedAt),
      },
    },
  }
}

interface GuidedWorkspaceProps {
  scenario: ExecutionScenario
  mode?: ExecutionMode
  onNext?: () => void
}

export function GuidedWorkspace({
  scenario,
  mode = "guided",
  onNext,
}: GuidedWorkspaceProps) {
  const { recordExecutionAttempt } = useUserState()
  const { markInteraction, completeAttempt } = useExecutionAttemptTracking({
    scenarioId: scenario.id,
    mode,
  })
  const steps = useMemo(() => buildGuidedSteps(scenario), [scenario])
  const [session, setSession] = useState(createSession)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [feedbackOk, setFeedbackOk] = useState<boolean | null>(null)
  const [canContinue, setCanContinue] = useState(false)
  const [mentorLine, setMentorLine] = useState(
    "Welcome to Academy Mode. We'll walk through this chart like a professional desk."
  )

  const [submitted, setSubmitted] = useState(false)
  const [validation, setValidation] = useState<ReturnType<typeof validateExecution> | null>(
    null
  )
  const [outcome, setOutcome] = useState<"win" | "loss" | "skipped" | "open" | null>(null)

  const initialDirection =
    scenario.idealDirection === "no-trade" || scenario.idealDirection === "wait"
      ? scenario.idealDirection
      : scenario.idealDirection

  const [plan, setPlan] = useState<ExecutionTradePlan>(() => createDefaultPlan(scenario))

  const replay = useChartReplay({
    minIndex: 8,
    maxIndex: scenario.replayEndIndex,
    initialIndex: scenario.pauseIndex,
  })

  const currentStep = steps[session.stepIndex]
  const currentStepId = currentStep?.id ?? "outcome"
  const visibleCandles = sliceVisibleCandles(scenario.chart.candles, replay.currentIndex)
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
    })
  }, [plan, scenario])

  const tradeReview = useMemo(() => {
    if (!validation || !submitted) return null
    return generateTradeReview(scenario, plan, validation, outcome)
  }, [validation, submitted, scenario, plan, outcome])

  const markers: ChartMarker[] = useMemo(() => {
    const out: ChartMarker[] = []
    for (const p of session.markedSwingHighs) {
      out.push({ ...p, kind: "swing-high" })
    }
    for (const p of session.markedSwingLows) {
      out.push({ ...p, kind: "swing-low" })
    }
    for (const p of session.markedZones) {
      out.push({ ...p, kind: "zone" })
    }
    return out
  }, [session.markedSwingHighs, session.markedSwingLows, session.markedZones])

  const clickMode =
    currentStepId === "swing-highs"
      ? "swing-high"
      : currentStepId === "swing-lows"
        ? "swing-low"
        : currentStepId === "zones"
          ? "zone"
          : null

  const resetStepUi = useCallback(() => {
    setFeedback(null)
    setFeedbackOk(null)
    setCanContinue(false)
    setSession((s) => ({ ...s, hintLevel: 0, revealed: false, stepStartedAt: Date.now() }))
  }, [])

  const advanceStep = useCallback(() => {
    markInteraction()
    setSession((s) => {
      const completed = s.completedSteps.includes(currentStepId)
        ? s.completedSteps
        : [...s.completedSteps, currentStepId]
      return {
        ...s,
        stepIndex: Math.min(s.stepIndex + 1, steps.length - 1),
        completedSteps: completed,
        hintLevel: 0,
        revealed: false,
        stepStartedAt: Date.now(),
      }
    })
    setFeedback(null)
    setFeedbackOk(null)
    setCanContinue(false)
  }, [currentStepId, steps.length, markInteraction])

  const checkAnswer = useCallback(
    (stepId: GuidedStepId = currentStepId) => {
      markInteraction()
      const result = validateGuidedStep(stepId, scenario, {
        marketAnswer: session.marketAnswer,
        timeframeAnswer: session.timeframeAnswer,
        trendAnswer: session.trendAnswer,
        behaviourAnswer: session.behaviourAnswer,
        evidenceAnswers: session.evidenceAnswers,
        strategyAnswer: session.strategyAnswer,
        markedSwingHighs: session.markedSwingHighs,
        markedSwingLows: session.markedSwingLows,
        markedZones: session.markedZones,
      })
      setFeedback(result.feedback)
      setFeedbackOk(result.correct)
      setMentorLine(
        getMentorMessage(scenario, stepId, session, { correct: result.correct })
      )
      setSession((s) =>
        bumpMetric(s, stepId, { attempts: (s.stepMetrics[stepId]?.attempts ?? 0) + 1 })
      )
      if (result.correct || session.revealed) {
        setCanContinue(true)
      }
      return result.correct
    },
    [currentStepId, scenario, session, markInteraction]
  )

  const handleHint = () => {
    markInteraction()
    setSession((s) => {
      const next = bumpMetric(s, currentStepId, {
        hintsUsed: (s.stepMetrics[currentStepId]?.hintsUsed ?? 0) + 1,
      })
      return { ...next, hintLevel: Math.min(next.hintLevel + 1, currentStep.hints.length) }
    })
    setMentorLine("Use the hint to guide your thinking — don't rush to execution.")
  }

  const handleReveal = () => {
    markInteraction()
    setSession((s) =>
      bumpMetric(s, currentStepId, {
        revealUsed: true,
        hintsUsed: (s.stepMetrics[currentStepId]?.hintsUsed ?? 0) + 1,
      })
    )
    setSession((s) => ({ ...s, revealed: true }))
    setCanContinue(true)
    setMentorLine("Answer revealed. Study why this is correct before continuing.")
  }

  const handleChartClick = (point: ChartPoint) => {
    markInteraction()
    if (currentStepId === "swing-highs") {
      setSession((s) => ({
        ...s,
        markedSwingHighs: [...s.markedSwingHighs, point],
      }))
      setTimeout(() => checkAnswer("swing-highs"), 0)
    } else if (currentStepId === "swing-lows") {
      setSession((s) => ({
        ...s,
        markedSwingLows: [...s.markedSwingLows, point],
      }))
      setTimeout(() => checkAnswer("swing-lows"), 0)
    } else if (currentStepId === "zones") {
      setSession((s) => ({
        ...s,
        markedZones: [...s.markedZones, point],
      }))
      setTimeout(() => checkAnswer("zones"), 0)
    }
  }

  const pickMarket = (symbol: string) => {
    setSession((s) => ({ ...s, marketAnswer: symbol }))
    setTimeout(() => {
      const ok = symbol === scenario.symbol
      setFeedback(ok ? `Correct — ${scenario.symbol}.` : "Not quite. Check the symbol.")
      setFeedbackOk(ok)
      setCanContinue(ok)
      setMentorLine(getMentorMessage(scenario, "market", session, { correct: ok }))
    }, 0)
  }

  const pickTimeframe = (tf: string) => {
    setSession((s) => ({ ...s, timeframeAnswer: tf }))
    const ok = tf === scenario.timeframe
    setFeedback(ok ? `Correct — ${scenario.timeframe}.` : "Reconsider the timeframe.")
    setFeedbackOk(ok)
    setCanContinue(ok)
    setMentorLine(getMentorMessage(scenario, "timeframe", session, { correct: ok }))
  }

  const pickTrend = (trend: TrendAnswer) => {
    setSession((s) => ({ ...s, trendAnswer: trend }))
    setTimeout(() => checkAnswer("trend"), 0)
  }

  const pickBehaviour = (behaviour: BehaviourAnswer) => {
    setSession((s) => ({ ...s, behaviourAnswer: behaviour }))
    setTimeout(() => checkAnswer("behaviour"), 0)
  }

  const toggleEvidence = (tag: EvidenceTag) => {
    setSession((s) => {
      const has = s.evidenceAnswers.includes(tag)
      const evidenceAnswers = has
        ? s.evidenceAnswers.filter((t) => t !== tag)
        : [...s.evidenceAnswers, tag]
      return { ...s, evidenceAnswers }
    })
    setTimeout(() => checkAnswer("evidence"), 0)
  }

  const pickStrategy = (strategy: StrategyChoice) => {
    setSession((s) => ({ ...s, strategyAnswer: strategy }))
    setPlan((p) => ({ ...p, strategy }))
    setTimeout(() => checkAnswer("strategy"), 0)
  }

  const handleChange = useCallback(
    (patch: Partial<ExecutionTradePlan>) => {
      setPlan((p) => {
        const next = { ...p, ...patch }
        if (patch.direction === "buy" || patch.direction === "sell") {
          const m = computeTradeMetrics({
            direction: patch.direction,
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
    [scenario]
  )

  const handleSubmit = () => {
    const result = validateExecution(scenario, {
      ...plan,
      lots: plan.lots || metrics?.lots || 0,
    })
    setValidation(result)
    setSubmitted(true)

    let tradeOutcome: "win" | "loss" | "skipped" | "open" = "skipped"
    if (plan.direction === "buy" || plan.direction === "sell") {
      const fill = detectFillOutcome({
        direction: plan.direction,
        entry: plan.entry,
        stop: plan.stop,
        target: plan.target,
        candles: scenario.chart.candles,
        fromIndex: replay.currentIndex,
      })
      tradeOutcome = fill.outcome
      setOutcome(tradeOutcome)
    } else {
      setOutcome("skipped")
    }

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
      outcome: tradeOutcome,
      pips: metrics?.stopPips ?? 0,
      rr: metrics?.rr ?? 0,
    })

    const hintsUsed = Object.values(session.stepMetrics).reduce(
      (s, m) => s + (m?.hintsUsed ?? 0),
      0
    )
    const revealUsed = Object.values(session.stepMetrics).some((m) => m?.revealUsed)

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
      hintsUsed,
      revealUsed,
      outcome: tradeOutcome,
    })

    setSession((s) => ({
      ...s,
      stepIndex: steps.length - 1,
      completedSteps: [
        ...new Set<GuidedStepId>([...s.completedSteps, "execution", "outcome"]),
      ],
    }))
    setMentorLine("Session complete. Review your execution report honestly.")
  }

  const weakSteps = useMemo(() => {
    return steps
      .filter((st) => {
        const m = session.stepMetrics[st.id]
        return m && (m.revealUsed || m.attempts > 2)
      })
      .map((st) => st.id)
  }, [steps, session.stepMetrics])

  const completionSummary = useMemo(() => {
    const hintsUsed = Object.values(session.stepMetrics).reduce(
      (s, m) => s + (m?.hintsUsed ?? 0),
      0
    )
    const revealUsed = Object.values(session.stepMetrics).some((m) => m?.revealUsed)
    const durationMinutes = Math.max(
      1,
      Math.round((Date.now() - session.sessionStartedAt) / 60_000)
    )
    const greatDecisions = validation?.feedback.filter((f) => f.ok).map((f) => f.message) ?? []
    const mistakes = validation?.feedback.filter((f) => !f.ok).map((f) => f.message) ?? []
    return {
      executionScore: validation?.score ?? 0,
      hintsUsed,
      revealUsed,
      durationMinutes,
      greatDecisions: greatDecisions.slice(0, 4),
      mistakes: mistakes.slice(0, 4),
      recommendations: buildRecommendations(scenario, weakSteps),
    }
  }, [session, validation, scenario, weakSteps])

  const resetAll = () => {
    setSession(createSession())
    setSubmitted(false)
    setValidation(null)
    setOutcome(null)
    resetStepUi()
    replay.reset()
    setPlan(createDefaultPlan(scenario))
    setMentorLine("Let's run through this chart again — process over outcome.")
  }

  const showTicket = currentStepId === "execution" || submitted
  const showCompletion = submitted && validation && currentStepId === "outcome"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{scenario.title}</h1>
            <Badge variant="secondary">{scenario.difficulty}</Badge>
            <Badge className="border-primary/40 bg-primary/10 text-primary">Academy</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{scenario.description}</p>
        </div>
        <Button variant="outline" size="sm" render={<Link href="/execution-lab" />}>
          All scenarios
        </Button>
      </div>

      <MentorPanel message={mentorLine} />

      {/* Mobile step progress — sidebar hidden below xl */}
      <div className="rounded-xl border border-border/60 bg-card/50 px-4 py-3 xl:hidden">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Step {session.stepIndex + 1} / {steps.length} · {currentStep.title}
          </span>
          <span>{Math.round(((session.stepIndex + (canContinue ? 1 : 0)) / steps.length) * 100)}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-200"
            style={{
              width: `${Math.round(((session.stepIndex + (canContinue ? 1 : 0)) / steps.length) * 100)}%`,
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[300px_1fr_320px]">
        <div className="order-3 xl:order-1">
        <GuidedStepPanel
          steps={steps}
          stepIndex={session.stepIndex}
          currentStep={currentStep}
          hintLevel={session.hintLevel}
          revealed={session.revealed}
          feedback={feedback}
          feedbackOk={feedbackOk}
          onHint={handleHint}
          onReveal={handleReveal}
          onContinue={advanceStep}
          canContinue={canContinue}
        />
        </div>

        <div className="order-1 flex min-w-0 flex-col gap-3 xl:order-2">
          <div className="overflow-hidden rounded-xl border border-border/60">
            <ExecutionChart
              candles={visibleCandles}
              levels={{
                entry: plan.entry,
                stop: plan.stop,
                target: plan.target,
              }}
              direction={plan.direction}
              onLevelsChange={(levels) =>
                handleChange({
                  entry: levels.entry,
                  stop: levels.stop,
                  target: levels.target,
                })
              }
              locked={submitted || currentStepId !== "execution"}
              showLevels={currentStepId === "execution" || submitted}
              height={460}
              clickMode={clickMode}
              onChartClick={handleChartClick}
              markers={markers}
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

          {currentStepId === "market" && (
            <ChoiceGrid
              options={MARKET_OPTIONS.map((s) => ({ id: s, label: s }))}
              selected={session.marketAnswer}
              onPick={pickMarket}
            />
          )}
          {currentStepId === "timeframe" && (
            <ChoiceGrid
              options={TIMEFRAME_OPTIONS.map((s) => ({ id: s, label: s }))}
              selected={session.timeframeAnswer}
              onPick={pickTimeframe}
            />
          )}
          {currentStepId === "trend" && (
            <ChoiceGrid
              options={TREND_OPTIONS.map((t) => ({ id: t.id, label: t.label }))}
              selected={session.trendAnswer}
              onPick={(id) => pickTrend(id as TrendAnswer)}
            />
          )}
          {currentStepId === "swing-highs" && (
            <p className="text-center text-sm text-muted-foreground">
              Click swing high candles on the chart ({session.markedSwingHighs.length}{" "}
              marked)
            </p>
          )}
          {currentStepId === "swing-lows" && (
            <p className="text-center text-sm text-muted-foreground">
              Click swing low candles on the chart ({session.markedSwingLows.length}{" "}
              marked)
            </p>
          )}
          {currentStepId === "behaviour" && (
            <ChoiceGrid
              options={BEHAVIOUR_OPTIONS.map((t) => ({ id: t.id, label: t.label }))}
              selected={session.behaviourAnswer}
              onPick={(id) => pickBehaviour(id as BehaviourAnswer)}
            />
          )}
          {currentStepId === "evidence" && (
            <MultiSelectGrid
              options={EVIDENCE_OPTIONS.map((t) => ({ id: t.id, label: t.label }))}
              selected={session.evidenceAnswers}
              onToggle={toggleEvidence}
            />
          )}
          {currentStepId === "zones" && (
            <p className="text-center text-sm text-muted-foreground">
              Click the chart to mark support, resistance, or the key level (
              {session.markedZones.length} marked)
            </p>
          )}
          {currentStepId === "strategy" && (
            <ChoiceGrid
              options={scenario.strategyOptions.map((s) => ({
                id: s,
                label: STRATEGY_LABELS[s],
              }))}
              selected={session.strategyAnswer}
              onPick={(id) => pickStrategy(id as StrategyChoice)}
            />
          )}
          {currentStepId === "execution" && !atDecisionPoint && (
            <p className="text-sm text-primary">
              Replay to candle {scenario.pauseIndex + 1} to unlock execution.
            </p>
          )}
        </div>

        <div className="order-2 xl:order-3">
        {showTicket ? (
          <ExecutionTicket
            scenario={scenario}
            plan={{ ...plan, lots: plan.lots || metrics?.lots || 0 }}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitted={submitted}
            disabled={!atDecisionPoint || currentStepId !== "execution"}
          />
        ) : (
          <div className="rounded-xl border border-border/60 bg-card/40 p-5">
            <p className="text-sm font-medium">Up next</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete each coaching step. Execution unlocks after strategy selection.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
              {steps.slice(session.stepIndex, session.stepIndex + 4).map((s) => (
                <li key={s.id} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      session.completedSteps.includes(s.id)
                        ? "bg-primary"
                        : "bg-muted-foreground/40"
                    )}
                  />
                  {s.title}
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
      </div>

      {showCompletion && (
        <>
          {tradeReview && <TradeReviewPanel report={tradeReview} />}
          <GuidedCompletion
            scenarioTitle={scenario.title}
            validation={validation}
            outcome={outcome}
            summary={completionSummary}
            onRetry={resetAll}
            onNext={onNext}
          />
        </>
      )}
    </div>
  )
}

function MultiSelectGrid<T extends string>({
  options,
  selected,
  onToggle,
}: {
  options: { id: T; label: string }[]
  selected: T[]
  onToggle: (id: T) => void
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {options.map((o) => {
        const active = selected.includes(o.id)
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onToggle(o.id)}
            className={cn(
              "app-press rounded-lg border px-3 py-2 text-sm transition-colors duration-150",
              active
                ? "border-primary bg-primary/10 text-primary"
                : "border-border/60 text-muted-foreground hover:border-primary/40"
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

function ChoiceGrid<T extends string>({
  options,
  selected,
  onPick,
}: {
  options: { id: T; label: string }[]
  selected: string | null
  onPick: (id: T) => void
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onPick(o.id)}
          className={cn(
            "app-press rounded-lg border px-4 py-2 text-sm transition-colors duration-150",
            selected === o.id
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/60 text-muted-foreground hover:border-primary/40"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
