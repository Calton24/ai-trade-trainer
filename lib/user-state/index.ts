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
import {
  levelFromXP,
  getLevelTitle,
  getXpProgressPercent,
} from "@/lib/progression/levels"

import type {
  StoredDrillSession,
  StoredLessonProgress,
  StoredQuizAttempt,
  StoredUserProgress,
  UserState,
} from "./types"
import {
  getInitialBookLabProgress,
  getInitialGamificationState,
  getInitialLearningMapState,
  STORAGE_KEYS,
} from "./types"
import {
  getInitialFlashcardState,
  computeFlashcardStats,
  completeFlashcardSession,
  recordFlashcardReview,
} from "./flashcards"
import {
  getInitialTrendSpotterState,
  computeTrendSpotterStats,
  completeTrendLesson,
  recordTrendExerciseAttempt,
  recordTrendChallengeAttempt,
  isTrendLessonCompleted,
} from "./trend-spotter"
import {
  getInitialStrategyWikiState,
  computeStrategyWikiStats,
  completeStrategyLesson,
  recordStrategyPracticeAttempt,
  recordStrategyChallengeAttempt,
  isStrategyLessonCompleted,
} from "./strategy-wiki"
import {
  getInitialTraderReadinessState,
  computeTraderReadinessStats,
  recordReadinessAssessment,
  recordPillarScore,
} from "./trader-readiness"
import {
  computeSimulatorStats,
  recordSimulatorAttempt,
  isSimulatorStageUnlocked,
} from "./simulator"
import { getDefaultPhaseState } from "@/lib/competence/live-trading-phases"
import { getInitialSimulatorState } from "@/lib/simulator/types"
import {
  calculateDailyStreak,
  calculateWeeklyTargetProgress,
  getGlobalProgressSnapshot,
  getInitialWeeklyStreak,
  getInitialWeeklyTarget,
  getTodayActivity,
  hasMadeProgressToday,
  recordLearningActivity,
  setWeeklyTarget as setWeeklyTargetState,
} from "./activity"

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

/** Fresh user state — no localStorage reads. Use for authenticated cloud sessions. */
export function createEmptyUserState(): UserState {
  return {
    progress: getInitialProgress(),
    lessonProgress: [],
    quizAttempts: [],
    drillSessions: [],
    journalEntries: [],
    earnedBadgeIds: [],
    bookLab: getInitialBookLabProgress(),
    activityLog: [],
    weeklyTarget: getInitialWeeklyTarget(),
    weeklyStreak: getInitialWeeklyStreak(),
    flashcards: getInitialFlashcardState(),
    trendSpotter: getInitialTrendSpotterState(),
    strategyWiki: getInitialStrategyWikiState(),
    learningMap: getInitialLearningMapState(),
    traderReadiness: getInitialTraderReadinessState(),
    liveTradingPhase: getDefaultPhaseState(),
    simulator: getInitialSimulatorState(),
    gamification: getInitialGamificationState(),
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
    bookLab: readJson(STORAGE_KEYS.bookLab, getInitialBookLabProgress()),
    activityLog: readJson(STORAGE_KEYS.activityLog, []),
    weeklyTarget: readJson(STORAGE_KEYS.weeklyTarget, getInitialWeeklyTarget()),
    weeklyStreak: readJson(STORAGE_KEYS.weeklyStreak, getInitialWeeklyStreak()),
    flashcards: readJson(STORAGE_KEYS.flashcardProgress, getInitialFlashcardState()),
    trendSpotter: readJson(
      STORAGE_KEYS.trendSpotterProgress,
      getInitialTrendSpotterState()
    ),
    strategyWiki: readJson(
      STORAGE_KEYS.strategyProgress,
      getInitialStrategyWikiState()
    ),
    learningMap: readJson(
      STORAGE_KEYS.learningMapProgress,
      getInitialLearningMapState()
    ),
    traderReadiness: readJson(
      STORAGE_KEYS.traderReadiness,
      getInitialTraderReadinessState()
    ),
    liveTradingPhase: readJson(
      STORAGE_KEYS.liveTradingPhase,
      getDefaultPhaseState()
    ),
    simulator: readJson(STORAGE_KEYS.simulator, getInitialSimulatorState()),
    gamification: readJson(
      STORAGE_KEYS.gamification,
      getInitialGamificationState()
    ),
  }
}

export function saveUserState(state: UserState) {
  writeJson(STORAGE_KEYS.progress, state.progress)
  writeJson(STORAGE_KEYS.lessonProgress, state.lessonProgress)
  writeJson(STORAGE_KEYS.quizAttempts, state.quizAttempts)
  writeJson(STORAGE_KEYS.drillSessions, state.drillSessions)
  writeJson(STORAGE_KEYS.journalEntries, state.journalEntries)
  writeJson(STORAGE_KEYS.badges, state.earnedBadgeIds)
  writeJson(STORAGE_KEYS.bookLab, state.bookLab)
  writeJson(STORAGE_KEYS.activityLog, state.activityLog)
  writeJson(STORAGE_KEYS.weeklyTarget, state.weeklyTarget)
  writeJson(STORAGE_KEYS.weeklyStreak, state.weeklyStreak)
  writeJson(STORAGE_KEYS.flashcardProgress, state.flashcards)
  writeJson(STORAGE_KEYS.flashcardSessions, state.flashcards.sessions)
  writeJson(STORAGE_KEYS.trendSpotterProgress, state.trendSpotter)
  writeJson(STORAGE_KEYS.trendSpotterSessions, {
    exercises: state.trendSpotter.exerciseAttempts,
    challenges: state.trendSpotter.challengeAttempts,
  })
  writeJson(
    STORAGE_KEYS.trendChallengeAttempts,
    state.trendSpotter.challengeAttempts
  )
  writeJson(STORAGE_KEYS.strategyProgress, state.strategyWiki)
  writeJson(STORAGE_KEYS.strategySessions, state.strategyWiki.practiceAttempts)
  writeJson(STORAGE_KEYS.strategyChallenges, state.strategyWiki.challengeAttempts)
  writeJson(STORAGE_KEYS.learningMapProgress, state.learningMap)
  writeJson(STORAGE_KEYS.traderReadiness, state.traderReadiness)
  writeJson(STORAGE_KEYS.liveTradingPhase, state.liveTradingPhase)
  writeJson(STORAGE_KEYS.simulator, state.simulator)
  writeJson(STORAGE_KEYS.gamification, state.gamification)
}

export function resetUserProgress() {
  if (typeof window === "undefined") return
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
}

function xpForLevel(level: number) {
  const thresholds = [0, 0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800]
  return thresholds[Math.min(level, thresholds.length - 1)] ?? (level - 1) * 100
}

export function awardXP(state: UserState, amount: number): UserState {
  const progress = state.progress
  const xp = progress.xp + amount
  const level = levelFromXP(xp)
  return evaluateBadges({
    ...state,
    progress: { ...progress, xp, level },
  })
}

export function setWeeklyTarget(state: UserState, daysPerWeek: number) {
  return setWeeklyTargetState(state, daysPerWeek)
}

export function recordChartLabComplete(
  state: UserState,
  scenarioId: string,
  title: string,
  score: number
) {
  const xp = Math.round(score / 10)
  let next = awardXP(state, xp)
  const { state: withActivity, events } = recordLearningActivity(next, {
    type: "chart-lab-complete",
    source: "chart-lab",
    title,
    entityId: scenarioId,
    xpAwarded: xp,
  })
  return { state: withActivity, events }
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
  const progress = { ...state.progress, activePathId: pathId }
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

  const lesson = getLessonById(lessonId)
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

  const resolvedPathId = pathId ?? lesson?.pathId
  if (resolvedPathId) {
    const ids = next.lessonProgress.map((l) => l.lessonId)
    next = {
      ...next,
      progress: recalcPathProgress(next.progress, resolvedPathId, ids),
    }
  }

  const { state: withActivity } = recordLearningActivity(next, {
    type: "lesson-complete",
    source: "paths",
    title: lesson?.title ?? "Lesson",
    entityId: lessonId,
    xpAwarded: xpReward,
  })

  return withActivity
}

export function saveQuizAttempt(
  state: UserState,
  attempt: Omit<StoredQuizAttempt, "id" | "completedAt">,
  pathId?: string,
  lessonId?: string
): UserState {
  const isFirstPass =
    attempt.passed &&
    !state.quizAttempts.some(
      (a) => a.quizId === attempt.quizId && a.passed
    )

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
  const xpToAward = isFirstPass ? attempt.xpEarned : Math.round(attempt.xpEarned / 4)

  if (attempt.passed && resolvedLessonId) {
    const lesson = getLessonById(resolvedLessonId)
    next = completeLesson(
      next,
      resolvedLessonId,
      xpToAward,
      pathId ?? lesson?.pathId
    )
  } else if (attempt.passed && xpToAward > 0) {
    next = awardXP(next, xpToAward)
    const { state: withActivity } = recordLearningActivity(next, {
      type: "quiz-complete",
      source: "quiz",
      title: quiz?.title ?? "Quiz",
      entityId: attempt.quizId,
      xpAwarded: xpToAward,
      score: attempt.score,
    })
    next = withActivity
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

  const xp = Math.round(session.score / 10)

  if (lessonId) {
    const lesson = getLessonById(lessonId)
    next = completeLesson(next, lessonId, lesson?.xpReward ?? 60, lesson?.pathId)
  } else {
    next = awardXP(next, xp)
    const { state: withActivity } = recordLearningActivity(next, {
      type: "chart-drill-complete",
      source: "training",
      title: session.drillTitle,
      entityId: session.drillType,
      xpAwarded: xp,
    })
    next = withActivity
  }

  return next
}

export function createJournalEntry(
  state: UserState,
  entry: Omit<JournalEntry, "id" | "createdAt">
): UserState {
  let next: UserState = {
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

  const { state: withActivity } = recordLearningActivity(next, {
    type: "journal-reflection",
    source: "journal",
    title: entry.setupPracticed || "Journal reflection",
    entityId: entry.conceptTitle ?? entry.setupPracticed,
    xpAwarded: 0,
  })

  return withActivity
}

export function evaluateBadges(state: UserState): UserState {
  const earned = new Set(state.earnedBadgeIds)
  const drillCount = state.drillSessions.length
  const lessonCount = state.lessonProgress.length
  const weekly = calculateWeeklyTargetProgress(state)

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
  if (calculateDailyStreak(state) >= 7) earned.add("seven-day-streak")
  if (state.bookLab.completedConceptIds.length >= 5) earned.add("book-lab-reader")
  if (state.activityLog.length >= 1) earned.add("first-learning-day")
  if (weekly.met && weekly.hasTargetSet) earned.add("first-weekly-target")
  if (weekly.completed >= 3 && weekly.hasTargetSet) earned.add("three-day-week")
  if (state.weeklyStreak.streak >= 2) earned.add("two-week-streak")
  if (state.weeklyStreak.streak >= 4) earned.add("four-week-streak")
  if (state.weeklyStreak.streak >= 8) earned.add("eight-week-streak")
  if (state.weeklyStreak.streak >= 12) {
    earned.add("twelve-week-streak")
    earned.add("consistent-trader")
  }

  const fc = state.flashcards
  const fcStats = computeFlashcardStats(state)
  if (fc.sessions.length >= 1) earned.add("first-flashcard-session")
  if (fc.sessions.some((s) => s.mode === "game10" || s.cardsReviewed >= 10)) {
    earned.add("ten-card-starter")
  }
  if (fc.sessions.some((s) => s.deckId.includes("chart"))) {
    earned.add("chart-card-rookie")
  }
  if (fcStats.totalReviewed >= 50) earned.add("fifty-cards-reviewed")
  if (fcStats.totalReviewed >= 100) earned.add("hundred-cards-reviewed")
  if (fcStats.masteredCount >= 10) earned.add("ten-cards-mastered")
  const riskReviews = Object.keys(fc.cardProgress).filter((id) =>
    id.includes("risk-management")
  ).length
  if (riskReviews >= 5) earned.add("risk-recall")
  const iccReviews = Object.keys(fc.cardProgress).filter((id) =>
    id.includes("-icc-")
  ).length
  if (iccReviews >= 5) earned.add("icc-recall")
  if (fc.sessions.length >= 4 && weekly.hasTargetSet) {
    earned.add("weekly-review-habit")
  }

  const ts = state.trendSpotter
  const tsStats = computeTrendSpotterStats(state)
  if (ts.completedLessonIds.length >= 1) earned.add("first-trend-lesson")
  if (ts.exerciseAttempts.length >= 1) earned.add("first-trend-exercise")
  if (ts.completedLessonIds.length >= 4) earned.add("trend-spotter-rookie")
  if (tsStats.strongestType === "uptrend" && ts.stats.uptrend.total >= 3) {
    earned.add("uptrend-reader")
  }
  if (tsStats.strongestType === "downtrend" && ts.stats.downtrend.total >= 3) {
    earned.add("downtrend-reader")
  }
  if (tsStats.strongestType === "range" && ts.stats.range.total >= 3) {
    earned.add("range-detector")
  }
  if (
    ts.exerciseAttempts.some(
      (a) => a.tradeDecision === "skip" && a.totalScore >= 70
    )
  ) {
    earned.add("clean-skip")
  }
  if (ts.challengeAttempts.some((a) => a.total >= 10)) {
    earned.add("ten-chart-challenge")
  }
  if (tsStats.classificationAccuracy >= 80 && tsStats.exercisesCompleted >= 5) {
    earned.add("eighty-trend-accuracy")
  }
  if (tsStats.classificationAccuracy >= 90 && tsStats.exercisesCompleted >= 10) {
    earned.add("ninety-trend-accuracy")
  }

  const sw = state.strategyWiki
  const swStats = computeStrategyWikiStats(sw)
  if (sw.completedStrategyIds.length >= 1) earned.add("first-strategy-learned")
  if (sw.practiceAttempts.length >= 1) earned.add("first-strategy-practice")
  if (
    sw.practiceAttempts.some((a) => a.strategyId === "break-retest")
  ) {
    earned.add("break-retest-rookie")
  }
  if (
    sw.practiceAttempts.some(
      (a) =>
        a.strategyId === "support-bounce" ||
        a.strategyId === "resistance-rejection"
    )
  ) {
    earned.add("support-resistance-rookie")
  }
  if (sw.practiceAttempts.some((a) => a.strategyId === "icc")) {
    earned.add("icc-rookie")
  }
  if (sw.practiceAttempts.length >= 10) earned.add("ten-strategy-drills")
  if (
    sw.practiceAttempts.some(
      (a) =>
        a.tradeDecision === "skip" && a.totalScore >= 70
    )
  ) {
    earned.add("trade-or-skip-discipline")
  }
  if (swStats.averageScore >= 80 && sw.practiceAttempts.length >= 5) {
    earned.add("eighty-strategy-accuracy")
  }
  if (
    Object.values(sw.strategyProgress).some(
      (p) =>
        p.masteryLevel === "competent" ||
        p.masteryLevel === "strong" ||
        p.masteryLevel === "mastered"
    )
  ) {
    earned.add("first-strategy-competent")
  }
  if (
    Object.values(sw.strategyProgress).some((p) => p.masteryLevel === "mastered")
  ) {
    earned.add("first-strategy-mastered")
  }

  const tr = state.traderReadiness
  if (tr.assessmentAttempts.length >= 1) earned.add("readiness-baseline")
  if (tr.assessmentAttempts.length >= 3) earned.add("readiness-tracker")
  if (tr.readinessXP >= 200) earned.add("readiness-dedicated")
  const latest = tr.assessmentAttempts[0]
  if (latest && latest.overallScore >= 80) earned.add("structured-trader")
  if (latest && latest.overallScore >= 95) earned.add("elite-readiness")
  if (latest && latest.pillarScores["risk-management"] >= 90) {
    earned.add("risk-management-expert")
  }
  if (latest && latest.pillarScores.psychology >= 80) {
    earned.add("psychology-warrior")
  }
  if (latest && latest.pillarScores["chart-reading"] >= 85) {
    earned.add("chart-reader-level-10")
  }

  const sim = state.simulator
  if (sim.attempts.length >= 1) earned.add("first-simulator-session")
  if (sim.completedStageIds.includes("chart-reading")) earned.add("trend-hunter")
  if (sim.completedStageIds.includes("trade-planning")) earned.add("sim-risk-planner")
  if (sim.completedStageIds.includes("trade-management")) earned.add("trade-manager")
  if (sim.chartsReviewed >= 100) earned.add("hundred-charts-reviewed")
  if (sim.tradesJournaled >= 100) earned.add("hundred-trades-journaled")
  if (sim.completedStageIds.length >= 5) earned.add("simulator-graduate")

  return { ...state, earnedBadgeIds: [...earned] }
}

export { getLevelTitle, getXpProgressPercent } from "@/lib/progression/levels"

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

export type { UserState, StoredDrillSession, StoredQuizAttempt, StoredLessonProgress, StoredUserProgress, StoredBookLabProgress } from "./types"

export {
  completeBookConcept,
  computeBookLabStats,
  getBookLabConceptProgressPercent,
  isBookConceptCompleted,
  recordBookPracticeDrill,
  recordBookQuizAttempt,
  saveBookReflection,
} from "./book-lab"

export {
  computeLibraryStats,
  computeLibraryBookStats,
  computeAllLibraryBookStats,
  getLibraryBook,
} from "./library"

export {
  computeFlashcardStats,
  completeFlashcardSession,
  recordFlashcardReview,
  getInitialFlashcardState,
} from "./flashcards"

export {
  computeTrendSpotterStats,
  completeTrendLesson,
  recordTrendExerciseAttempt,
  recordTrendChallengeAttempt,
  isTrendLessonCompleted,
  getInitialTrendSpotterState,
} from "./trend-spotter"

export {
  computeLearningMapStats,
  getAllStageProgress,
  getCurrentStageId,
  getFeatureAccess,
  getFoundationProgress,
  getLockInfo,
  getNodeAccessLevel,
  getRecommendedNextAction,
  getStageProgress,
  isNodeComplete,
  isStageCompleted,
  isStageUnlocked,
  markFoundationCelebrated,
  shouldCelebrateFoundation,
} from "@/lib/learning-map/unlocks"

export {
  computeStrategyWikiStats,
  completeStrategyLesson,
  recordStrategyPracticeAttempt,
  recordStrategyChallengeAttempt,
  isStrategyLessonCompleted,
  getInitialStrategyWikiState,
  getStrategyProgressRecord,
  getRecentStrategySessions,
  getContinuePractisingStrategy,
} from "./strategy-wiki"

export {
  computeTraderReadinessStats,
  recordReadinessAssessment,
  recordPillarScore,
  getInitialTraderReadinessState,
  getLatestAssessment,
} from "./trader-readiness"

export {
  computeSimulatorStats,
  recordSimulatorAttempt,
  isSimulatorStageUnlocked,
  getInitialSimulatorState,
} from "./simulator"

export {
  calculateDailyStreak,
  calculateWeeklyStreak,
  calculateWeeklyTargetProgress,
  getGlobalProgressSnapshot,
  getTodayActivity,
  hasMadeProgressToday,
  recordLearningActivity,
  getWeekDayLabels,
  getWeekDayKeys,
  extractMotivationEvents,
  getDateKey,
} from "./activity"

export { resetSection, type ResetSection } from "./reset"

export type { MotivationEvent, ActivityLogItem } from "./types"
