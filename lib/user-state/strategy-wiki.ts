import {
  ALL_STRATEGIES,
  getStrategyById,
} from "@/content/strategies"
import { updateProgressAfterPractice } from "@/lib/strategy-wiki/mastery"
import type {
  StoredStrategyWikiState,
  StrategyChallengeAttempt,
  StrategyPracticeAttempt,
  StrategyProgressRecord,
  StrategyWikiStats,
} from "@/lib/strategy-wiki/types"
import { getInitialStrategyWikiState } from "@/lib/strategy-wiki/types"
import { recordLearningActivity } from "./activity"
import type { UserState } from "./types"

export { getInitialStrategyWikiState }

export function getStrategyProgressRecord(
  state: StoredStrategyWikiState,
  strategyId: string
): StrategyProgressRecord {
  return (
    state.strategyProgress[strategyId] ?? {
      strategyId,
      lessonsCompleted: 0,
      practiceAttempts: 0,
      challengeAttempts: 0,
      averageScore: 0,
      bestScore: 0,
      confidenceSum: 0,
      confidenceCount: 0,
      masteryLevel: "not_started",
      lastPractisedAt: null,
      recentHighScores: [],
    }
  )
}

export function computeStrategyWikiStats(
  state: StoredStrategyWikiState
): StrategyWikiStats {
  const started = Object.values(state.strategyProgress).filter(
    (p) =>
      p.practiceAttempts > 0 ||
      p.lessonsCompleted > 0 ||
      p.challengeAttempts > 0
  ).length

  const scores = state.practiceAttempts.map((a) => a.totalScore)
  const avg =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0

  let weakestSlug: string | null = null
  let weakestTitle: string | null = null
  let lowestAvg = 101

  for (const strategy of ALL_STRATEGIES) {
    const rec = getStrategyProgressRecord(state, strategy.id)
    if (rec.practiceAttempts >= 2 && rec.averageScore < lowestAvg) {
      lowestAvg = rec.averageScore
      weakestSlug = strategy.slug
      weakestTitle = strategy.title
    }
  }

  let recommendedSlug: string | null = null
  let recommendedTitle: string | null = null

  const featured = ALL_STRATEGIES.filter((s) => s.featured)
  const notStartedFeatured = featured.find(
    (s) =>
      getStrategyProgressRecord(state, s.id).masteryLevel === "not_started"
  )
  if (notStartedFeatured) {
    recommendedSlug = notStartedFeatured.slug
    recommendedTitle = notStartedFeatured.title
  } else {
    const practising = ALL_STRATEGIES.find((s) => {
      const m = getStrategyProgressRecord(state, s.id).masteryLevel
      return m === "learning" || m === "practising"
    })
    if (practising) {
      recommendedSlug = practising.slug
      recommendedTitle = practising.title
    }
  }

  const strategiesMastered = Object.values(state.strategyProgress).filter(
    (p) => p.masteryLevel === "mastered"
  ).length

  return {
    strategiesStarted: started,
    totalStrategies: ALL_STRATEGIES.length,
    lessonsCompleted: state.completedStrategyIds.length,
    strategiesMastered,
    practiceSessions: state.practiceAttempts.length,
    challengeSessions: state.challengeAttempts.length,
    averageScore: avg,
    weakestStrategySlug: weakestSlug,
    weakestStrategyTitle: weakestTitle,
    recommendedStrategySlug: recommendedSlug,
    recommendedStrategyTitle: recommendedTitle,
    strategyWikiXP: state.strategyWikiXP,
  }
}

export function recordStrategyLessonComplete(
  state: StoredStrategyWikiState,
  strategyId: string
): StoredStrategyWikiState {
  const completed = state.completedStrategyIds.includes(strategyId)
    ? state.completedStrategyIds
    : [...state.completedStrategyIds, strategyId]

  const prev = getStrategyProgressRecord(state, strategyId)
  const updated: StrategyProgressRecord = {
    ...prev,
    lessonsCompleted: Math.max(prev.lessonsCompleted, 1),
    masteryLevel:
      prev.practiceAttempts >= 3 ? prev.masteryLevel : "learning",
  }

  return {
    ...state,
    completedStrategyIds: completed,
    strategyProgress: {
      ...state.strategyProgress,
      [strategyId]: updated,
    },
  }
}

export function recordStrategyPractice(
  state: StoredStrategyWikiState,
  attempt: StrategyPracticeAttempt
): StoredStrategyWikiState {
  const prev = getStrategyProgressRecord(state, attempt.strategyId)
  const lessonsDone =
    state.completedStrategyIds.includes(attempt.strategyId) ||
    prev.lessonsCompleted > 0
  const updated = updateProgressAfterPractice(
    prev,
    attempt.totalScore,
    attempt.confidenceRating,
    lessonsDone
  )
  const xp = Math.round(attempt.totalScore / 5)

  return {
    ...state,
    practiceAttempts: [...state.practiceAttempts, attempt],
    strategyProgress: {
      ...state.strategyProgress,
      [attempt.strategyId]: updated,
    },
    strategyWikiXP: state.strategyWikiXP + xp,
  }
}

export function recordStrategyChallenge(
  state: StoredStrategyWikiState,
  attempt: StrategyChallengeAttempt
): StoredStrategyWikiState {
  const prev = getStrategyProgressRecord(state, attempt.strategyId)
  const updated: StrategyProgressRecord = {
    ...prev,
    challengeAttempts: prev.challengeAttempts + 1,
    lastPractisedAt: attempt.completedAt,
  }

  return {
    ...state,
    challengeAttempts: [...state.challengeAttempts, attempt],
    strategyProgress: {
      ...state.strategyProgress,
      [attempt.strategyId]: updated,
    },
    strategyWikiXP: state.strategyWikiXP + attempt.xpEarned,
  }
}

export function getRecentStrategySessions(
  state: StoredStrategyWikiState,
  limit = 5
) {
  return [...state.practiceAttempts]
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    .slice(0, limit)
    .map((a) => {
      const strategy = getStrategyById(a.strategyId)
      return {
        ...a,
        strategyTitle: strategy?.title ?? a.strategyId,
        strategySlug: strategy?.slug ?? a.strategyId,
      }
    })
}

export function getContinuePractisingStrategy(
  state: StoredStrategyWikiState
): { slug: string; title: string } | null {
  const sorted = [...state.practiceAttempts].sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )
  if (sorted.length === 0) return null
  const last = sorted[0]
  const strategy = getStrategyById(last.strategyId)
  if (!strategy) return null
  return { slug: strategy.slug, title: strategy.title }
}


export function isStrategyLessonCompleted(state: UserState, strategyId: string) {
  return state.strategyWiki.completedStrategyIds.includes(strategyId)
}

export function completeStrategyLesson(
  state: UserState,
  strategyId: string,
  title: string,
  xpReward = 25
): UserState {
  if (state.strategyWiki.completedStrategyIds.includes(strategyId)) return state

  let next: UserState = {
    ...state,
    strategyWiki: recordStrategyLessonComplete(state.strategyWiki, strategyId),
  }
  next = {
    ...next,
    strategyWiki: {
      ...next.strategyWiki,
      strategyWikiXP: next.strategyWiki.strategyWikiXP + xpReward,
    },
  }

  const { state: withActivity } = recordLearningActivity(next, {
    type: "strategy-lesson-complete",
    source: "strategy-wiki",
    title: title || "Strategy lesson",
    entityId: strategyId,
    xpAwarded: xpReward,
  })
  return withActivity
}

export function recordStrategyPracticeAttempt(
  state: UserState,
  attempt: Omit<StrategyPracticeAttempt, "id" | "completedAt"> & { id?: string }
): { state: UserState; sessionId: string } {
  const sessionId = attempt.id ?? crypto.randomUUID()
  const full: StrategyPracticeAttempt = {
    ...attempt,
    id: sessionId,
    completedAt: new Date().toISOString(),
  }

  let next: UserState = {
    ...state,
    strategyWiki: recordStrategyPractice(state.strategyWiki, full),
  }

  const xp = Math.round(attempt.totalScore / 5)
  next = awardXPInternal(next, xp)

  if (attempt.totalScore >= 60) {
    const strategy = getStrategyById(attempt.strategyId)
    const { state: withActivity } = recordLearningActivity(next, {
      type: "strategy-practice-complete",
      source: "strategy-wiki",
      title: `${strategy?.title ?? "Strategy"} practice (${attempt.totalScore}/100)`,
      entityId: attempt.exerciseId,
      xpAwarded: xp,
    })
    next = withActivity
  }

  return { state: next, sessionId }
}

export function recordStrategyChallengeAttempt(
  state: UserState,
  attempt: Omit<StrategyChallengeAttempt, "id" | "completedAt"> & { id?: string }
): { state: UserState; sessionId: string } {
  const sessionId = attempt.id ?? crypto.randomUUID()
  const full: StrategyChallengeAttempt = {
    ...attempt,
    id: sessionId,
    completedAt: new Date().toISOString(),
  }

  let next: UserState = {
    ...state,
    strategyWiki: recordStrategyChallenge(state.strategyWiki, full),
  }
  next = awardXPInternal(next, attempt.xpEarned)

  const strategy = getStrategyById(attempt.strategyId)
  const { state: withActivity } = recordLearningActivity(next, {
    type: "strategy-challenge-complete",
    source: "strategy-wiki",
    title: `${strategy?.title ?? "Strategy"} challenge (${attempt.score}/${attempt.total})`,
    entityId: attempt.strategyId,
    xpAwarded: attempt.xpEarned,
  })
  next = withActivity

  return { state: next, sessionId }
}

function awardXPInternal(state: UserState, amount: number): UserState {
  const progress = state.progress
  const xp = progress.xp + amount
  let level = progress.level
  while (xp >= level * 100) level += 1
  return { ...state, progress: { ...progress, xp, level } }
}
