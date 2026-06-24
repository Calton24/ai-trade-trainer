"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRightIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react"

import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { BookLabConcept, BookLabQuizQuestion } from "@/lib/book-lab/types"
import { cn } from "@/lib/utils"

interface BookLabMiniQuizProps {
  concept: BookLabConcept
  onComplete?: (score: number, passed: boolean) => void
}

export function BookLabMiniQuiz({ concept, onComplete }: BookLabMiniQuizProps) {
  const { recordBookQuiz } = useUserState()
  const questions = concept.quizQuestions
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const recordedRef = useRef(false)

  const question: BookLabQuizQuestion | undefined = questions[index]
  const isLast = index === questions.length - 1

  useEffect(() => {
    if (!finished || recordedRef.current) return
    recordedRef.current = true
    const score = Math.round((correctCount / questions.length) * 100)
    const passed = score >= 70
    recordBookQuiz({ conceptId: concept.id, score, passed })
    onComplete?.(score, passed)
  }, [finished, correctCount, questions.length, concept.id, recordBookQuiz, onComplete])

  if (questions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No quiz for this concept.</p>
    )
  }

  if (!question) return null

  const handleSubmit = () => {
    if (!selected) return
    if (selected === question.correctAnswer) {
      setCorrectCount((c) => c + 1)
    }
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (isLast) {
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setShowFeedback(false)
  }

  if (finished) {
    const score = Math.round((correctCount / questions.length) * 100)
    const passed = score >= 70
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-5">
        <div className="flex items-center gap-2">
          {passed ? (
            <CheckCircle2Icon className="text-primary" />
          ) : (
            <XCircleIcon className="text-destructive" />
          )}
          <p className="font-medium">
            {passed ? "Quiz passed" : "Keep studying"} — {score}%
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {correctCount}/{questions.length} correct
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <Progress
          value={((index + (showFeedback ? 1 : 0)) / questions.length) * 100}
          className="h-1.5 w-24"
        />
      </div>
      <p className="font-medium">{question.question}</p>
      <div className="flex flex-col gap-2">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            disabled={showFeedback}
            onClick={() => setSelected(opt.id)}
            className={cn(
              "rounded-lg border px-4 py-3 text-left text-sm transition-colors",
              selected === opt.id && !showFeedback && "border-primary/30 bg-primary/10",
              showFeedback &&
                opt.id === question.correctAnswer &&
                "border-primary/30 bg-primary/10",
              showFeedback &&
                selected === opt.id &&
                opt.id !== question.correctAnswer &&
                "border-destructive/30 bg-destructive/10"
            )}
          >
            {opt.text}
          </button>
        ))}
      </div>
      {showFeedback && (
        <p className="text-sm text-muted-foreground">{question.explanation}</p>
      )}
      <div>
        {!showFeedback ? (
          <Button onClick={handleSubmit} disabled={!selected}>
            Submit
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {isLast ? "Finish Quiz" : "Next"}
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        )}
      </div>
    </div>
  )
}
