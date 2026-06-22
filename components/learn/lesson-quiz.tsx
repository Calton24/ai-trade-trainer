"use client"

import { useState } from "react"
import { CheckCircle2Icon, XCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { QuizQuestion } from "@/lib/types"
import { cn } from "@/lib/utils"

interface LessonQuizProps {
  questions: QuizQuestion[]
  onComplete: (score: number) => void
  disabled?: boolean
}

export function LessonQuiz({ questions, onComplete, disabled }: LessonQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1

  const handleSelect = (optionId: string, correct: boolean) => {
    if (showExplanation) return
    setSelectedId(optionId)
    setShowExplanation(true)
    if (correct) setCorrectCount((c) => c + 1)
  }

  const handleNext = () => {
    if (isLast) {
      setFinished(true)
      onComplete(Math.round((correctCount / questions.length) * 100))
      return
    }
    setCurrentIndex((i) => i + 1)
    setSelectedId(null)
    setShowExplanation(false)
  }

  if (disabled) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
        <CheckCircle2Icon className="size-8 text-primary" />
        <p className="text-sm text-muted-foreground">
          You already completed this lesson quiz.
        </p>
      </div>
    )
  }

  if (finished) {
    const score = Math.round((correctCount / questions.length) * 100)
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
        <CheckCircle2Icon className="size-10 text-primary" />
        <div className="flex flex-col gap-1">
          <h3 className="font-medium">Quiz complete!</h3>
          <p className="text-sm text-muted-foreground">
            You got {correctCount} of {questions.length} correct ({score}%)
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Quick quiz</span>
        <span>
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <p className="font-medium">{question.question}</p>

      <div className="flex flex-col gap-2">
        {question.options.map((option) => {
          const isSelected = selectedId === option.id
          const showResult = showExplanation && isSelected

          return (
            <button
              key={option.id}
              type="button"
              disabled={showExplanation}
              onClick={() => handleSelect(option.id, option.correct)}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                !showExplanation &&
                  "border-border/60 hover:border-primary/30 hover:bg-muted/30",
                showResult &&
                  option.correct &&
                  "border-primary/30 bg-primary/10",
                showResult &&
                  !option.correct &&
                  "border-destructive/30 bg-destructive/10"
              )}
            >
              {showResult &&
                (option.correct ? (
                  <CheckCircle2Icon className="shrink-0 text-primary" />
                ) : (
                  <XCircleIcon className="shrink-0 text-destructive" />
                ))}
              {option.text}
            </button>
          )
        })}
      </div>

      {showExplanation && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            {question.explanation}
          </p>
        </div>
      )}

      {showExplanation && (
        <Button onClick={handleNext} className="w-full sm:w-auto">
          {isLast ? "Finish Quiz" : "Next Question"}
        </Button>
      )}
    </div>
  )
}
