"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowLeftIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react"

import { ChartToolbar } from "@/components/chart-lab/chart-toolbar"
import { AppShell } from "@/components/layout/app-shell"
import { ClassificationButtons } from "@/components/trend-spotter/classification-buttons"
import { ChartReplayControls } from "@/components/simulator/chart-replay-controls"
import { SimulatorChartPanel } from "@/components/simulator/simulator-chart-panel"
import { SimulatorJournalForm } from "@/components/simulator/simulator-journal-form"
import { useChartReplay } from "@/components/simulator/use-chart-replay"
import { useUserState } from "@/components/providers/user-state-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSimulatorStage } from "@/content/simulator/stages"
import { pickScenarioForStage } from "@/content/simulator/scenarios"
import { XP_REWARDS } from "@/lib/progression/levels"
import { sliceVisibleCandles } from "@/lib/simulator/replay"
import {
  computeRiskReward,
  scoreManagementDecisions,
  scoreMarkers,
  scoreTradePlan,
  scoreTradeSelection,
  scoreTrendAnswer,
} from "@/lib/simulator/scoring"
import type {
  SimulatorStageId,
  TradeManagementDecision,
} from "@/lib/simulator/types"
import type { MarkerTool, UserMarker } from "@/lib/charts/types"
import type { TrendClassification } from "@/lib/trend-spotter/types"
import { ChartCanvas } from "@/components/chart-lab/chart-canvas"
import { cn } from "@/lib/utils"

type WorkspaceStep = "exercise" | "journal" | "feedback"

interface SimulatorStageWorkspaceProps {
  stageId: SimulatorStageId
}

export function SimulatorStageWorkspace({ stageId }: SimulatorStageWorkspaceProps) {
  const { state, recordSimulatorSession, addJournalEntry } = useUserState()
  const stage = getSimulatorStage(stageId)
  const scenario = useMemo(
    () =>
      pickScenarioForStage(
        stageId,
        state.simulator.attempts.map((a) => a.scenarioId)
      ),
    [stageId, state.simulator.attempts]
  )

  const minIdx = scenario?.replayStartIndex ?? 0
  const maxIdx =
    scenario?.replayEndIndex ?? (scenario?.chart.candles.length ?? 1) - 1

  const mgmtReplay = useChartReplay({
    minIndex: minIdx,
    maxIndex: Math.max(minIdx, maxIdx),
    initialIndex: minIdx,
  })

  const [step, setStep] = useState<WorkspaceStep>("exercise")
  const [trendAnswer, setTrendAnswer] = useState<TrendClassification | null>(null)
  const [markers, setMarkers] = useState<UserMarker[]>([])
  const [activeTool, setActiveTool] = useState<MarkerTool>("pointer")
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [entry, setEntry] = useState("")
  const [stop, setStop] = useState("")
  const [target, setTarget] = useState("")
  const [mgmtDecisions, setMgmtDecisions] = useState<
    { index: number; decision: TradeManagementDecision; correct: boolean }[]
  >([])
  const [thesis, setThesis] = useState("")
  const [observation, setObservation] = useState("")
  const [improvement, setImprovement] = useState("")
  const [result, setResult] = useState<{
    score: number
    passed: boolean
    xp: number
  } | null>(null)

  if (!stage || !scenario) {
    return (
      <AppShell>
        <p className="text-muted-foreground">Stage not found.</p>
      </AppShell>
    )
  }

  const decisionPoints = scenario.decisionPoints ?? []
  const currentDecision = decisionPoints.find(
    (d) => d.candleIndex === mgmtReplay.currentIndex
  )

  const handlePlacePoint = (point: { index: number; price: number }) => {
    if (activeTool === "pointer") return
    setMarkers((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        tool: activeTool,
        index: point.index,
        price: point.price,
      },
    ])
  }

  const evaluateExercise = (): { score: number; passed: boolean } => {
    switch (stageId) {
      case "chart-reading":
        return scoreTrendAnswer(
          trendAnswer ?? "messy",
          scenario.correctTrend ?? "uptrend"
        )
      case "support-resistance":
        return scoreMarkers(scenario, markers)
      case "trade-selection":
        return scoreTradeSelection(
          selectedOption ?? -1,
          scenario.bestOptionIndex ?? 0
        )
      case "trade-planning": {
        const e = parseFloat(entry)
        const s = parseFloat(stop)
        const t = parseFloat(target)
        const rr = computeRiskReward(e, s, t)
        return scoreTradePlan(
          { entry: e, stop: s, target: t, riskReward: rr },
          scenario.idealEntry
            ? {
                entry: scenario.idealEntry,
                stop: scenario.idealStop!,
                target: scenario.idealTarget!,
              }
            : undefined
        )
      }
      case "trade-management":
        return scoreManagementDecisions(mgmtDecisions)
      default:
        return { score: 0, passed: false }
    }
  }

  const canSubmitExercise = () => {
    switch (stageId) {
      case "chart-reading":
        return trendAnswer !== null
      case "support-resistance":
        return markers.length >= 2
      case "trade-selection":
        return selectedOption !== null
      case "trade-planning":
        return entry && stop && target
      case "trade-management":
        return mgmtDecisions.length >= (decisionPoints.length || 1)
      default:
        return false
    }
  }

  const handleExerciseSubmit = () => {
    const { score, passed } = evaluateExercise()
    setResult({
      score,
      passed,
      xp: passed
        ? stage.xpReward
        : Math.max(5, Math.round(score / 10)),
    })
    setStep("journal")
  }

  const handleMgmtDecision = (decision: TradeManagementDecision) => {
    if (!currentDecision) return
    const correct = decision === currentDecision.correctDecision
    setMgmtDecisions((prev) => [
      ...prev,
      { index: currentDecision.candleIndex, decision, correct },
    ])
    if (mgmtReplay.currentIndex < maxIdx) {
      mgmtReplay.next()
    }
  }

  const handleFinalSubmit = () => {
    if (!result) return
    const plan =
      stageId === "trade-planning"
        ? {
            entry: parseFloat(entry),
            stop: parseFloat(stop),
            target: parseFloat(target),
            riskReward: computeRiskReward(
              parseFloat(entry),
              parseFloat(stop),
              parseFloat(target)
            ),
          }
        : undefined

    recordSimulatorSession({
      scenarioId: scenario.id,
      stageId,
      score: result.score,
      passed: result.passed,
      xpEarned: result.xp + (thesis.length >= 10 ? XP_REWARDS.journalReflection : 0),
      trendAnswer: trendAnswer ?? undefined,
      markers: markers.length ? markers : undefined,
      selectedOption: selectedOption ?? undefined,
      plan,
      managementDecisions:
        mgmtDecisions.length > 0 ? mgmtDecisions : undefined,
      thesis,
      observation,
      improvement,
      outcome: result.passed ? "win" : "loss",
    })

    if (thesis.length >= 10) {
      addJournalEntry({
        setupPracticed: `${stage.title} — ${scenario.title}`,
        marksSummary: observation || "Simulator session",
        aiFeedbackSummary: result.passed
          ? `Passed with ${result.score}% — ${thesis}`
          : `Review needed (${result.score}%) — focus on ${stage.title}`,
        confidenceRating: result.passed ? 4 : 2,
        mistakeTag: result.passed ? "" : stageId,
        personalNote: `${thesis}\n\nImprove: ${improvement}`,
        source: "simulator",
        drillType: stageId,
      })
    }

    setStep("feedback")
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" render={<Link href="/simulator" />}>
            <ArrowLeftIcon className="size-4" />
            Simulator
          </Button>
          <Badge>Stage {stage.order}</Badge>
          <h1 className="text-xl font-semibold">{stage.title}</h1>
        </div>

        {step === "exercise" && (
          <>
            <p className="text-muted-foreground">{scenario.title}</p>

            {stageId === "chart-reading" && (
              <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                <SimulatorChartPanel
                  scenario={scenario.chart}
                  symbol={scenario.symbol}
                  timeframe={scenario.timeframe}
                  replayMinIndex={0}
                  replayMaxIndex={maxIdx}
                />
                <div className="space-y-3">
                  <p className="text-sm font-medium">What is the trend?</p>
                  <ClassificationButtons
                    value={trendAnswer}
                    onChange={setTrendAnswer}
                  />
                  <Button
                    className="w-full"
                    onClick={handleExerciseSubmit}
                    disabled={!canSubmitExercise()}
                  >
                    Submit answer
                  </Button>
                </div>
              </div>
            )}

            {stageId === "support-resistance" && (
              <div className="grid gap-4">
                <ChartToolbar
                  tools={scenario.chart.tools ?? ["support", "resistance", "break", "retest"]}
                  activeTool={activeTool}
                  onSelect={setActiveTool}
                />
                <SimulatorChartPanel
                  scenario={scenario.chart}
                  symbol={scenario.symbol}
                  timeframe={scenario.timeframe}
                  replayMinIndex={minIdx}
                  replayMaxIndex={maxIdx}
                  interactive
                  activeTool={activeTool}
                  userMarkers={markers}
                  onPlacePoint={handlePlacePoint}
                />
                <Button onClick={handleExerciseSubmit} disabled={!canSubmitExercise()}>
                  Grade my marks
                </Button>
              </div>
            )}

            {stageId === "trade-selection" && scenario.options && (
              <div className="space-y-4">
                <p className="text-sm font-medium">Which trade would you take?</p>
                <div className="grid gap-4 md:grid-cols-3">
                  {scenario.options.map((opt, i) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedOption(i)}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-colors",
                        selectedOption === i
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                          : "border-border/60 hover:border-primary/30"
                      )}
                    >
                      <p className="mb-2 text-sm font-medium">
                        {String.fromCharCode(65 + i)} — {opt.title}
                      </p>
                      <ChartCanvas
                        candles={opt.candles.slice(-24)}
                        height={160}
                        interactive={false}
                      />
                    </button>
                  ))}
                </div>
                <Button onClick={handleExerciseSubmit} disabled={!canSubmitExercise()}>
                  Lock in selection
                </Button>
              </div>
            )}

            {stageId === "trade-planning" && (
              <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                <SimulatorChartPanel
                  scenario={scenario.chart}
                  symbol={scenario.symbol}
                  timeframe={scenario.timeframe}
                  replayMinIndex={minIdx}
                  replayMaxIndex={maxIdx}
                />
                <div className="space-y-3">
                  <p className="text-sm font-medium">Define your plan before entry</p>
                  <div className="space-y-2">
                    <Label htmlFor="entry">Entry</Label>
                    <Input id="entry" value={entry} onChange={(e) => setEntry(e.target.value)} type="number" step="any" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stop">Stop loss</Label>
                    <Input id="stop" value={stop} onChange={(e) => setStop(e.target.value)} type="number" step="any" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target">Target</Label>
                    <Input id="target" value={target} onChange={(e) => setTarget(e.target.value)} type="number" step="any" />
                  </div>
                  {entry && stop && target && (
                    <p className="text-sm text-muted-foreground">
                      R:R {computeRiskReward(parseFloat(entry), parseFloat(stop), parseFloat(target))}:1
                    </p>
                  )}
                  <Button className="w-full" onClick={handleExerciseSubmit} disabled={!canSubmitExercise()}>
                    Submit plan
                  </Button>
                </div>
              </div>
            )}

            {stageId === "trade-management" && (
              <div className="space-y-4">
                <ChartReplayControls
                  isPlaying={mgmtReplay.isPlaying}
                  speed={mgmtReplay.speed}
                  currentIndex={mgmtReplay.currentIndex}
                  maxIndex={maxIdx}
                  minIndex={minIdx}
                  onPlay={mgmtReplay.play}
                  onPause={mgmtReplay.pause}
                  onNext={mgmtReplay.next}
                  onPrev={mgmtReplay.prev}
                  onReset={mgmtReplay.reset}
                  onSpeedChange={mgmtReplay.setSpeed}
                />
                <div className="overflow-hidden rounded-xl border border-border/60">
                  <ChartCanvas
                    candles={sliceVisibleCandles(
                      scenario.chart.candles,
                      mgmtReplay.currentIndex
                    )}
                    height={380}
                  />
                </div>

                {currentDecision &&
                  !mgmtDecisions.some((d) => d.index === currentDecision.candleIndex) && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                      <p className="text-sm font-medium">Decision point</p>
                      <p className="text-sm text-muted-foreground">
                        {currentDecision.context}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(["hold", "close", "move-stop"] as TradeManagementDecision[]).map(
                          (d) => (
                            <Button
                              key={d}
                              variant="outline"
                              onClick={() => handleMgmtDecision(d)}
                            >
                              {d === "move-stop" ? "Move stop" : d.charAt(0).toUpperCase() + d.slice(1)}
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  )}

                <p className="text-xs text-muted-foreground">
                  Advance candles until each decision point appears. You cannot see future price.
                </p>
                <Button onClick={handleExerciseSubmit} disabled={!canSubmitExercise()}>
                  Complete management review
                </Button>
              </div>
            )}
          </>
        )}

        {step === "journal" && result && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-card/50 p-6">
              <div className="flex items-center gap-2">
                {result.passed ? (
                  <CheckCircle2Icon className="size-5 text-emerald-600" />
                ) : (
                  <XCircleIcon className="size-5 text-amber-600" />
                )}
                <p className="font-semibold">
                  {result.passed ? "Passed" : "Needs work"} — {result.score}%
                </p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                +{result.xp} XP earned. Journal this trade to build execution discipline.
              </p>
            </div>
            <SimulatorJournalForm
              thesis={thesis}
              observation={observation}
              improvement={improvement}
              onThesisChange={setThesis}
              onObservationChange={setObservation}
              onImprovementChange={setImprovement}
              onSubmit={handleFinalSubmit}
            />
          </div>
        )}

        {step === "feedback" && result && (
          <div className="rounded-xl border border-border/60 bg-card/50 p-8 text-center space-y-4">
            <CheckCircle2Icon className="mx-auto size-10 text-emerald-600" />
            <h2 className="text-xl font-semibold">Session logged</h2>
            <p className="text-muted-foreground">
              Score {result.score}% · +{result.xp} XP
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button render={<Link href={`/simulator/${stageId}`} />}>
                Practice again
              </Button>
              <Button variant="outline" render={<Link href="/simulator" />}>
                Back to simulator
              </Button>
              <Button variant="outline" render={<Link href="/simulator/performance" />}>
                View performance
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
