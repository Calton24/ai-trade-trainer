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
import { ClassificationButtons } from "@/components/trend-spotter/classification-buttons"
import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getChartScenario } from "@/content/chart-scenarios"
import { scoreTrendExercise } from "@/lib/trend-spotter/scoring"
import type {
  TrendBias,
  TrendClassification,
  TrendSpotterScenario,
  TrendTradeDecision,
} from "@/lib/trend-spotter/types"
import { cn } from "@/lib/utils"

type Step = "classify" | "chart" | "bias" | "trade" | "reason" | "feedback"

interface TrendExerciseWorkspaceProps {
  scenario: TrendSpotterScenario
}

const BIAS_OPTIONS: { value: TrendBias; label: string; color: string }[] = [
  { value: "bullish", label: "Bullish bias", color: "text-emerald-400" },
  { value: "bearish", label: "Bearish bias", color: "text-red-400" },
  { value: "neutral", label: "Neutral / skip", color: "text-amber-400" },
]

export function TrendExerciseWorkspace({ scenario }: TrendExerciseWorkspaceProps) {
  const { recordTrendExercise } = useUserState()
  const chartScenario = getChartScenario(scenario.chartScenarioId)

  const [step, setStep] = useState<Step>("classify")
  const [classification, setClassification] =
    useState<TrendClassification | null>(null)
  const [chartScore, setChartScore] = useState(0)
  const [bias, setBias] = useState<TrendBias | null>(null)
  const [tradeDecision, setTradeDecision] = useState<TrendTradeDecision | null>(
    null
  )
  const [reasoning, setReasoning] = useState("")
  const [feedback, setFeedback] = useState<
    ReturnType<typeof scoreTrendExercise> | null
  >(null)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const steps: Step[] = ["classify", "chart", "bias", "trade", "reason"]
  const stepIndex = steps.indexOf(step === "feedback" ? "reason" : step)

  const handleSubmit = () => {
    const result = scoreTrendExercise({
      scenario,
      classification,
      bias,
      tradeDecision,
      reasoning,
      chartScore,
    })
    setFeedback(result)
    setStep("feedback")
    const id = crypto.randomUUID()
    recordTrendExercise(
      {
        id,
        exerciseId: scenario.id,
        classification,
        bias,
        tradeDecision,
        reasoning,
        chartScore,
        totalScore: result.score,
      },
      scenario.classification
    )
    setSessionId(id)
  }

  const reset = () => {
    setStep("classify")
    setClassification(null)
    setChartScore(0)
    setBias(null)
    setTradeDecision(null)
    setReasoning("")
    setFeedback(null)
    setSessionId(null)
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
            render={<Link href="/trend-spotter" />}
          >
            <ArrowLeftIcon data-icon="inline-start" />
            Trend Spotter
          </Button>
          <h1 className="text-2xl font-semibold">{scenario.title}</h1>
          <p className="mt-1 text-muted-foreground">{scenario.description}</p>
        </div>

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

        <div className="overflow-hidden rounded-xl border border-border/60">
          <ChartLabWorkspace
            scenario={chartScenario}
            variant="full"
            onComplete={(result) => setChartScore(result.score)}
          />
        </div>

        {step === "classify" && (
          <section className="rounded-xl border border-border/60 bg-card/30 p-6">
            <h2 className="font-semibold">Step 1 — Classify the chart</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              What market condition do you see?
            </p>
            <div className="mt-4">
              <ClassificationButtons
                value={classification}
                onChange={setClassification}
              />
            </div>
            <Button
              className="mt-6"
              disabled={!classification}
              onClick={() => setStep("chart")}
            >
              Next — Mark structure
            </Button>
          </section>
        )}

        {step === "chart" && (
          <section className="rounded-xl border border-border/60 bg-card/30 p-6">
            <h2 className="font-semibold">Step 2 — Mark swings & structure</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use the chart tools above to mark swing highs, swing lows, trendlines,
              or structure breaks. Submit the chart score, then continue.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Chart score captured: {chartScore}/100
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => setStep("classify")}>
                Back
              </Button>
              <Button onClick={() => setStep("bias")}>Next — Choose bias</Button>
            </div>
          </section>
        )}

        {step === "bias" && (
          <section className="rounded-xl border border-border/60 bg-card/30 p-6">
            <h2 className="font-semibold">Step 3 — Choose your bias</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {BIAS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setBias(opt.value)}
                  className={cn(
                    "rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                    bias === opt.value
                      ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                      : "border-border/60 hover:bg-muted/50"
                  )}
                >
                  <span className={opt.color}>{opt.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => setStep("chart")}>
                Back
              </Button>
              <Button disabled={!bias} onClick={() => setStep("trade")}>
                Next — Trade or skip
              </Button>
            </div>
          </section>
        )}

        {step === "trade" && (
          <section className="rounded-xl border border-border/60 bg-card/30 p-6">
            <h2 className="font-semibold">Step 4 — Would you trade this or wait?</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {(
                [
                  { value: "trade", label: "Trade this setup" },
                  { value: "skip", label: "Wait / skip" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTradeDecision(opt.value)}
                  className={cn(
                    "rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                    tradeDecision === opt.value
                      ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                      : "border-border/60 hover:bg-muted/50"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => setStep("bias")}>
                Back
              </Button>
              <Button disabled={!tradeDecision} onClick={() => setStep("reason")}>
                Next — Explain your read
              </Button>
            </div>
          </section>
        )}

        {step === "reason" && (
          <section className="rounded-xl border border-border/60 bg-card/30 p-6">
            <h2 className="font-semibold">Step 5 — One-sentence reasoning</h2>
            <Textarea
              className="mt-4 min-h-[80px]"
              placeholder="e.g. Higher lows hold — uptrend with shallow pullback."
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
            />
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => setStep("trade")}>
                Back
              </Button>
              <Button
                disabled={reasoning.trim().length < 5}
                onClick={handleSubmit}
              >
                Submit answer
              </Button>
            </div>
          </section>
        )}

        {step === "feedback" && feedback && (
          <section className="rounded-xl border border-border/60 bg-card/30 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your results</h2>
              <span
                className={cn(
                  "text-2xl font-bold",
                  feedback.score >= 80
                    ? "text-emerald-400"
                    : feedback.score >= 60
                      ? "text-amber-400"
                      : "text-red-400"
                )}
              >
                {feedback.score}/100
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{feedback.summary}</p>

            {feedback.correct.length > 0 && (
              <ul className="mt-4 flex flex-col gap-2">
                {feedback.correct.map((c) => (
                  <li
                    key={c}
                    className="flex items-start gap-2 text-sm text-emerald-400"
                  >
                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            )}

            {feedback.missed.length > 0 && (
              <ul className="mt-3 flex flex-col gap-2">
                {feedback.missed.map((m) => (
                  <li
                    key={m}
                    className="flex items-start gap-2 text-sm text-amber-400"
                  >
                    <XCircleIcon className="mt-0.5 size-4 shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-medium text-primary">Improvement tip</p>
              <p className="mt-1 text-sm text-muted-foreground">{feedback.tip}</p>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              {scenario.explanation}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {sessionId && (
                <Button
                  render={
                    <Link href={`/trend-spotter/results/${sessionId}`} />
                  }
                >
                  View full results
                </Button>
              )}
              <Button variant="outline" onClick={reset}>
                <RotateCcwIcon data-icon="inline-start" />
                Retry exercise
              </Button>
              <Button render={<Link href="/trend-spotter/challenge" />}>
                Quick 10-chart challenge
              </Button>
              <Button variant="ghost" render={<Link href="/trend-spotter" />}>
                Back to Trend Spotter
              </Button>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  )
}
