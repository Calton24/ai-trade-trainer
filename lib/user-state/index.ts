import {
  getAllLessons,
  getLessonById,
  getPathBySlug,
  getQuizById,
} from "@/content/registry"
import {
  getNextIncompleteLesson,
  getPathProgressPercent as computePathProgress,
  getRecommendedLessonId,
  type UserProgressSnapshot,
} from "@/lib/course/unlocks"
import type { JournalEntry, UserProgress } from "@/lib/types"

import type {
  StoredDrillSession,
  StoredLessonProgress,
  StoredQuizAttempt,
  StoredUserProgress,
  UserState,
} from "./types"
import { STORAGE_KEYS } from "./types"

export function getInitialProgress(): StoredUserProgress {
  return {
    level: 1,
    xp: 0,
    streak: 0,
    lastActivityDate: null,
    activePathId: null,
    completedSyllabusItems: [],
    pathProgress: {},
  }
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadUserState(): UserState {
  return {
    progress: readJson(STORAGE_KEYS.progress, getInitialProgress()),
    lessonProgress: readJson<StoredLessonProgress[]>(
      STORAGE_KEYS.lessonProgress,
      []
    ),
    quizAttempts: readJson<StoredQuizAttempt[]>(STORAGE_KEYS.quizAttempts, []),
    drillSessions: readJson<StoredDrillSession[]>(
      STORAGE_KEYS.drillSessions,
      []
    ),
    journalEntries: readJson<JournalEntry[]>(STORAGE_KEYS.journalEntries, []),
    earnedBadgeIds: readJson<string[]>(STORAGE_KEYS.badges, []),
  }
}

export function saveUserState(state: UserState) {
  writeJson(STORAGE_KEYS.progress, state.progress)
  writeJson(STORAGE_KEYS.lessonProgress, state.lessonProgress)
  writeJson(STORAGE_KEYS.quizAttempts, state.quizAttempts)
  writeJson(STORAGE_KEYS.drillSessions, state.drillSessions)
  writeJson(STORAGE_KEYS.journalEntries, state.journalEntries)
  writeJson(STORAGE_KEYS.badges, state.earnedBadgeIds)
}

export function resetUserProgress() {
  if (typeof window === "undefined") return
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
}

function xpForLevel(level: number) {
  return level * 100
}

function updateStreak(progress: StoredUserProgress): StoredUserProgress {
  const today = new Date().toISOString().slice(0, 10)
  if (progress.lastActivityDate === today) return progress

  let streak = progress.streak
  if (progress.lastActivityDate) {
    const last = new Date(progress.lastActivityDate)
    const now = new Date(today)
    const diffDays = Math.floor(
      (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
    )
    streak = diffDays === 1 ? streak + 1 : 1
  } else {
    streak = 1
  }

  return { ...progress, streak, lastActivityDate: today }
}

export function awardXP(state: UserState, amount: number): UserState {
  let progress = updateStreak(state.progress)
  const xp = progress.xp + amount
  let level = progress.level
  while (xp >= xpForLevel(level)) {
    level += 1
  }
  progress = { ...progress, xp, level }
  return evaluateBadges({ ...state, progress })
}

function progressSnapshot(state: UserState): UserProgressSnapshot {
  return {
    completedLessonIds: state.lessonProgress.map((l) => l.lessonId),
    activePathId: state.progress.activePathId,
  }
}

function recalcPathProgress(
  progress: StoredUserProgress,
  pathId: string,
  completedLessonIds: string[]
): StoredUserProgress {
  const percent = computePathProgress(pathId, {
    completedLessonIds,
    activePathId: progress.activePathId,
  })
  return {
    ...progress,
    pathProgress: { ...progress.pathProgress, [pathId]: percent },
  }
}

export function startPath(state: UserState, pathId: string): UserState {
  const progress = {
    ...updateStreak(state.progress),
    activePathId: pathId,
  }
  const ids = state.lessonProgress.map((l) => l.lessonId)
  return { ...state, progress: recalcPathProgress(progress, pathId, ids) }
}

export function completeLesson(
  state: UserState,
  lessonId: string,
  xpReward: number,
  pathId?: string
): UserState {
  if (state.lessonProgress.some((l) => l.lessonId === lessonId)) return state

  let next = awardXP(state, xpReward)
  next = {
    ...next,
    lessonProgress: [
      ...next.lessonProgress,
      {
        lessonId,
        completedAt: new Date().toISOString(),
        xpEarned: xpReward,
      },
    ],
  }

  const lesson = getLessonById(lessonId)
  const resolvedPathId = pathId ?? lesson?.pathId
  if (resolvedPathId) {
    const ids = next.lessonProgress.map((l) => l.lessonId)
    next = {
      ...next,
      progress: recalcPathProgress(next.progress, resolvedPathId, ids),
    }
  }

  return next
}

export function saveQuizAttempt(
  state: UserState,
  attempt: Omit<StoredQuizAttempt, "id" | "completedAt">,
  pathId?: string,
  lessonId?: string
): UserState {
  let next: UserState = {
    ...state,
    quizAttempts: [
      ...state.quizAttempts,
      {
        ...attempt,
        id: crypto.randomUUID(),
        completedAt: new Date().toISOString(),
      },
    ],
  }

  const quiz = getQuizById(attempt.quizId)
  const resolvedLessonId = lessonId ?? quiz?.lessonId
  if (attempt.passed && resolvedLessonId) {
    const lesson = getLessonById(resolvedLessonId)
    next = completeLesson(
      next,
      resolvedLessonId,
      attempt.xpEarned,
      pathId ?? lesson?.pathId
    )
  } else if (attempt.passed && attempt.xpEarned > 0) {
    next = awardXP(next, attempt.xpEarned)
  }

  return next
}

export function saveDrillSession(
  state: UserState,
  session: Omit<StoredDrillSession, "id" | "completedAt">,
  lessonId?: string
): UserState {
  let next: UserState = {
    ...state,
    drillSessions: [
      ...state.drillSessions,
      {
        ...session,
        id: crypto.randomUUID(),
        completedAt: new Date().toISOString(),
      },
    ],
  }

  next = evaluateBadges(next)

  if (lessonId) {
    const lesson = getLessonById(lessonId)
    next = completeLesson(
      next,
      lessonId,
      lesson?.xpReward ?? 60,
      lesson?.pathId
    )
  } else {
    next = awardXP(next, Math.round(session.score / 10))
  }

  return next
}

export function createJournalEntry(
  state: UserState,
  entry: Omit<JournalEntry, "id" | "createdAt">
): UserState {
  return {
    ...state,
    journalEntries: [
      {
        ...entry,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      },
      ...state.journalEntries,
    ],
  }
}

export function evaluateBadges(state: UserState): UserState {
  const earned = new Set(state.earnedBadgeIds)
  const drillCount = state.drillSessions.length
  const lessonCount = state.lessonProgress.length

  if (drillCount >= 1) earned.add("first-drill")
  if (
    state.drillSessions.filter((d) => d.drillType === "identify_support").length >= 1
  ) {
    earned.add("support-spotter")
  }
  if (
    state.drillSessions.filter((d) => d.drillType === "place_entry_sl_tp").length >= 3
  ) {
    earned.add("risk-manager")
  }
  if (
    lessonCount >= 5 &&
    state.lessonProgress.some((l) => l.lessonId === "tf-m3-drill-trend")
  ) {
    earned.add("break-retest-beginner")
  }
  if (state.progress.streak >= 7) earned.add("seven-day-streak")

  return { ...state, earnedBadgeIds: [...earned] }
}

export function getLevelTitle(level: number): string {
  const titles: Record<number, string> = {
    1: "Chart Curious",
    2: "Candle Reader",
    3: "Level Spotter",
    4: "Setup Scout",
    5: "Pattern Learner",
  }
  return titles[level] ?? `Level ${level} Trader`
}

export function getXpProgressPercent(progress: StoredUserProgress): number {
  const currentLevelXp = (progress.level - 1) * 100
  const nextLevelXp = progress.level * 100
  const range = nextLevelXp - currentLevelXp
  const current = progress.xp - currentLevelXp
  return Math.min(100, Math.round((current / range) * 100))
}

export function computeDashboardStats(state: UserState): UserProgress {
  const snapshot = progressSnapshot(state)
  const quizScores = state.quizAttempts.map((a) => a.score)
  const drillScores = state.drillSessions.map((d) => d.score)
  const quizAvg =
    quizScores.length > 0
      ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
      : 0
  const drillAvg =
    drillScores.length > 0
      ? Math.round(drillScores.reduce((a, b) => a + b, 0) / drillScores.length)
      : 0

  const activePathId = state.progress.activePathId ?? "trading-foundations"
  const pathPercent = computePathProgress(activePathId, snapshot)
  const nextLesson = getNextIncompleteLesson(activePathId, snapshot)
  const allLessons = getAllLessons()
  const readingLessons = allLessons.filter(
    (l) => l.lessonType === "reading" || l.lessonType === "interactive"
  )

  const recommendedLessonId = getRecommendedLessonId(snapshot)
  const pathMeta = getPathBySlug(activePathId)

  return {
    level: state.progress.level,
    xp: state.progress.xp,
    xpForCurrentLevel: (state.progress.level - 1) * 100,
    xpForNextLevel: state.progress.level * 100,
    streak: state.progress.streak,
    lessonsCompleted: state.lessonProgress.length,
    totalLessons: readingLessons.length,
    drillsCompleted: state.drillSessions.length,
    quizzesCompleted: state.quizAttempts.length,
    quizAverageScore: quizAvg,
    accuracy: drillAvg,
    weakestSkill:
      state.drillSessions.length === 0 ? "" : "Complete more drills to identify",
    recommendedLessonId,
    activePathId,
    pathProgressPercent: pathPercent,
    nextSyllabusItemId: nextLesson?.id ?? "",
    recommendedAction: state.progress.activePathId
      ? nextLesson
        ? `Continue ${pathMeta?.title ?? "your path"}: ${nextLesson.title}`
        : "Explore another learning path"
      : "Start Trading Foundations",
    badgeIds: state.earnedBadgeIds,
  }
}

export function isLessonCompleted(state: UserState, lessonId: string) {
  return state.lessonProgress.some((l) => l.lessonId === lessonId)
}

export function isSyllabusItemCompleted(state: UserState, itemId: string) {
  return state.progress.completedSyllabusItems.includes(itemId)
}

export function getPathProgressPercent(state: UserState, pathId: string) {
  return computePathProgress(pathId, progressSnapshot(state))
}

export function isBadgeEarned(state: UserState, badgeId: string) {
  return state.earnedBadgeIds.includes(badgeId)
}

export type { UserState, StoredDrillSession, StoredQuizAttempt, StoredLessonProgress, StoredUserProgress } from "./types"
