"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import type { PsychologyScenario } from "@/lib/trader-readiness/types"
import { cn } from "@/lib/utils"

interface PsychologySectionProps {
  scenarios: PsychologyScenario[]
  onComplete: (score: number) => void
}

export function PsychologySection({
  scenarios,
  onComplete,
}: PsychologySectionProps) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const scenario = scenarios[index]
  const isLast = index === scenarios.length - 1

  if (!scenario) return null

  const handleSubmit = () => {
    if (!selected) return
    const opt = scenario.options.find((o) => o.id === selected)
    if (opt) setTotalScore((s) => s + opt.score)
    setAnswers((a) => ({ ...a, [scenario.id]: selected }))
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (isLast) {
      const finalTotal = totalScore
      const maxScore = scenarios.length * 100
      const percent = Math.round((finalTotal / maxScore) * 100)
      onComplete(percent)
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setShowFeedback(false)
  }

  if (finished) {
    const maxScore = scenarios.length * 100
    const percent = Math.round((totalScore / maxScore) * 100)
    return (
      <div className="rounded-xl border border-border/60 bg-card/50 p-5">
        <p className="font-medium">Trading Psychology — {percent}%</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Process-oriented decisions score highest. Review emotional discipline content
          for any scenarios you missed.
        </p>
      </div>
    )
  }

  const selectedOpt = scenario.options.find((o) => o.id === selected)

  return (
    <div className="flex flex-col gap-4">
      <span className="text-sm text-muted-foreground">
        Scenario {index + 1} of {scenarios.length}
      </span>

      <p className="text-lg font-medium">{scenario.situation}</p>

      <div className="flex flex-col gap-2">
        {scenario.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            disabled={showFeedback}
            onClick={() => setSelected(opt.id)}
            className={cn(
              "rounded-lg border px-4 py-3 text-left text-sm transition-colors",
              selected === opt.id
                ? "border-primary bg-primary/10"
                : "border-border/60 hover:border-primary/40",
              showFeedback &&
                opt.id === scenario.bestOptionId &&
                "border-primary bg-primary/10",
              showFeedback &&
                selected === opt.id &&
                opt.id !== scenario.bestOptionId &&
                "border-destructive bg-destructive/10"
            )}
          >
            {opt.text}
          </button>
        ))}
      </div>

      {showFeedback && selectedOpt && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm">
          <p
            className={cn(
              "font-medium",
              selectedOpt.id === scenario.bestOptionId
                ? "text-primary"
                : "text-destructive"
            )}
          >
            {selectedOpt.id === scenario.bestOptionId
              ? "Strong process thinking"
              : "Suboptimal choice"}
          </p>
          <p className="mt-1 text-muted-foreground">{scenario.explanation}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {scenario.traits.map((t) => (
              <span
                key={t}
                className="rounded-full bg-muted px-2 py-0.5 text-xs"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {!showFeedback ? (
          <Button onClick={handleSubmit} disabled={!selected}>
            Submit decision
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {isLast ? "Complete section" : "Next scenario"}
          </Button>
        )}
      </div>
    </div>
  )
}
