"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRightIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { KnowledgeQuestion } from "@/lib/trader-readiness/types"
import { cn } from "@/lib/utils"

interface KnowledgeSectionProps {
  questions: KnowledgeQuestion[]
  onComplete: (score: number, weaknesses: string[]) => void
}

export function KnowledgeSection({ questions, onComplete }: KnowledgeSectionProps) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [fillAnswer, setFillAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = questions[index]
  const isLast = index === questions.length - 1

  if (!question) return null

  const currentAnswer =
    question.type === "fill-blank" ? fillAnswer.trim() : selected

  const isCorrect = () => {
    if (!currentAnswer) return false
    return (
      currentAnswer.toLowerCase() === question.correctAnswer.toLowerCase()
    )
  }

  const handleSubmit = () => {
    if (!currentAnswer) return
    const correct = isCorrect()
    if (correct) setCorrectCount((c) => c + 1)
    setAnswers((a) => ({ ...a, [question.id]: currentAnswer }))
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (isLast) {
      const actualCorrect = showFeedback
        ? correctCount
        : correctCount +
          (currentAnswer &&
          currentAnswer.toLowerCase() === question.correctAnswer.toLowerCase()
            ? 1
            : 0)
      const score = Math.round((actualCorrect / questions.length) * 100)
      const allAnswers = { ...answers, [question.id]: currentAnswer ?? "" }
      const weaknesses = questions
        .filter((q) => {
          const a = allAnswers[q.id] ?? ""
          return a.toLowerCase() !== q.correctAnswer.toLowerCase()
        })
        .map((q) => q.question.slice(0, 50))
      onComplete(score, weaknesses)
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setFillAnswer("")
    setShowFeedback(false)
  }

  if (finished) {
    const score = Math.round((correctCount / questions.length) * 100)
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-5">
        <div className="flex items-center gap-2">
          {score >= 60 ? (
            <CheckCircle2Icon className="text-primary" />
          ) : (
            <XCircleIcon className="text-destructive" />
          )}
          <p className="font-medium">Market Knowledge — {score}%</p>
        </div>
        <p className="text-sm text-muted-foreground">
          {correctCount}/{questions.length} correct
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <Progress
          value={((index + (showFeedback ? 1 : 0)) / questions.length) * 100}
          className="h-1.5 w-24"
        />
      </div>

      <p className="text-lg font-medium">{question.question}</p>

      {question.type === "fill-blank" ? (
        <input
          type="text"
          value={fillAnswer}
          onChange={(e) => setFillAnswer(e.target.value)}
          disabled={showFeedback}
          placeholder="Type your answer..."
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      ) : (
        <div className="flex flex-col gap-2">
          {question.options?.map((opt) => (
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
      )}

      {showFeedback && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm">
          <p className={cn("font-medium", isCorrect() ? "text-primary" : "text-destructive")}>
            {isCorrect() ? "Correct" : "Incorrect"}
          </p>
          <p className="mt-1 text-muted-foreground">{question.explanation}</p>
          {question.lessonHref && (
            <Button
              variant="link"
              size="sm"
              className="mt-2 h-auto p-0"
              render={<Link href={question.lessonHref} />}
            >
              Review lesson
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {!showFeedback ? (
          <Button onClick={handleSubmit} disabled={!currentAnswer}>
            Check answer
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {isLast ? "Complete section" : "Next question"}
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        )}
      </div>
    </div>
  )
}
