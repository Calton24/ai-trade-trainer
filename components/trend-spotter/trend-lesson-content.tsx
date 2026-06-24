"use client"

import { useState } from "react"
import Link from "next/link"
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  LightbulbIcon,
} from "lucide-react"

import { ChartLabWorkspace } from "@/components/chart-lab/chart-lab-workspace"
import { AppShell } from "@/components/layout/app-shell"
import { ClassificationButtons } from "@/components/trend-spotter/classification-buttons"
import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import { getChartScenario } from "@/content/chart-scenarios"
import { getTrendModuleForLesson } from "@/content/trend-spotter"
import type { TrendSpotterLesson } from "@/lib/trend-spotter/types"
import { cn } from "@/lib/utils"

interface TrendLessonContentProps {
  lesson: TrendSpotterLesson
}

export function TrendLessonContent({ lesson }: TrendLessonContentProps) {
  const { isTrendLessonDone, markTrendLessonComplete } = useUserState()
  const module = getTrendModuleForLesson(lesson)
  const done = isTrendLessonDone(lesson.id)

  const demoScenario = lesson.chartDemoId
    ? getChartScenario(lesson.chartDemoId)
    : undefined
  const practiceScenario = lesson.chartPracticeId
    ? getChartScenario(lesson.chartPracticeId)
    : undefined

  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [practiceClass, setPracticeClass] = useState<
    import("@/lib/trend-spotter/types").TrendClassification | null
  >(null)

  const quizScore =
    lesson.quizQuestions.filter((q) => quizAnswers[q.id] === q.correctAnswer)
      .length
  const quizPassed =
    quizSubmitted &&
    quizScore >= Math.ceil(lesson.quizQuestions.length * 0.6)

  const handleComplete = () => {
    if (!done) markTrendLessonComplete(lesson.id)
  }

  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
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
          {module && (
            <p className="text-sm text-primary">{module.title}</p>
          )}
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            {lesson.title}
          </h1>
          <p className="mt-2 text-muted-foreground">{lesson.summary}</p>
        </div>

        <section className="rounded-xl border border-border/60 bg-card/30 p-6">
          <h2 className="font-semibold">Explanation</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {lesson.explanation}
          </p>
        </section>

        {demoScenario && (
          <section>
            <h2 className="mb-3 font-semibold">Chart demo</h2>
            <div className="overflow-hidden rounded-xl border border-border/60">
              <ChartLabWorkspace scenario={demoScenario} variant="embed" />
            </div>
          </section>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-center gap-2 text-primary">
              <LightbulbIcon className="size-4" />
              <p className="text-sm font-medium">Key idea</p>
            </div>
            <p className="mt-2 text-sm leading-relaxed">{lesson.whyMatters}</p>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangleIcon className="size-4" />
              <p className="text-sm font-medium">Common beginner mistake</p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {lesson.commonMistake}
            </p>
          </div>
        </div>

        {practiceScenario && (
          <section className="rounded-xl border border-border/60 bg-card/30 p-6">
            <h2 className="font-semibold">Interactive chart question</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Study the chart, then classify the market condition.
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-border/60">
              <ChartLabWorkspace scenario={practiceScenario} variant="embed" />
            </div>
            <div className="mt-4">
              <ClassificationButtons
                value={practiceClass}
                onChange={setPracticeClass}
              />
            </div>
            {practiceClass && (
              <p className="mt-3 text-sm text-muted-foreground">
                Good — now compare your read with the guided exercise after the
                quiz.
              </p>
            )}
          </section>
        )}

        <section className="rounded-xl border border-border/60 bg-card/30 p-6">
          <h2 className="font-semibold">Mini quiz</h2>
          <div className="mt-4 flex flex-col gap-6">
            {lesson.quizQuestions.map((q) => {
              const selected = quizAnswers[q.id]
              const showResult = quizSubmitted
              return (
                <div key={q.id}>
                  <p className="font-medium">{q.question}</p>
                  <div className="mt-2 flex flex-col gap-2">
                    {q.options.map((opt) => {
                      const isSelected = selected === opt.id
                      const isCorrect = opt.id === q.correctAnswer
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() =>
                            setQuizAnswers((prev) => ({
                              ...prev,
                              [q.id]: opt.id,
                            }))
                          }
                          className={cn(
                            "rounded-lg border px-4 py-2.5 text-left text-sm transition-colors disabled:cursor-default",
                            isSelected && !showResult && "border-primary bg-primary/10",
                            showResult &&
                              isCorrect &&
                              "border-emerald-500/50 bg-emerald-500/10",
                            showResult &&
                              isSelected &&
                              !isCorrect &&
                              "border-red-500/50 bg-red-500/10",
                            !isSelected &&
                              !showResult &&
                              "border-border/60 hover:bg-muted/50"
                          )}
                        >
                          {opt.text}
                        </button>
                      )
                    })}
                  </div>
                  {showResult && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {q.explanation}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
          {!quizSubmitted ? (
            <Button
              className="mt-6"
              disabled={
                Object.keys(quizAnswers).length < lesson.quizQuestions.length
              }
              onClick={() => setQuizSubmitted(true)}
            >
              Check answers
            </Button>
          ) : (
            <p className="mt-4 text-sm">
              Score: {quizScore}/{lesson.quizQuestions.length}
              {quizPassed ? " — passed" : " — review and retry"}
            </p>
          )}
        </section>

        <div className="flex flex-wrap gap-3 border-t border-border/60 pt-6">
          {done ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2Icon className="size-5" />
              <span className="text-sm font-medium">Lesson complete</span>
            </div>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!quizSubmitted || !quizPassed}
            >
              Complete lesson
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          )}
          {lesson.relatedExerciseId && (
            <Button
              variant="outline"
              render={
                <Link
                  href={`/trend-spotter/exercises/${lesson.relatedExerciseId}`}
                />
              }
            >
              Try guided exercise
            </Button>
          )}
          <Button variant="ghost" render={<Link href="/trend-spotter" />}>
            Back to Trend Spotter
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
