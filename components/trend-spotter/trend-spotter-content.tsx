"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  InfoIcon,
  LayersIcon,
  TargetIcon,
  TrendingUpIcon,
  ZapIcon,
} from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  getAllTrendModules,
  getAllTrendScenarios,
  getTrendLesson,
  TREND_SPOTTER_DISCLAIMER,
} from "@/content/trend-spotter"

function labelType(t: string | null) {
  if (!t) return "—"
  return t.charAt(0).toUpperCase() + t.slice(1)
}

export function TrendSpotterContent() {
  const { state, trendSpotterStats, isTrendLessonDone } = useUserState()
  const modules = getAllTrendModules()
  const exercises = getAllTrendScenarios()
  const isNew =
    state.trendSpotter.completedLessonIds.length === 0 &&
    state.trendSpotter.exerciseAttempts.length === 0 &&
    state.trendSpotter.challengeAttempts.length === 0

  const continueLesson = trendSpotterStats.nextLessonSlug
    ? getTrendLesson(trendSpotterStats.nextLessonSlug)
    : getTrendLesson("what-is-a-trend")

  const recentExercises = state.trendSpotter.exerciseAttempts.slice(0, 3)
  const recentChallenges = state.trendSpotter.challengeAttempts.slice(0, 2)

  const lessonPercent =
    trendSpotterStats.totalLessons > 0
      ? Math.round(
          (trendSpotterStats.lessonsCompleted / trendSpotterStats.totalLessons) *
            100
        )
      : 0

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-primary">
            <TrendingUpIcon className="size-5" />
            <span className="text-sm font-medium">Trend Spotter</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Trend Spotter
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Train your eye to identify trend, range, pullback, reversal, and messy
            no-trade charts.
          </p>
          <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground/70">
            <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
            {TREND_SPOTTER_DISCLAIMER}
          </p>
        </div>

        {isNew ? (
          <EmptyState
            icon={TrendingUpIcon}
            title="Start with Trend Basics"
            description="Start with Trend Basics to learn how to read direction before planning trades."
            action={
              <Button render={<Link href="/trend-spotter/lessons/what-is-a-trend" />}>
                Start Trend Basics
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            }
          />
        ) : (
          continueLesson && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <p className="text-sm font-medium text-primary">
                Continue Trend Training
              </p>
              <h2 className="mt-1 text-lg font-semibold">{continueLesson.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {continueLesson.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  render={
                    <Link href={`/trend-spotter/lessons/${continueLesson.slug}`} />
                  }
                >
                  Continue lesson
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
                {continueLesson.relatedExerciseId && (
                  <Button
                    variant="outline"
                    render={
                      <Link
                        href={`/trend-spotter/exercises/${continueLesson.relatedExerciseId}`}
                      />
                    }
                  >
                    Practise on chart
                  </Button>
                )}
              </div>
            </div>
          )
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-card/50 p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TargetIcon className="size-4" />
              <p className="text-sm font-medium">Classification accuracy</p>
            </div>
            <p className="mt-2 text-2xl font-semibold">
              {trendSpotterStats.exercisesCompleted > 0 ||
              trendSpotterStats.challengesCompleted > 0
                ? `${trendSpotterStats.classificationAccuracy}%`
                : "—"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {trendSpotterStats.exercisesCompleted > 0
                ? `${trendSpotterStats.exercisesCompleted} exercises passed`
                : "Complete exercises to track accuracy"}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/50 p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <LayersIcon className="size-4" />
              <p className="text-sm font-medium">Weakest trend skill</p>
            </div>
            <p className="mt-2 text-2xl font-semibold">
              {labelType(trendSpotterStats.weakestType)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {trendSpotterStats.weakestType
                ? "Focus drills on this pattern type"
                : "More practice needed to identify"}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/50 p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ZapIcon className="size-4" />
              <p className="text-sm font-medium">Quick challenge</p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              10 charts — classify as fast as you can.
            </p>
            <Button
              className="mt-3"
              size="sm"
              render={<Link href="/trend-spotter/challenge" />}
            >
              Start challenge
            </Button>
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Beginner Trend Lessons</h2>
            <span className="text-sm text-muted-foreground">
              {trendSpotterStats.lessonsCompleted}/{trendSpotterStats.totalLessons}{" "}
              complete
            </span>
          </div>
          <Progress value={lessonPercent} className="mb-6 h-2" />
          <div className="flex flex-col gap-6">
            {modules.map((mod) => (
              <div key={mod.id}>
                <h3 className="mb-3 font-medium">{mod.title}</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {mod.lessons.map((lesson) => {
                    const done = isTrendLessonDone(lesson.id)
                    return (
                      <Link
                        key={lesson.id}
                        href={`/trend-spotter/lessons/${lesson.slug}`}
                        className="flex items-start justify-between rounded-lg border border-border/60 bg-card/30 p-4 transition-colors hover:border-primary/30 hover:bg-card/60"
                      >
                        <div>
                          <p className="font-medium">{lesson.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {lesson.estimatedMinutes} min · {lesson.difficulty}
                          </p>
                        </div>
                        {done && (
                          <Badge variant="secondary" className="shrink-0 text-xs">
                            Done
                          </Badge>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold">Guided Trend Exercises</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {exercises.map((ex) => (
              <Link
                key={ex.id}
                href={`/trend-spotter/exercises/${ex.id}`}
                className="rounded-xl border border-border/60 bg-card/30 p-4 transition-colors hover:border-primary/30"
              >
                <Badge
                  variant="outline"
                  className="mb-2 text-[10px] capitalize"
                >
                  {ex.classification}
                </Badge>
                <p className="font-medium">{ex.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {ex.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {(recentExercises.length > 0 || recentChallenges.length > 0) && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">Recent Trend Sessions</h2>
            <ul className="flex flex-col gap-2">
              {recentExercises.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/trend-spotter/results/${a.id}`}
                    className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3 text-sm transition-colors hover:border-primary/30"
                  >
                    <span>Exercise · {a.exerciseId.replace("ts-", "")}</span>
                    <span className="text-muted-foreground">{a.totalScore}/100</span>
                  </Link>
                </li>
              ))}
              {recentChallenges.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/trend-spotter/results/${a.id}`}
                    className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3 text-sm transition-colors hover:border-primary/30"
                  >
                    <span>10-Chart Challenge</span>
                    <span className="text-muted-foreground">
                      {a.score}/{a.total}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AppShell>
  )
}
