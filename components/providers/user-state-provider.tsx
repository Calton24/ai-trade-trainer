"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { useMotivation } from "@/components/habits/motivation-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { trackFirstLessonCompleted, trackLessonCompleted, trackQuizCompleted } from "@/lib/analytics/events"
import type {
  BookLabStats,
  LibraryStats,
  LibraryBookStats,
} from "@/lib/book-lab/types"
import { getLibraryConceptById } from "@/content/library"
import { getLessonById } from "@/content/registry"
import { isLessonUnlocked as checkLessonUnlocked } from "@/lib/course/unlocks"
import type { JournalEntry, UserProgress } from "@/lib/types"
import {
  awardXP,
  completeBookConcept,
  completeLesson,
  completeTrendLesson,
  computeBookLabStats,
  computeLibraryStats,
  computeAllLibraryBookStats,
  computeDashboardStats,
  computeFlashcardStats,
  computeTrendSpotterStats,
  computeStrategyWikiStats,
  computeLearningMapStats,
  computeTraderReadinessStats,
  computeSimulatorStats,
  recordSimulatorAttempt,
  isSimulatorStageUnlocked,
  recordPatternAttempt as savePatternAttempt,
  computePatternRecognitionStats,
  computeSkillProfile,
  getDailyTrainingPlan,
  getAdaptiveRecommendations,
  getSkillDailyChallenge,
  computeWeeklyReport,
  analyzeJournal,
  bumpPracticeStreak,
  completeDailyTrainingItem as markDailyTrainingItem,
  claimDailyTrainingBonus as claimDailyBonus,
  recordExecutionAttempt as saveExecutionAttempt,
  computeExecutionStats,
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
  createEmptyUserState,
  loadUserState,
  normalizeUserState,
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
import type { ResetSection } from "@/lib/user-state/reset"
import {
  claimChallengeReward,
  finalizeProgression,
  recordDailyLogin,
} from "@/lib/user-state/gamification"
import { XP_REWARDS } from "@/lib/progression/levels"
import {
  getProgressionSnapshot,
  type ProgressionSnapshot,
} from "@/lib/progression"
import {
  getLeaderboard,
  type LeaderboardPeriod,
  type LeaderboardResult,
} from "@/lib/leaderboard"
import {
  computeBehavioralCompetence,
  resetWithArchive,
  unlockSimulatedTrading,
  unlockLivePrep,
  passGoLiveChecklistItem,
} from "@/lib/competence"
import type { CompetenceScores, GoLiveChecklistField } from "@/lib/competence"
import { createClientIfConfigured } from "@/lib/supabase/client"
import {
  archiveProgressReset,
  fetchLearningState,
  saveLearningState,
} from "@/lib/supabase/sync"
import { syncNewActivityLogEvents } from "@/lib/data/activity-service"
import { syncGamificationState } from "@/lib/data/gamification-sync-client"
import {
  clearAnonymousProgress,
  isCloudPersistenceActive,
} from "@/lib/user-state/persistence"
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
import type { PatternRecognitionStats } from "@/lib/user-state/pattern-recognition"
import type { StoredPatternAttempt } from "@/lib/user-state/pattern-recognition"
import type {
  AdaptiveRecommendation,
  DailyChallenge,
  DailyTrainingPlan,
  JournalInsight,
  SkillProfile,
  WeeklyReport,
} from "@/lib/skills/types"
import type { ExecutionLabStats, StoredExecutionAttempt } from "@/lib/execution-lab/types"
import type { SimulatorStats, SimulatorSessionAttempt } from "@/lib/simulator/types"
import type { TraderReadinessStats } from "@/lib/trader-readiness/types"

interface UserStateContextValue {
  state: UserState
  hydrated: boolean
  stats: UserProgress
  globalSnapshot: ReturnType<typeof getGlobalProgressSnapshot>
  reset: () => void
  resetSectionProgress: (section: ResetSection) => void
  syncStatus: "local" | "synced" | "syncing"
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
  recordPatternAttempt: (
    attempt: Omit<StoredPatternAttempt, "id" | "completedAt">
  ) => void
  patternRecognitionStats: PatternRecognitionStats
  skillProfile: SkillProfile
  dailyTrainingPlan: DailyTrainingPlan
  adaptiveRecommendations: AdaptiveRecommendation[]
  dailyChallenge: DailyChallenge
  weeklyReport: WeeklyReport
  journalInsights: JournalInsight[]
  completeDailyTrainingItem: (itemId: string) => void
  claimDailyTrainingBonus: () => void
  recordExecutionAttempt: (
    attempt: Omit<StoredExecutionAttempt, "id" | "completedAt">
  ) => void
  executionStats: ExecutionLabStats
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "createdAt">) => void
  isLessonDone: (lessonId: string) => boolean
  isLessonUnlocked: (lessonId: string, pathLocked: boolean) => boolean
  isSyllabusDone: (itemId: string) => boolean
  pathProgress: (pathId: string) => number
  hasBadge: (badgeId: string) => boolean
  bookLabStats: BookLabStats
  libraryStats: LibraryStats
  libraryBookStats: Record<string, LibraryBookStats>
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
  competenceScores: CompetenceScores
  progression: ProgressionSnapshot
  claimChallenge: (challengeId: string) => void
  getLeaderboardData: (period: LeaderboardPeriod) => LeaderboardResult
  unlockSimulated: () => void
  unlockLivePrepPhase: () => void
  passGoLiveCheck: (field: GoLiveChecklistField) => void
  simulatorStats: SimulatorStats
  isSimulatorStageUnlocked: (stageId: string) => boolean
  recordSimulatorSession: (
    attempt: Omit<SimulatorSessionAttempt, "id" | "completedAt">
  ) => void
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
  const { user, profile, isConfigured } = useAuth()
  const cloudSession = isCloudPersistenceActive(isConfigured, user?.id)

  const [state, setState] = useState<UserState>(() =>
    cloudSession ? createEmptyUserState() : loadUserState()
  )
  const [hydrated, setHydrated] = useState(false)
  const [syncStatus, setSyncStatus] = useState<"local" | "synced" | "syncing">(
    cloudSession ? "syncing" : "local"
  )
  const { pushEvents } = useMotivation()
  const syncedActivityIdsRef = useRef(new Set<string>())

  useEffect(() => {
    if (cloudSession) {
      setState(createEmptyUserState())
    } else {
      setState(loadUserState())
    }
    setHydrated(true)
  }, [cloudSession, user?.id])

  // Load cloud state when user signs in
  useEffect(() => {
    if (!hydrated || !user || !isConfigured) {
      setSyncStatus("local")
      return
    }

    let cancelled = false

    async function loadCloud() {
      const supabase = createClientIfConfigured()
      if (!supabase) return

      setSyncStatus("syncing")
      const remote = await fetchLearningState(supabase, user!.id)
      const next = remote ? normalizeUserState(remote) : createEmptyUserState()

      if (!cancelled) {
        setState(next)
        clearAnonymousProgress()
        if (!remote) {
          await saveLearningState(supabase, user!.id, next)
        }
        setSyncStatus("synced")
      }
    }

    void loadCloud()
    return () => {
      cancelled = true
    }
  }, [hydrated, user?.id, isConfigured])

  const syncToCloud = useCallback(
    async (next: UserState) => {
      if (!user || !isConfigured) return
      const supabase = createClientIfConfigured()
      if (!supabase) return

      setSyncStatus("syncing")
      await saveLearningState(supabase, user.id, next)
      const { facts } = await syncNewActivityLogEvents(
        supabase,
        user.id,
        next.activityLog,
        syncedActivityIdsRef.current
      )
      // Gamification/entitlement fields (XP, level, streak, rank, stats)
      // are no longer client-writable (migration 015). The client reports
      // only event *facts* here — the trusted server route
      // (/api/progress/record-activity) decides validity, idempotency, and
      // XP amount, then recomputes XP/level/streak/rank from its own
      // ledger via the service-role client.
      await syncGamificationState(next, facts)
      setSyncStatus("synced")
    },
    [user, isConfigured]
  )

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

  const persistLocalIfNeeded = useCallback(
    (next: UserState) => {
      if (!isCloudPersistenceActive(isConfigured, user?.id)) {
        saveUserState(next)
      }
    },
    [user?.id, isConfigured]
  )

  // Daily login bonus — granted at most once per calendar day.
  useEffect(() => {
    if (!hydrated) return
    let motivationEvents: Parameters<typeof pushEvents>[0] = []
    setState((prev) => {
      const { state: next, events } = recordDailyLogin(prev)
      motivationEvents = events
      if (events.length === 0) return prev
      persistLocalIfNeeded(next)
      void syncToCloud(next)
      return next
    })
    if (motivationEvents.length > 0) {
      pushEvents(motivationEvents)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated])

  const persistWithEvents = useCallback(
    (next: UserState, events: Parameters<typeof pushEvents>[0] = []) => {
      const { state: finalized, events: progressionEvents } =
        finalizeProgression(next)
      setState(finalized)
      persistLocalIfNeeded(finalized)
      void syncToCloud(finalized)
      const allEvents = [...events, ...progressionEvents]
      if (allEvents.length > 0) pushEvents(allEvents)
    },
    [pushEvents, syncToCloud, persistLocalIfNeeded]
  )

  const persist = useCallback(
    (next: UserState) => {
      setState(next)
      persistLocalIfNeeded(next)
      void syncToCloud(next)
    },
    [syncToCloud, persistLocalIfNeeded]
  )

  const reset = useCallback(() => {
    resetUserProgress()
    const fresh = createEmptyUserState()
    setState(fresh)
    void syncToCloud(fresh)
  }, [syncToCloud])

  const resetSectionProgress = useCallback(
    (section: ResetSection) => {
      const { next, archive } = resetWithArchive(state, section)
      const evaluated = evaluateBadges(next)
      persist(evaluated)

      if (user && isConfigured) {
        const supabase = createClientIfConfigured()
        if (supabase) {
          void archiveProgressReset(supabase, user.id, archive)
        }
      }
    },
    [state, persist, user, isConfigured]
  )

  const unlockSimulated = useCallback(() => {
    const next = unlockSimulatedTrading(state)
    if (next) persist(next)
  }, [state, persist])

  const unlockLivePrepPhase = useCallback(() => {
    const next = unlockLivePrep(state)
    if (next) persist(next)
  }, [state, persist])

  const passGoLiveCheck = useCallback(
    (field: GoLiveChecklistField) => {
      const next = passGoLiveChecklistItem(state, field)
      persist(next)
    },
    [state, persist]
  )

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
    const libraryStats = computeLibraryStats(state)
    const libraryBookStats = computeAllLibraryBookStats(state)
    const flashcardStats = computeFlashcardStats(state)
    const trendSpotterStats = computeTrendSpotterStats(state)
    const strategyWikiStats = computeStrategyWikiStats(state.strategyWiki)
    const globalSnapshot = getGlobalProgressSnapshot(state)
    const learningMapStats = computeLearningMapStats(state)
    const traderReadinessStats = computeTraderReadinessStats(state)
    const competenceScores = computeBehavioralCompetence(state)
    const simulatorStats = computeSimulatorStats(state)
    const patternRecognitionStats = computePatternRecognitionStats(state)
    const skillProfile = computeSkillProfile(state)
    const dailyTrainingPlan = getDailyTrainingPlan(state)
    const adaptiveRecommendations = getAdaptiveRecommendations(state)
    const dailyChallenge = getSkillDailyChallenge(state)
    const weeklyReport = computeWeeklyReport(state)
    const journalInsights = analyzeJournal(state)
    const executionStats = computeExecutionStats(state)
    const progression = getProgressionSnapshot(state)
    const displayName = profile?.name ?? "You"

    return {
      state,
      hydrated,
      stats,
      progression,
      claimChallenge: (challengeId) => {
        const { state: next, events } = claimChallengeReward(state, challengeId)
        if (events.length > 0) persistWithEvents(next, events)
      },
      getLeaderboardData: (period) =>
        getLeaderboard(state, period, displayName, { includeSeeded: false }),
      bookLabStats,
      libraryStats,
      libraryBookStats,
      flashcardStats,
      trendSpotterStats,
      strategyWikiStats,
      globalSnapshot,
      learningMapStats,
      traderReadinessStats,
      competenceScores,
      patternRecognitionStats,
      skillProfile,
      dailyTrainingPlan,
      adaptiveRecommendations,
      dailyChallenge,
      weeklyReport,
      journalInsights,
      executionStats,
      syncStatus,
      reset,
      resetSectionProgress,
      unlockSimulated,
      unlockLivePrepPhase,
      passGoLiveCheck,
      simulatorStats,
      isSimulatorStageUnlocked: (stageId) =>
        isSimulatorStageUnlocked(state, stageId as import("@/lib/simulator/types").SimulatorStageId),
      recordSimulatorSession: (attempt) => {
        const { state: next } = recordSimulatorAttempt(state, attempt)
        const withXp = awardXP(next, attempt.xpEarned)
        persistLearning(withXp)
      },
      startLearningPath: (pathId) => persist(startPath(state, pathId)),
      markLessonComplete: (lessonId, xpReward, pathId) => {
        const isFirstLesson = state.lessonProgress.length === 0
        persistLearning(completeLesson(state, lessonId, xpReward, pathId))
        trackLessonCompleted({ lessonId, source: pathId ?? undefined })
        if (isFirstLesson) trackFirstLessonCompleted({ lessonId })
      },
      recordQuizAttempt: (attempt, pathId, lessonId) => {
        persistLearning(saveQuizAttempt(state, attempt, pathId, lessonId))
        trackQuizCompleted({
          quizId: attempt.quizId,
          score: attempt.score,
          passed: attempt.score >= 70,
        })
      },
      recordDrillSession: (session, lessonId) =>
        persistLearning(saveDrillSession(state, session, lessonId)),
      recordPatternAttempt: (attempt) => {
        let next = savePatternAttempt(state, attempt)
        next = bumpPracticeStreak(next)
        const withXp = awardXP(next, 10)
        persistLearning(withXp)
      },
      completeDailyTrainingItem: (itemId) => {
        persist(markDailyTrainingItem(state, itemId))
      },
      claimDailyTrainingBonus: () => {
        const next = claimDailyBonus(state)
        if (next.dailyTraining?.bonusClaimed && !state.dailyTraining?.bonusClaimed) {
          persistLearning(awardXP(next, next.dailyTraining ? 100 : 0))
        } else {
          persist(next)
        }
      },
      recordExecutionAttempt: (attempt) => {
        let next = saveExecutionAttempt(state, attempt)
        next = bumpPracticeStreak(next)
        persistLearning(awardXP(next, Math.round(attempt.executionScore / 5)))
      },
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
        const concept = getLibraryConceptById(conceptId)
        let next = completeBookConcept(state, conceptId)
        next = awardXP(next, concept?.xpReward ?? XP_REWARDS.bookConceptComplete)
        persistLearning(next)
      },
      recordBookQuiz: (attempt) => {
        let next = recordBookQuizAttempt(state, attempt)
        if (attempt.passed) {
          next = awardXP(
            next,
            attempt.score >= 100
              ? XP_REWARDS.perfectQuiz
              : XP_REWARDS.quizPassed
          )
        }
        persistLearning(next)
      },
      recordBookPractice: (drill) => {
        let next = recordBookPracticeDrill(state, drill)
        if (drill.score >= 60) next = awardXP(next, XP_REWARDS.strategyPractice)
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
        next = awardXP(next, XP_REWARDS.journalReflection)
        persistLearning(next)
      },
      setWeeklyTargetDays: (days) => {
        // Guard against no-op syncs: this is called both from explicit user
        // actions (goal-settings widget) and from settings-page hydration
        // (mirroring the server-stored value into local UserState on load).
        // The latter must never trigger a cloud sync/activity-record call —
        // only real changes should. Without this guard, hydration call
        // sites can spiral into an infinite `persist` loop; see
        // `setWeeklyTarget` in lib/user-state/activity.ts for the other half
        // of this fix.
        if (state.weeklyTarget.daysPerWeek === days) return
        persist(setWeeklyTarget(state, days))
      },
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
        let motivationEvents: Parameters<typeof pushEvents>[0] = []
        setState((prev) => {
          const { state: withSession } = completeFlashcardSession(prev, session)
          let next = awardXP(withSession, session.xpEarned)
          next = evaluateBadges(next)
          const finalized = finalizeProgression(next)
          next = finalized.state
          saveUserState(next)
          motivationEvents = [
            ...extractMotivationEvents(prev, next),
            ...finalized.events,
          ]
          if (
            prev.activityLog.length === 0 &&
            next.activityLog.length > 0 &&
            next.weeklyTarget.daysPerWeek === null
          ) {
            motivationEvents.push({ type: "weekly-target-prompt" })
          }
          return next
        })
        if (motivationEvents.length > 0) {
          pushEvents(motivationEvents)
        }
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
        next = awardXP(next, XP_REWARDS.lessonComplete)
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
  }, [state, hydrated, syncStatus, persist, persistLearning, persistWithEvents, reset, resetSectionProgress, unlockSimulated, unlockLivePrepPhase, passGoLiveCheck, pushEvents, profile])

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
