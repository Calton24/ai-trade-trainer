"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRightIcon, LightbulbIcon, SparklesIcon } from "lucide-react"

import { LessonQuiz } from "@/components/learn/lesson-quiz"
import { useUserState } from "@/components/providers/user-state-provider"
import { TrainingChart } from "@/components/training/training-chart"
import { Button } from "@/components/ui/button"
import { generateMockCandles } from "@/lib/mock-data"
import type { Lesson } from "@/lib/types"

interface LessonContentProps {
  lesson: Lesson
}

export function LessonContent({ lesson }: LessonContentProps) {
  const { markLessonComplete, isLessonDone } = useUserState()
  const alreadyDone = isLessonDone(lesson.id)
  const [quizDone, setQuizDone] = useState(alreadyDone)
  const [xpEarned, setXpEarned] = useState(alreadyDone)
  const chartCandles = generateMockCandles(35)

  const handleQuizComplete = () => {
    setQuizDone(true)
    if (!alreadyDone) {
      markLessonComplete(lesson.id, lesson.xpReward)
      setXpEarned(true)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-primary">Lesson</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {lesson.title}
        </h1>
        <p className="text-muted-foreground">{lesson.subtitle}</p>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="rounded-full bg-muted px-2.5 py-1 capitalize">
            {lesson.difficulty}
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1">
            {lesson.estimatedMinutes} min read
          </span>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
            +{lesson.xpReward} XP
          </span>
          {alreadyDone && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
              Completed
            </span>
          )}
        </div>
      </div>

      {lesson.sections.map((section) => (
        <div key={section.heading} className="flex flex-col gap-3">
          <h2 className="text-lg font-medium">{section.heading}</h2>
          <p className="leading-relaxed text-muted-foreground">
            {section.content}
          </p>
        </div>
      ))}

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card/50">
        <div className="border-b border-border/60 px-4 py-3">
          <p className="text-sm font-medium">Chart example</p>
          <p className="text-xs text-muted-foreground">
            Visual reference for this lesson (simulated data)
          </p>
        </div>
        <TrainingChart candles={chartCandles} readOnly />
      </div>

      <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-5">
        <LightbulbIcon className="mt-0.5 shrink-0 text-primary" />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-primary">Key idea</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {lesson.keyIdea}
          </p>
        </div>
      </div>

      <LessonQuiz
        questions={lesson.quiz}
        onComplete={handleQuizComplete}
        disabled={alreadyDone}
      />

      {xpEarned && !alreadyDone && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <SparklesIcon className="text-primary" />
          <p className="text-sm">
            <span className="font-medium text-primary">
              +{lesson.xpReward} XP earned!
            </span>{" "}
            Great work completing this lesson.
          </p>
        </div>
      )}

      {quizDone && (
        <div className="flex flex-col gap-3 sm:flex-row">
          {lesson.nextLessonId ? (
            <Button render={<Link href={`/learn/${lesson.nextLessonId}`} />}>
              Next Lesson
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          ) : (
            <Button render={<Link href="/training" />}>
              Practice with a Chart Drill
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          )}
          <Button variant="outline" render={<Link href="/learn" />}>
            Back to Lesson Library
          </Button>
        </div>
      )}
    </div>
  )
}
