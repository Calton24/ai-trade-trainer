"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  RotateCcwIcon,
  XCircleIcon,
} from "lucide-react"

import { ChartLabWorkspace } from "@/components/chart-lab/chart-lab-workspace"
import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getChartScenario } from "@/content/chart-scenarios"
import { scoreStrategyPractice } from "@/lib/strategy-wiki/scoring"
import type {
  StrategyPracticeExercise,
  StrategyTradeDecision,
  TradingStrategy,
} from "@/lib/strategy-wiki/types"
import { cn } from "@/lib/utils"

type Step = "chart" | "decision" | "reason" | "confidence" | "feedback"

interface StrategyPracticeWorkspaceProps {
  strategy: TradingStrategy
  exercise: StrategyPracticeExercise
  exerciseIndex: number
  totalExercises: number
}

export function StrategyPracticeWorkspace({
  strategy,
  exercise,
  exerciseIndex,
  totalExercises,
}: StrategyPracticeWorkspaceProps) {
  const { recordStrategyPractice, addJournalEntry } = useUserState()
  const chartScenario = getChartScenario(exercise.scenarioId)

  const [step, setStep] = useState<Step>("chart")
  const [chartScore, setChartScore] = useState(0)
  const [tradeDecision, setTradeDecision] =
    useState<StrategyTradeDecision | null>(null)
  const [reasoning, setReasoning] = useState("")
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [feedback, setFeedback] = useState<
    ReturnType<typeof scoreStrategyPractice> | null
  >(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [savedJournal, setSavedJournal] = useState(false)

  const steps: Step[] = ["chart", "decision", "reason", "confidence"]
  const stepIndex = steps.indexOf(step === "feedback" ? "confidence" : step)

  const handleSubmit = () => {
    const result = scoreStrategyPractice({
      exercise,
      chartScore,
      tradeDecision,
      reasoning,
    })
    setFeedback(result)
    setStep("feedback")
    const id = crypto.randomUUID()
    recordStrategyPractice({
      id,
      strategyId: strategy.id,
      exerciseId: exercise.id,
      chartScore,
      tradeDecision,
      reasoning,
      confidenceRating: confidence,
      totalScore: result.score,
    })
    setSessionId(id)
  }

  const saveToJournal = () => {
    if (!feedback || savedJournal) return
    addJournalEntry({
      setupPracticed: strategy.title,
      marksSummary: `Exercise: ${exercise.title} · Chart ${chartScore}/100`,
      aiFeedbackSummary: feedback.summary,
      confidenceRating: confidence,
      mistakeTag: feedback.missed[0] ?? "none",
      personalNote: reasoning,
      source: "strategy-wiki",
      conceptTitle: exercise.title,
      drillType: "strategy-practice",
    })
    setSavedJournal(true)
  }

  const reset = () => {
    setStep("chart")
    setChartScore(0)
    setTradeDecision(null)
    setReasoning("")
    setConfidence(3)
    setFeedback(null)
    setSessionId(null)
    setSavedJournal(false)
  }

  if (!chartScenario) {
    return (
      <AppShell>
        <p className="text-muted-foreground">Chart scenario not found.</p>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 -ml-2"
            render={<Link href={`/strategy-wiki/${strategy.slug}`} />}
          >
            <ArrowLeftIcon data-icon="inline-start" />
            {strategy.title}
          </Button>
          <p className="text-xs text-muted-foreground">
            Exercise {exerciseIndex + 1} of {totalExercises}
          </p>
          <h1 className="text-xl font-semibold">{exercise.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{exercise.task}</p>
        </div>

        {step !== "feedback" && (
          <div className="flex gap-1">
            {steps.map((s, i) => (
              <div
                key={s}
                className={cn(
                  "h-1 flex-1 rounded-full",
                  i <= stepIndex ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        )}

        {step !== "feedback" && (
          <div className="overflow-hidden rounded-xl border border-border/60">
            <ChartLabWorkspace
              scenario={chartScenario}
              variant="full"
              onComplete={(result) => setChartScore(result.score)}
            />
          </div>
        )}

        {step === "chart" && (
          <section className="rounded-xl border border-border/60 bg-card/30 p-6">
            <h2 className="font-semibold">Mark the setup on the chart</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use chart tools to mark key levels, entry, stop, and target. Submit
              your markup, then continue.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Chart score captured: {chartScore}/100
            </p>
            <Button className="mt-4" onClick={() => setStep("decision")}>
              Next: Trade or skip
            </Button>
          </section>
        )}

        {step === "decision" && (
          <div className="flex flex-col gap-4">
            <p className="font-medium">Would you trade this setup or skip?</p>
            <div className="flex gap-3">
              {(["trade", "skip"] as const).map((d) => (
                <Button
                  key={d}
                  variant={tradeDecision === d ? "default" : "outline"}
                  className="flex-1 capitalize"
                  onClick={() => setTradeDecision(d)}
                >
                  {d}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => setStep("reason")}
              disabled={!tradeDecision}
            >
              Next: Explain reasoning
            </Button>
          </div>
        )}

        {step === "reason" && (
          <div className="flex flex-col gap-4">
            <p className="font-medium">Explain your plan in one sentence</p>
            <Textarea
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="What confirms the setup? Where is invalidation?"
              rows={3}
            />
            <Button onClick={() => setStep("confidence")}>
              Next: Confidence rating
            </Button>
          </div>
        )}

        {step === "confidence" && (
          <div className="flex flex-col gap-4">
            <p className="font-medium">How confident are you in this read?</p>
            <div className="flex gap-2">
              {([1, 2, 3, 4, 5] as const).map((n) => (
                <Button
                  key={n}
                  variant={confidence === n ? "default" : "outline"}
                  onClick={() => setConfidence(n)}
                >
                  {n}
                </Button>
              ))}
            </div>
            <Button onClick={handleSubmit}>Submit answer</Button>
          </div>
        )}

        {step === "feedback" && feedback && (
          <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-6">
            <div className="flex items-center gap-3">
              {feedback.passed ? (
                <CheckCircle2Icon className="size-8 text-emerald-400" />
              ) : (
                <XCircleIcon className="size-8 text-amber-400" />
              )}
              <div>
                <p className="text-2xl font-bold">{feedback.score}/100</p>
                <p className="text-sm text-muted-foreground">{feedback.summary}</p>
              </div>
            </div>
            {feedback.correct.length > 0 && (
              <ul className="text-sm text-emerald-400/90">
                {feedback.correct.map((c) => (
                  <li key={c}>✓ {c}</li>
                ))}
              </ul>
            )}
            {feedback.missed.length > 0 && (
              <ul className="text-sm text-muted-foreground">
                {feedback.missed.map((m) => (
                  <li key={m}>→ {m}</li>
                ))}
              </ul>
            )}
            <p className="text-sm text-primary/80">{feedback.tip}</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={reset}>
                <RotateCcwIcon data-icon="inline-start" />
                Retry
              </Button>
              <Button variant="outline" onClick={saveToJournal} disabled={savedJournal}>
                {savedJournal ? "Saved to journal" : "Save to journal"}
              </Button>
              {sessionId && (
                <Button
                  render={
                    <Link
                      href={`/strategy-wiki/${strategy.slug}/results/${sessionId}`}
                    />
                  }
                >
                  View results
                </Button>
              )}
              {exerciseIndex < totalExercises - 1 && (
                <Button
                  render={
                    <Link
                      href={`/strategy-wiki/${strategy.slug}/practice?exercise=${exerciseIndex + 1}`}
                    />
                  }
                >
                  Next exercise
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
