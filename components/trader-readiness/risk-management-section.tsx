"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { RiskScenario } from "@/lib/trader-readiness/types"
import { scoreRiskScenario } from "@/lib/trader-readiness/scoring"
import { cn } from "@/lib/utils"

interface RiskManagementSectionProps {
  scenarios: RiskScenario[]
  onComplete: (score: number) => void
}

export function RiskManagementSection({
  scenarios,
  onComplete,
}: RiskManagementSectionProps) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [input, setInput] = useState("")
  const [selected, setSelected] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const scenario = scenarios[index]
  const isLast = index === scenarios.length - 1

  if (!scenario) return null

  const handleSubmit = () => {
    const answer = scenario.correctOptionId ? (selected ?? "") : input
    const result = scoreRiskScenario(scenario, answer)
    if (result.correct) setCorrectCount((c) => c + 1)
    setAnswers((a) => ({ ...a, [scenario.id]: answer }))
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (isLast) {
      const score = Math.round((correctCount / scenarios.length) * 100)
      onComplete(score)
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setInput("")
    setSelected(null)
    setShowFeedback(false)
  }

  if (finished) {
    const score = Math.round((correctCount / scenarios.length) * 100)
    return (
      <div className="rounded-xl border border-border/60 bg-card/50 p-5">
        <p className="font-medium">Risk Management — {score}%</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {correctCount}/{scenarios.length} scenarios correct
        </p>
      </div>
    )
  }

  const answer = scenario.correctOptionId ? selected : input
  const result = showFeedback
    ? scoreRiskScenario(scenario, answer ?? "")
    : null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">
          {scenario.mode} mode
        </span>
        <span className="text-sm text-muted-foreground">
          Scenario {index + 1} of {scenarios.length}
        </span>
      </div>

      <p className="text-lg font-medium">{scenario.prompt}</p>

      {scenario.options ? (
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
                  opt.id === scenario.correctOptionId &&
                  "border-primary bg-primary/10",
                showFeedback &&
                  selected === opt.id &&
                  opt.id !== scenario.correctOptionId &&
                  "border-destructive bg-destructive/10"
              )}
            >
              {opt.text}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">£</span>
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={showFeedback}
            placeholder="Enter amount"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      )}

      {showFeedback && result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm">
          <p className={cn("font-medium", result.correct ? "text-primary" : "text-destructive")}>
            {result.correct ? "Correct" : "Incorrect"}
          </p>
          <p className="mt-1 text-muted-foreground">{scenario.explanation}</p>
        </div>
      )}

      <div className="flex gap-2">
        {!showFeedback ? (
          <Button onClick={handleSubmit} disabled={!answer}>
            Check answer
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
