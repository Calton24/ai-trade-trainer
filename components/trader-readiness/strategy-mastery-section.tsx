"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { StrategyMasteryQuestion } from "@/lib/trader-readiness/types"
import { cn } from "@/lib/utils"

interface StrategyMasterySectionProps {
  questions: StrategyMasteryQuestion[]
  onComplete: (score: number) => void
}

export function StrategyMasterySection({
  questions,
  onComplete,
}: StrategyMasterySectionProps) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = questions[index]
  const isLast = index === questions.length - 1
  const masteryThreshold = 80

  if (!question) return null

  const handleSubmit = () => {
    if (!selected) return
    if (selected === question.correctAnswer) setCorrectCount((c) => c + 1)
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (isLast) {
      const score = Math.round((correctCount / questions.length) * 100)
      onComplete(score)
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setShowFeedback(false)
  }

  if (finished) {
    const score = Math.round((correctCount / questions.length) * 100)
    const passed = score >= masteryThreshold
    return (
      <div className="rounded-xl border border-border/60 bg-card/50 p-5">
        <p className="font-medium">
          Strategy Mastery — {score}%
          {passed ? " (Mastery threshold met)" : " (Below 80% threshold)"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {correctCount}/{questions.length} correct.{" "}
          {passed
            ? "Continue practising in Strategy Wiki."
            : "Review entry rules and invalidation for each strategy."}
        </p>
        {!passed && (
          <Button
            className="mt-3"
            variant="outline"
            size="sm"
            render={<Link href="/strategy-wiki" />}
          >
            Review strategies
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <span className="capitalize">{question.strategySlug.replace(/-/g, " ")}</span>
        <Progress
          value={((index + (showFeedback ? 1 : 0)) / questions.length) * 100}
          className="h-1.5 w-24"
        />
      </div>

      <p className="text-lg font-medium">{question.question}</p>

      <div className="flex flex-col gap-2">
        {question.options.map((opt) => (
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
                opt.id === question.correctAnswer &&
                "border-primary bg-primary/10",
              showFeedback &&
                selected === opt.id &&
                opt.id !== question.correctAnswer &&
                "border-destructive bg-destructive/10"
            )}
          >
            {opt.text}
          </button>
        ))}
      </div>

      {showFeedback && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm">
          <p
            className={cn(
              "font-medium",
              selected === question.correctAnswer
                ? "text-primary"
                : "text-destructive"
            )}
          >
            {selected === question.correctAnswer ? "Correct" : "Incorrect"}
          </p>
          <p className="mt-1 text-muted-foreground">{question.explanation}</p>
        </div>
      )}

      <div className="flex gap-2">
        {!showFeedback ? (
          <Button onClick={handleSubmit} disabled={!selected}>
            Check answer
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {isLast ? "Complete section" : "Next question"}
          </Button>
        )}
      </div>
    </div>
  )
}
