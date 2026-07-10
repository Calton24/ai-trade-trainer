"use client"

import { useState } from "react"
import { CheckCircle2Icon, RotateCcwIcon, XCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { DecisionScenariosWidget, WeeklyPlannerWidget } from "@/lib/course/widgets"
import { cn } from "@/lib/utils"

const DEFAULT_OPTIONS = ["Trade", "Wait", "Skip"]

/** Scenario-by-scenario decisions with instant coaching feedback. */
export function DecisionScenarios({
  widget,
}: {
  widget: DecisionScenariosWidget
}) {
  const options = widget.options ?? DEFAULT_OPTIONS
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const answeredCount = Object.keys(answers).length
  const correctCount = widget.scenarios.filter(
    (s, i) => answers[i] === s.correct
  ).length

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <p className="font-medium">{widget.prompt}</p>
      <div className="mt-4 flex flex-col gap-4">
        {widget.scenarios.map((scenario, i) => {
          const picked = answers[i]
          const isCorrect = picked === scenario.correct
          return (
            <div key={i} className="rounded-lg border border-border/60 p-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {scenario.situation}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    disabled={Boolean(picked)}
                    onClick={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm transition-colors",
                      picked === opt
                        ? isCorrect
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-destructive bg-destructive/10 text-destructive"
                        : picked && opt === scenario.correct
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
                    "mt-3 flex items-start gap-1.5 text-sm",
                    isCorrect ? "text-primary" : "text-destructive"
                  )}
                >
                  {isCorrect ? (
                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
                  ) : (
                    <XCircleIcon className="mt-0.5 size-4 shrink-0" />
                  )}
                  <span className="text-muted-foreground">
                    {isCorrect ? "" : `Best answer: ${scenario.correct}. `}
                    {scenario.coaching}
                  </span>
                </p>
              )}
            </div>
          )
        })}
      </div>
      {answeredCount === widget.scenarios.length && (
        <div className="mt-4 flex items-center gap-3">
          <p className="text-sm font-medium">
            {correctCount}/{widget.scenarios.length} decisions correct
          </p>
          <Button size="sm" variant="outline" onClick={() => setAnswers({})}>
            <RotateCcwIcon data-icon="inline-start" />
            Try again
          </Button>
        </div>
      )}
    </div>
  )
}

/** Weekly planner: one trade/wait/skip decision per day, scored on quality. */
export function WeeklyPlanner({ widget }: { widget: WeeklyPlannerWidget }) {
  const scenarios = widget.days.map((d) => ({
    situation: `${d.day}: ${d.situation}`,
    correct: d.correct === "trade" ? "Trade" : d.correct === "wait" ? "Wait" : "Skip",
    coaching: d.coaching,
  }))
  return (
    <DecisionScenarios
      widget={{
        kind: "decision-scenarios",
        prompt: widget.prompt,
        scenarios,
      }}
    />
  )
}
