import {
  ALL_TREND_LESSONS,
  getRecommendedTrendLessonSlug,
  getTrendLesson,
} from "@/content/trend-spotter"
import type {
  StoredTrendSpotterState,
  TrendChallengeAttempt,
  TrendClassification,
  TrendExerciseAttempt,
  TrendSpotterStats,
} from "@/lib/trend-spotter/types"
import { getInitialTrendSpotterState } from "@/lib/trend-spotter/types"

import { recordLearningActivity } from "./activity"
import type { UserState } from "./types"

export { getInitialTrendSpotterState }
export type { StoredTrendSpotterState, TrendExerciseAttempt, TrendChallengeAttempt }

export function isTrendLessonCompleted(state: UserState, lessonId: string) {
  return state.trendSpotter.completedLessonIds.includes(lessonId)
}

export function completeTrendLesson(
  state: UserState,
  lessonId: string,
  xpReward = 30
): UserState {
  if (state.trendSpotter.completedLessonIds.includes(lessonId)) return state

  const lesson =
    ALL_TREND_LESSONS.find((l) => l.id === lessonId) ??
    getTrendLesson(lessonId.replace(/^ts-/, ""))
  const xp = lesson?.xpReward ?? xpReward

  let next: UserState = {
    ...state,
    trendSpotter: {
      ...state.trendSpotter,
      completedLessonIds: [...state.trendSpotter.completedLessonIds, lessonId],
      trendSpotterXP: state.trendSpotter.trendSpotterXP + xp,
    },
  }

  const { state: withActivity } = recordLearningActivity(next, {
    type: "trend-lesson-complete",
    source: "trend-spotter",
    title: lesson?.title ?? "Trend lesson",
    entityId: lessonId,
    xpAwarded: xp,
  })

  return withActivity
}

export function recordTrendExerciseAttempt(
  state: UserState,
  attempt: Omit<TrendExerciseAttempt, "id" | "completedAt"> & { id?: string },
  scenarioClassification: TrendClassification
): { state: UserState; sessionId: string } {
  const sessionId = attempt.id ?? crypto.randomUUID()
  const full: TrendExerciseAttempt = {
    ...attempt,
    id: sessionId,
    completedAt: new Date().toISOString(),
  }

  const stats = { ...state.trendSpotter.stats }
  const key = scenarioClassification
  stats[key] = {
    correct:
      stats[key].correct +
      (attempt.classification === scenarioClassification ? 1 : 0),
    total: stats[key].total + 1,
  }

  let next: UserState = {
    ...state,
    trendSpotter: {
      ...state.trendSpotter,
      exerciseAttempts: [full, ...state.trendSpotter.exerciseAttempts].slice(
        0,
        100
      ),
      stats,
      trendSpotterXP:
        state.trendSpotter.trendSpotterXP + Math.round(attempt.totalScore / 5),
    },
  }

  if (attempt.totalScore >= 60) {
    const { state: withActivity } = recordLearningActivity(next, {
      type: "trend-exercise-complete",
      source: "trend-spotter",
      title: `Trend exercise (${attempt.totalScore}/100)`,
      entityId: attempt.exerciseId,
      xpAwarded: Math.round(attempt.totalScore / 5),
    })
    next = withActivity
  }

  return { state: next, sessionId }
}

export function recordTrendChallengeAttempt(
  state: UserState,
  attempt: Omit<TrendChallengeAttempt, "id" | "completedAt"> & { id?: string }
): { state: UserState; sessionId: string } {
  const sessionId = attempt.id ?? crypto.randomUUID()
  const full: TrendChallengeAttempt = {
    ...attempt,
    id: sessionId,
    completedAt: new Date().toISOString(),
  }

  let next: UserState = {
    ...state,
    trendSpotter: {
      ...state.trendSpotter,
      challengeAttempts: [
        full,
        ...state.trendSpotter.challengeAttempts,
      ].slice(0, 50),
      trendSpotterXP: state.trendSpotter.trendSpotterXP + attempt.xpEarned,
    },
  }

  if (attempt.total >= 5) {
    const { state: withActivity } = recordLearningActivity(next, {
      type: "trend-challenge-complete",
      source: "trend-spotter",
      title: `10-Chart Challenge (${attempt.score}/${attempt.total})`,
      entityId: full.id,
      xpAwarded: attempt.xpEarned,
    })
    next = withActivity
  }

  return { state: next, sessionId }
}

export function computeTrendSpotterStats(state: UserState): TrendSpotterStats {
  const completed = state.trendSpotter.completedLessonIds
  const nextSlug = getRecommendedTrendLessonSlug(completed)
  const nextLesson = ALL_TREND_LESSONS.find((l) => l.slug === nextSlug)

  let totalCorrect = 0
  let totalAttempts = 0
  let weakest: TrendClassification | null = null
  let strongest: TrendClassification | null = null
  let worstRate = 2
  let bestRate = -1

  for (const key of Object.keys(state.trendSpotter.stats) as TrendClassification[]) {
    const s = state.trendSpotter.stats[key]
    totalCorrect += s.correct
    totalAttempts += s.total
    if (s.total >= 2) {
      const rate = s.correct / s.total
      if (rate < worstRate) {
        worstRate = rate
        weakest = key
      }
      if (rate > bestRate) {
        bestRate = rate
        strongest = key
      }
    }
  }

  const classificationAccuracy =
    totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0

  return {
    lessonsCompleted: completed.length,
    totalLessons: ALL_TREND_LESSONS.length,
    exercisesCompleted: state.trendSpotter.exerciseAttempts.filter(
      (a) => a.totalScore >= 60
    ).length,
    challengesCompleted: state.trendSpotter.challengeAttempts.length,
    classificationAccuracy,
    weakestType: weakest,
    strongestType: strongest,
    trendSpotterXP: state.trendSpotter.trendSpotterXP,
    nextLessonSlug: nextLesson?.slug ?? null,
    nextLessonTitle: nextLesson?.title ?? null,
  }
}
