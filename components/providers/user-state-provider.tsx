"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import type { AIReview, JournalEntry, UserProgress } from "@/lib/types"
import { getLessonById } from "@/content/registry"
import { isLessonUnlocked as checkLessonUnlocked } from "@/lib/course/unlocks"
import {
  completeLesson,
  computeDashboardStats,
  createJournalEntry,
  getPathProgressPercent,
  isBadgeEarned,
  isLessonCompleted,
  isSyllabusItemCompleted,
  loadUserState,
  resetUserProgress,
  saveDrillSession,
  saveQuizAttempt,
  saveUserState,
  startPath,
  type UserState,
} from "@/lib/user-state"
import type {
  StoredDrillSession,
  StoredQuizAttempt,
} from "@/lib/user-state/types"

interface UserStateContextValue {
  state: UserState
  hydrated: boolean
  stats: UserProgress
  reset: () => void
  startLearningPath: (pathId: string) => void
  markLessonComplete: (
    lessonId: string,
    xpReward: number,
    pathId?: string
  ) => void
  recordQuizAttempt: (
    attempt: Omit<StoredQuizAttempt, "id" | "completedAt">,
    pathId?: string,
    lessonId?: string
  ) => void
  recordDrillSession: (
    session: Omit<StoredDrillSession, "id" | "completedAt">,
    lessonId?: string
  ) => void
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "createdAt">) => void
  isLessonDone: (lessonId: string) => boolean
  isLessonUnlocked: (lessonId: string, pathLocked: boolean) => boolean
  isSyllabusDone: (itemId: string) => boolean
  pathProgress: (pathId: string) => number
  hasBadge: (badgeId: string) => boolean
}

const UserStateContext = createContext<UserStateContextValue | null>(null)

export function UserStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserState>(() => loadUserState())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setState(loadUserState())
    setHydrated(true)
  }, [])

  const persist = useCallback((next: UserState) => {
    setState(next)
    saveUserState(next)
  }, [])

  const reset = useCallback(() => {
    resetUserProgress()
    const fresh = loadUserState()
    setState(fresh)
  }, [])

  const value = useMemo<UserStateContextValue>(() => {
    const stats = computeDashboardStats(state)

    return {
      state,
      hydrated,
      stats,
      reset,
      startLearningPath: (pathId) => persist(startPath(state, pathId)),
      markLessonComplete: (lessonId, xpReward, pathId) =>
        persist(completeLesson(state, lessonId, xpReward, pathId)),
      recordQuizAttempt: (attempt, pathId, lessonId) =>
        persist(saveQuizAttempt(state, attempt, pathId, lessonId)),
      recordDrillSession: (session, lessonId) =>
        persist(saveDrillSession(state, session, lessonId)),
      addJournalEntry: (entry) => persist(createJournalEntry(state, entry)),
      isLessonDone: (lessonId) => isLessonCompleted(state, lessonId),
      isLessonUnlocked: (lessonId, pathLocked) => {
        const lesson = getLessonById(lessonId)
        if (!lesson) return false
        return checkLessonUnlocked(lesson, {
          completedLessonIds: state.lessonProgress.map((l) => l.lessonId),
          activePathId: state.progress.activePathId,
        }, pathLocked)
      },
      isSyllabusDone: (itemId) => isSyllabusItemCompleted(state, itemId),
      pathProgress: (pathId) => getPathProgressPercent(state, pathId),
      hasBadge: (badgeId) => isBadgeEarned(state, badgeId),
    }
  }, [state, hydrated, persist, reset])

  return (
    <UserStateContext.Provider value={value}>
      {children}
    </UserStateContext.Provider>
  )
}

export function useUserState() {
  const ctx = useContext(UserStateContext)
  if (!ctx) {
    throw new Error("useUserState must be used within UserStateProvider")
  }
  return ctx
}
