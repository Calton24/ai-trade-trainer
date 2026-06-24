"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import { useMotivation } from "@/components/habits/motivation-provider"
import type { BookLabStats } from "@/lib/book-lab/types"
import { getBookLabConceptById } from "@/content/book-lab"
import { getLessonById } from "@/content/registry"
import { isLessonUnlocked as checkLessonUnlocked } from "@/lib/course/unlocks"
import type { JournalEntry, UserProgress } from "@/lib/types"
import {
  awardXP,
  completeBookConcept,
  completeLesson,
  completeTrendLesson,
  computeBookLabStats,
  computeDashboardStats,
  computeFlashcardStats,
  computeTrendSpotterStats,
  computeStrategyWikiStats,
  computeLearningMapStats,
  computeTraderReadinessStats,
  recordReadinessAssessment as saveReadinessAssessment,
  completeFlashcardSession,
  completeStrategyLesson,
  createJournalEntry,
  evaluateBadges,
  extractMotivationEvents,
  getFeatureAccess,
  getGlobalProgressSnapshot,
  getLockInfo,
  getNodeAccessLevel,
  markFoundationCelebrated,
  getPathProgressPercent,
  isBadgeEarned,
  isBookConceptCompleted,
  isLessonCompleted,
  isStrategyLessonCompleted,
  isSyllabusItemCompleted,
  isTrendLessonCompleted,
  loadUserState,
  recordBookPracticeDrill,
  recordBookQuizAttempt,
  recordChartLabComplete,
  recordFlashcardReview,
  recordStrategyChallengeAttempt,
  recordStrategyPracticeAttempt,
  recordTrendChallengeAttempt,
  recordTrendExerciseAttempt,
  resetUserProgress,
  saveBookReflection,
  saveDrillSession,
  saveQuizAttempt,
  saveUserState,
  setWeeklyTarget,
  startPath,
  type UserState,
} from "@/lib/user-state"
import type {
  StoredBookPracticeDrill,
  StoredBookQuizAttempt,
  StoredDrillSession,
  StoredQuizAttempt,
} from "@/lib/user-state/types"
import type {
  FlashcardConfidence,
  FlashcardStats,
  StoredFlashcardSession,
} from "@/lib/flashcards/types"
import type { TrendSpotterStats } from "@/lib/trend-spotter/types"
import type { TrendClassification } from "@/lib/trend-spotter/types"
import type { LearningMapStats, LockInfo, AccessLevel } from "@/lib/learning-map/types"
import type { StrategyWikiStats } from "@/lib/strategy-wiki/types"
import type { TraderReadinessStats } from "@/lib/trader-readiness/types"

interface UserStateContextValue {
  state: UserState
  hydrated: boolean
  stats: UserProgress
  globalSnapshot: ReturnType<typeof getGlobalProgressSnapshot>
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
  bookLabStats: BookLabStats
  isBookConceptDone: (conceptId: string) => boolean
  markBookConceptComplete: (conceptId: string) => void
  recordBookQuiz: (
    attempt: Omit<StoredBookQuizAttempt, "id" | "completedAt">
  ) => void
  recordBookPractice: (
    drill: Omit<StoredBookPracticeDrill, "id" | "completedAt">
  ) => void
  saveBookReflectionEntry: (input: {
    conceptId: string
    conceptTitle: string
    note: string
    confidenceRating: 1 | 2 | 3 | 4 | 5
    mistakeTag: string
    journal?: Omit<JournalEntry, "id" | "createdAt">
  }) => void
  setWeeklyTargetDays: (days: number) => void
  recordChartLabActivity: (
    scenarioId: string,
    title: string,
    score: number
  ) => void
  flashcardStats: FlashcardStats
  recordFlashcardReview: (cardId: string, confidence: FlashcardConfidence) => void
  finishFlashcardSession: (
    session: Omit<StoredFlashcardSession, "id" | "completedAt">
  ) => void
  trendSpotterStats: TrendSpotterStats
  isTrendLessonDone: (lessonId: string) => boolean
  markTrendLessonComplete: (lessonId: string) => void
  recordTrendExercise: (
    attempt: Omit<
      import("@/lib/trend-spotter/types").TrendExerciseAttempt,
      "id" | "completedAt"
    > & { id?: string },
    scenarioClassification: TrendClassification
  ) => string
  recordTrendChallenge: (
    attempt: Omit<
      import("@/lib/trend-spotter/types").TrendChallengeAttempt,
      "id" | "completedAt"
    > & { id?: string }
  ) => string
  strategyWikiStats: StrategyWikiStats
  isStrategyLessonDone: (strategyId: string) => boolean
  markStrategyLessonComplete: (strategyId: string, title: string) => void
  recordStrategyPractice: (
    attempt: Omit<
      import("@/lib/strategy-wiki/types").StrategyPracticeAttempt,
      "id" | "completedAt"
    > & { id?: string }
  ) => string
  recordStrategyChallenge: (
    attempt: Omit<
      import("@/lib/strategy-wiki/types").StrategyChallengeAttempt,
      "id" | "completedAt"
    > & { id?: string }
  ) => string
  learningMapStats: LearningMapStats
  traderReadinessStats: TraderReadinessStats
  recordReadinessAssessment: (
    attempt: Omit<
      import("@/lib/trader-readiness/types").ReadinessAssessmentAttempt,
      | "id"
      | "completedAt"
      | "overallScore"
      | "traderLevel"
      | "weakestPillar"
      | "strongestPillar"
    > & { id?: string }
  ) => string
  celebrateFoundation: () => void
  getNodeAccess: (nodeId: string) => AccessLevel
  getFeatureAccessLevel: (featureId: string) => AccessLevel
  getContentLockInfo: (nodeId: string) => LockInfo
}

const UserStateContext = createContext<UserStateContextValue | null>(null)

export function UserStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserState>(() => loadUserState())
  const [hydrated, setHydrated] = useState(false)
  const { pushEvents } = useMotivation()

  useEffect(() => {
    setState(loadUserState())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (
      state.activityLog.length > 0 &&
      state.weeklyTarget.daysPerWeek === null &&
      typeof sessionStorage !== "undefined" &&
      !sessionStorage.getItem("tt_weekly_target_prompt_shown")
    ) {
      sessionStorage.setItem("tt_weekly_target_prompt_shown", "1")
      pushEvents([{ type: "weekly-target-prompt" }])
    }
  }, [hydrated, state.activityLog.length, state.weeklyTarget.daysPerWeek, pushEvents])

  const persistWithEvents = useCallback(
    (next: UserState, events: Parameters<typeof pushEvents>[0] = []) => {
      setState(next)
      saveUserState(next)
      if (events.length > 0) pushEvents(events)
    },
    [pushEvents]
  )

  const persist = useCallback(
    (next: UserState) => {
      setState(next)
      saveUserState(next)
    },
    []
  )

  const reset = useCallback(() => {
    resetUserProgress()
    const fresh = loadUserState()
    setState(fresh)
  }, [])

  const persistLearning = useCallback(
    (next: UserState) => {
      const evaluated = evaluateBadges(next)
      const events = extractMotivationEvents(state, evaluated)
      if (
        state.activityLog.length === 0 &&
        evaluated.activityLog.length > 0 &&
        evaluated.weeklyTarget.daysPerWeek === null
      ) {
        events.push({ type: "weekly-target-prompt" })
      }
      persistWithEvents(evaluated, events)
    },
    [state, persistWithEvents]
  )

  const value = useMemo<UserStateContextValue>(() => {
    const stats = computeDashboardStats(state)
    const bookLabStats = computeBookLabStats(state)
    const flashcardStats = computeFlashcardStats(state)
    const trendSpotterStats = computeTrendSpotterStats(state)
    const strategyWikiStats = computeStrategyWikiStats(state.strategyWiki)
    const globalSnapshot = getGlobalProgressSnapshot(state)
    const learningMapStats = computeLearningMapStats(state)
    const traderReadinessStats = computeTraderReadinessStats(state)

    return {
      state,
      hydrated,
      stats,
      bookLabStats,
      flashcardStats,
      trendSpotterStats,
      strategyWikiStats,
      globalSnapshot,
      learningMapStats,
      traderReadinessStats,
      reset,
      startLearningPath: (pathId) => persist(startPath(state, pathId)),
      markLessonComplete: (lessonId, xpReward, pathId) =>
        persistLearning(completeLesson(state, lessonId, xpReward, pathId)),
      recordQuizAttempt: (attempt, pathId, lessonId) =>
        persistLearning(saveQuizAttempt(state, attempt, pathId, lessonId)),
      recordDrillSession: (session, lessonId) =>
        persistLearning(saveDrillSession(state, session, lessonId)),
      addJournalEntry: (entry) =>
        persistLearning(createJournalEntry(state, entry)),
      isLessonDone: (lessonId) => isLessonCompleted(state, lessonId),
      isLessonUnlocked: (lessonId, pathLocked) => {
        const lesson = getLessonById(lessonId)
        if (!lesson) return false
        return checkLessonUnlocked(
          lesson,
          {
            completedLessonIds: state.lessonProgress.map((l) => l.lessonId),
            activePathId: state.progress.activePathId,
          },
          pathLocked
        )
      },
      isSyllabusDone: (itemId) => isSyllabusItemCompleted(state, itemId),
      pathProgress: (pathId) => getPathProgressPercent(state, pathId),
      hasBadge: (badgeId) => isBadgeEarned(state, badgeId),
      isBookConceptDone: (conceptId) => isBookConceptCompleted(state, conceptId),
      markBookConceptComplete: (conceptId) => {
        if (isBookConceptCompleted(state, conceptId)) return
        const concept = getBookLabConceptById(conceptId)
        let next = completeBookConcept(state, conceptId)
        next = awardXP(next, concept?.xpReward ?? 25)
        persistLearning(next)
      },
      recordBookQuiz: (attempt) => {
        let next = recordBookQuizAttempt(state, attempt)
        if (attempt.passed) next = awardXP(next, 15)
        persistLearning(next)
      },
      recordBookPractice: (drill) => {
        let next = recordBookPracticeDrill(state, drill)
        if (drill.score >= 60) next = awardXP(next, 20)
        persistLearning(next)
      },
      saveBookReflectionEntry: (input) => {
        let next = saveBookReflection(
          state,
          {
            conceptId: input.conceptId,
            conceptTitle: input.conceptTitle,
            note: input.note,
            confidenceRating: input.confidenceRating,
            mistakeTag: input.mistakeTag,
          },
          input.journal
        )
        next = awardXP(next, 10)
        persistLearning(next)
      },
      setWeeklyTargetDays: (days) =>
        persist(setWeeklyTarget(state, days)),
      recordChartLabActivity: (scenarioId, title, score) => {
        const { state: next, events } = recordChartLabComplete(
          state,
          scenarioId,
          title,
          score
        )
        const evaluated = evaluateBadges(next)
        const allEvents = [
          ...events,
          ...extractMotivationEvents(state, evaluated),
        ]
        if (
          state.activityLog.length === 0 &&
          evaluated.activityLog.length > 0 &&
          evaluated.weeklyTarget.daysPerWeek === null
        ) {
          allEvents.push({ type: "weekly-target-prompt" })
        }
        persistWithEvents(evaluated, allEvents)
      },
      recordFlashcardReview: (cardId, confidence) => {
        const next = recordFlashcardReview(state, cardId, confidence)
        persist(next)
      },
      finishFlashcardSession: (session) => {
        setState((prev) => {
          const { state: withSession } = completeFlashcardSession(prev, session)
          let next = awardXP(withSession, session.xpEarned)
          next = evaluateBadges(next)
          saveUserState(next)
          const events = extractMotivationEvents(prev, next)
          if (
            prev.activityLog.length === 0 &&
            next.activityLog.length > 0 &&
            next.weeklyTarget.daysPerWeek === null
          ) {
            events.push({ type: "weekly-target-prompt" })
          }
          if (events.length > 0) pushEvents(events)
          return next
        })
      },
      isTrendLessonDone: (lessonId) => isTrendLessonCompleted(state, lessonId),
      markTrendLessonComplete: (lessonId) => {
        if (isTrendLessonCompleted(state, lessonId)) return
        persistLearning(completeTrendLesson(state, lessonId))
      },
      recordTrendExercise: (attempt, scenarioClassification) => {
        const { state: next, sessionId } = recordTrendExerciseAttempt(
          state,
          attempt,
          scenarioClassification
        )
        persistLearning(next)
        return sessionId
      },
      recordTrendChallenge: (attempt) => {
        const { state: next, sessionId } = recordTrendChallengeAttempt(
          state,
          attempt
        )
        const withXp = awardXP(next, attempt.xpEarned)
        persistLearning(withXp)
        return sessionId
      },
      isStrategyLessonDone: (strategyId) =>
        isStrategyLessonCompleted(state, strategyId),
      markStrategyLessonComplete: (strategyId, title) => {
        if (isStrategyLessonCompleted(state, strategyId)) return
        let next = completeStrategyLesson(state, strategyId, title)
        next = awardXP(next, 25)
        persistLearning(next)
      },
      recordStrategyPractice: (attempt) => {
        const { state: next, sessionId } = recordStrategyPracticeAttempt(
          state,
          attempt
        )
        persistLearning(evaluateBadges(next))
        return sessionId
      },
      recordStrategyChallenge: (attempt) => {
        const { state: next, sessionId } = recordStrategyChallengeAttempt(
          state,
          attempt
        )
        persistLearning(evaluateBadges(next))
        return sessionId
      },
      recordReadinessAssessment: (attempt) => {
        const { state: next, sessionId } = saveReadinessAssessment(
          state,
          attempt
        )
        const withXp = awardXP(next, attempt.xpEarned ?? 0)
        persistLearning(withXp)
        return sessionId
      },
      celebrateFoundation: () => {
        if (state.learningMap.foundationCelebrated) return
        persist(markFoundationCelebrated(state))
      },
      getNodeAccess: (nodeId) => getNodeAccessLevel(state, nodeId),
      getFeatureAccessLevel: (featureId) => getFeatureAccess(state, featureId),
      getContentLockInfo: (nodeId) => getLockInfo(state, nodeId),
    }
  }, [state, hydrated, persist, persistLearning, persistWithEvents, reset, pushEvents])

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
