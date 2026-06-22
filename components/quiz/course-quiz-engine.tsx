"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  RotateCcwIcon,
  SparklesIcon,
  XCircleIcon,
} from "lucide-react"

import { useUserState } from "@/components/providers/user-state-provider"
import { QuizDiscussion } from "@/components/quiz/quiz-discussion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { CourseQuiz } from "@/lib/course/types"
import { cn } from "@/lib/utils"

interface CourseQuizEngineProps {
  quiz: CourseQuiz
  pathSlug?: string
  lessonId?: string
}

export function CourseQuizEngine({
  quiz,
  pathSlug,
  lessonId,
}: CourseQuizEngineProps) {
  const { recordQuizAttempt } = useUserState()
  const recordedRef = useRef(false)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = quiz.questions[currentIndex]
  const isLast = currentIndex === quiz.questions.length - 1
  const progress =
    ((currentIndex + (showFeedback ? 1 : 0)) / quiz.questions.length) * 100

  const handleSelect = (optionId: string) => {
    if (showFeedback) return
    setSelectedId(optionId)
  }

  const handleSubmit = () => {
    if (!selectedId) return
    const isCorrect = selectedId === question.correctAnswer
    if (isCorrect) setCorrectCount((c) => c + 1)
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (isLast) {
      setFinished(true)
      return
    }
    setCurrentIndex((i) => i + 1)
    setSelectedId(null)
    setShowFeedback(false)
  }

  const handleRetake = () => {
    recordedRef.current = false
    setCurrentIndex(0)
    setSelectedId(null)
    setShowFeedback(false)
    setCorrectCount(0)
    setFinished(false)
  }

  useEffect(() => {
    if (!finished || recordedRef.current) return
    recordedRef.current = true

    const score = Math.round((correctCount / quiz.questions.length) * 100)
    const passed = score >= quiz.passingScore

    recordQuizAttempt(
      {
        quizId: quiz.id,
        score,
        passed,
        xpEarned: passed ? quiz.xpReward : 0,
      },
      pathSlug ?? quiz.pathId,
      lessonId ?? quiz.lessonId
    )
  }, [
    finished,
    correctCount,
    quiz,
    pathSlug,
    lessonId,
    recordQuizAttempt,
  ])

  if (finished) {
    const score = Math.round((correctCount / quiz.questions.length) * 100)
    const passed = score >= quiz.passingScore
    const missed = quiz.questions.filter(
      (_, i) => i >= 0 && i < quiz.questions.length
    )

    return (
      <div className="flex flex-col gap-6">
        <div
          className={cn(
            "flex flex-col items-center gap-4 rounded-xl border p-8 text-center",
            passed
              ? "border-primary/20 bg-primary/5"
              : "border-destructive/20 bg-destructive/5"
          )}
        >
          {passed ? (
            <CheckCircle2Icon className="size-12 text-primary" />
          ) : (
            <XCircleIcon className="size-12 text-destructive" />
          )}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">
              {passed ? "Quiz Passed!" : "Keep Practicing"}
            </h2>
            <p className="text-muted-foreground">
              You scored {score}% ({correctCount}/{quiz.questions.length}{" "}
              correct)
            </p>
            <p className="text-sm text-muted-foreground">
              Passing score: {quiz.passingScore}%
            </p>
          </div>
          {passed && (
            <div className="flex items-center gap-2 text-primary">
              <SparklesIcon />
              <span className="text-sm font-medium">
                +{quiz.xpReward} XP earned
              </span>
            </div>
          )}
        </div>

        {!passed && missed.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-card/50 p-4">
            <p className="text-sm font-medium">Study next</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Review{" "}
              {quiz.questions.find((q) => q.relatedConcept)?.relatedConcept ??
                "the lesson material"}{" "}
              and retake when ready.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={handleRetake}>
            <RotateCcwIcon data-icon="inline-start" />
            Retake Quiz
          </Button>
          {pathSlug && (
            <Button render={<Link href={`/paths/${pathSlug}`} />}>
              Continue Path
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          )}
        </div>

        <QuizDiscussion quizId={quiz.id} />
      </div>
    )
  }

  const isCorrect = selectedId === question.correctAnswer

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Question {currentIndex + 1} of {quiz.questions.length}
          </span>
          <Badge variant="secondary" className="capitalize">
            {question.type.replace("-", " ")}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-medium leading-relaxed">
          {question.question}
        </h2>

        <div className="flex flex-col gap-2">
          {question.options.map((option) => {
            const isSelected = selectedId === option.id
            const showResult = showFeedback && isSelected
            const isCorrectOption = option.id === question.correctAnswer

            return (
              <button
                key={option.id}
                type="button"
                disabled={showFeedback}
                onClick={() => handleSelect(option.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-4 py-3.5 text-left text-sm transition-colors",
                  !showFeedback &&
                    isSelected &&
                    "border-primary/30 bg-primary/10 ring-1 ring-primary/20",
                  !showFeedback &&
                    !isSelected &&
                    "border-border/60 hover:border-primary/20 hover:bg-muted/30",
                  showResult &&
                    isCorrectOption &&
                    "border-primary/30 bg-primary/10",
                  showResult &&
                    !isCorrectOption &&
                    isSelected &&
                    "border-destructive/30 bg-destructive/10"
                )}
              >
                {showResult &&
                  (isCorrectOption ? (
                    <CheckCircle2Icon className="shrink-0 text-primary" />
                  ) : (
                    <XCircleIcon className="shrink-0 text-destructive" />
                  ))}
                {option.text}
              </button>
            )
          })}
        </div>
      </div>

      {showFeedback && (
        <div
          className={cn(
            "rounded-lg border p-4",
            isCorrect
              ? "border-primary/20 bg-primary/5"
              : "border-destructive/20 bg-destructive/5"
          )}
        >
          <p className="text-sm font-medium">
            {isCorrect ? "Correct!" : "Not quite — here's why:"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {question.explanation}
          </p>
          {!isCorrect && question.beginnerHint && (
            <p className="mt-2 text-sm text-muted-foreground">
              Hint: {question.beginnerHint}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {!showFeedback ? (
          <Button onClick={handleSubmit} disabled={!selectedId}>
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {isLast ? "See Results" : "Next Question"}
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        )}
      </div>
    </div>
  )
}
