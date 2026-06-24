"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
  LayersIcon,
  SparklesIcon,
} from "lucide-react"

import { LessonRenderer } from "@/components/learn/lesson-renderer"
import { useUserState } from "@/components/providers/user-state-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  formatDuration,
  getLessonHref,
  getNextLesson,
  getPreviousLesson,
  TIME_ESTIMATE_NOTE,
} from "@/lib/course"
import { getDeckSlugForPath, getFlashcardSessionHref } from "@/lib/flashcards/deck-map"
import type { CourseLesson, CourseModule, LearningPathContent } from "@/lib/course/types"

interface CourseLessonContentProps {
  path: LearningPathContent
  module: CourseModule
  lesson: CourseLesson
}

const typeLabels: Record<string, string> = {
  reading: "Lesson",
  interactive: "Exercise",
  quiz: "Quiz",
  "chart-drill": "Chart Drill",
  reflection: "Reflection",
}

export function CourseLessonContent({
  path,
  module,
  lesson,
}: CourseLessonContentProps) {
  const { markLessonComplete, addJournalEntry, isLessonDone } = useUserState()
  const completed = isLessonDone(lesson.id)
  const [justCompleted, setJustCompleted] = useState(false)
  const [reflection, setReflection] = useState("")

  const next = getNextLesson(path.id, lesson.id)
  const prev = getPreviousLesson(path.id, lesson.id)

  const handleComplete = () => {
    if (completed) return
    markLessonComplete(lesson.id, lesson.xpReward, path.id)
    setJustCompleted(true)
  }

  const handleReflectionComplete = () => {
    if (completed) return
    const note =
      reflection.trim() ||
      "Reflection completed — add personal rules as you keep learning."
    addJournalEntry({
      setupPracticed: lesson.title,
      marksSummary: "Reflection exercise",
      aiFeedbackSummary: lesson.reflectionPrompt ?? lesson.description,
      confidenceRating: 4,
      mistakeTag: "N/A",
      personalNote: note,
    })
    markLessonComplete(lesson.id, lesson.xpReward, path.id)
    setJustCompleted(true)
  }

  const showXpBanner = justCompleted && !completed
  const flashcardDeck = getDeckSlugForPath(path.slug)
  const flashcardHref = getFlashcardSessionHref(flashcardDeck)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          render={<Link href={`/paths/${path.slug}`} />}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          {path.title}
        </Button>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">{module.title}</Badge>
          <span>{typeLabels[lesson.lessonType] ?? "Lesson"}</span>
          <span className="flex items-center gap-1">
            <ClockIcon className="size-3.5" />
            {formatDuration(lesson.estimatedMinutes)}
          </span>
          {completed && (
            <Badge className="bg-primary/10 text-primary">Completed</Badge>
          )}
        </div>

        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {lesson.title}
        </h1>
        <p className="text-muted-foreground">{lesson.description}</p>
        <p className="text-xs text-muted-foreground">{TIME_ESTIMATE_NOTE}</p>
      </div>

      {lesson.lessonType === "quiz" && lesson.quizId && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <p className="font-medium">This step is a quiz</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Open the quiz to answer questions and earn XP when you pass.
          </p>
          <Button
            className="mt-4"
            render={
              <Link
                href={`/quiz/${lesson.quizId}?path=${path.slug}&lesson=${lesson.id}`}
              />
            }
          >
            {completed ? "Retake Quiz" : "Start Quiz"}
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      )}

      {lesson.lessonType === "chart-drill" && lesson.drillId && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <p className="font-medium">Chart drill</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Mark levels on a replay chart and submit for feedback.
          </p>
          <Button
            className="mt-4"
            render={
              <Link
                href={`/training?drill=${lesson.drillId}&path=${path.slug}&lesson=${lesson.id}`}
              />
            }
          >
            {completed ? "Practice Again" : "Start Drill"}
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      )}

      {lesson.contentBlocks.length > 0 && (
        <LessonRenderer blocks={lesson.contentBlocks} />
      )}

      {lesson.lessonType === "reflection" && (
        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          <Label htmlFor="reflection">{lesson.reflectionPrompt}</Label>
          <Textarea
            id="reflection"
            className="mt-3"
            rows={5}
            placeholder="Write your beginner rules here…"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            disabled={completed}
          />
          {!completed && (
            <Button className="mt-4" onClick={handleReflectionComplete}>
              Save Reflection & Complete
            </Button>
          )}
        </div>
      )}

      {(lesson.lessonType === "reading" ||
        lesson.lessonType === "interactive") && (
        <div className="flex flex-col gap-3 border-t border-border/60 pt-6">
          {!completed ? (
            <Button onClick={handleComplete}>Complete Lesson</Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              You completed this lesson. Review anytime or continue your path.
            </p>
          )}
        </div>
      )}

      {showXpBanner && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <SparklesIcon className="text-primary" />
            <p className="text-sm">
              <span className="font-medium text-primary">
                +{lesson.xpReward} XP earned!
              </span>
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/50 p-4">
            <div className="flex items-center gap-2 text-primary">
              <LayersIcon className="size-4" />
              <p className="text-sm font-medium">Lock in what you learned</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Review 10 flashcards from this concept to strengthen recall.
            </p>
            <Button className="mt-3" size="sm" render={<Link href={flashcardHref} />}>
              Start 10-card review
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        {prev ? (
          <Button
            variant="outline"
            render={
              <Link href={getLessonHref(path.slug, prev.slug)} />
            }
          >
            <ArrowLeftIcon data-icon="inline-start" />
            Previous
          </Button>
        ) : (
          <div />
        )}
        {next ? (
          <Button
            render={
              <Link href={getLessonHref(path.slug, next.slug)} />
            }
          >
            Next: {next.title}
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        ) : (
          <Button render={<Link href={`/paths/${path.slug}`} />}>
            Back to Path
          </Button>
        )}
      </div>
    </div>
  )
}
