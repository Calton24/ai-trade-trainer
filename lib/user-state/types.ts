import type { AIReview, JournalEntry, TradeMark } from "@/lib/types"
import type { StoredFlashcardState } from "@/lib/flashcards/types"
import type { StoredStrategyWikiState } from "@/lib/strategy-wiki/types"
import type { StoredTrendSpotterState } from "@/lib/trend-spotter/types"
import type { StoredTraderReadinessState } from "@/lib/trader-readiness/types"
import type { LivePhaseState } from "@/lib/competence/types"
import { getDefaultPhaseState } from "@/lib/competence/live-trading-phases"
import type { StoredSimulatorState } from "@/lib/simulator/types"

export interface StoredLessonProgress {
  lessonId: string
  completedAt: string
  xpEarned: number
}

export interface StoredQuizAttempt {
  id: string
  quizId: string
  score: number
  passed: boolean
  xpEarned: number
  completedAt: string
}

export interface StoredDrillSession {
  id: string
  drillType: string
  drillTitle: string
  marks: TradeMark[]
  review: AIReview
  score: number
  completedAt: string
}

export interface StoredBookQuizAttempt {
  id: string
  conceptId: string
  score: number
  passed: boolean
  completedAt: string
}

export interface StoredBookPracticeDrill {
  id: string
  conceptId: string
  drillId: string
  score: number
  completedAt: string
}

export interface StoredBookReflection {
  id: string
  conceptId: string
  conceptTitle: string
  note: string
  confidenceRating: 1 | 2 | 3 | 4 | 5
  mistakeTag: string
  completedAt: string
}

export interface StoredBookLabProgress {
  completedConceptIds: string[]
  quizAttempts: StoredBookQuizAttempt[]
  practiceDrills: StoredBookPracticeDrill[]
  reflections: StoredBookReflection[]
  bookLabXP: number
}

export function getInitialBookLabProgress(): StoredBookLabProgress {
  return {
    completedConceptIds: [],
    quizAttempts: [],
    practiceDrills: [],
    reflections: [],
    bookLabXP: 0,
  }
}

export interface StoredUserProgress {
  level: number
  xp: number
  streak: number
  lastActivityDate: string | null
  activePathId: string | null
  completedSyllabusItems: string[]
  pathProgress: Record<string, number>
}

export interface StoredGamificationState {
  /** Highest trader rank tier ever reached (monotonic — never decreases). */
  highestRankTier: number
  earnedAchievementIds: string[]
  /** Challenge instance ids whose reward has been granted. */
  claimedChallengeIds: string[]
  lastLoginDate: string | null
  /** Cumulative XP earned from achievement bonuses (for transparency). */
  bonusXp: number
}

export function getInitialGamificationState(): StoredGamificationState {
  return {
    highestRankTier: 1,
    earnedAchievementIds: [],
    claimedChallengeIds: [],
    lastLoginDate: null,
    bonusXp: 0,
  }
}

export type ActivityType =
  | "lesson-complete"
  | "quiz-complete"
  | "book-concept-complete"
  | "chart-drill-complete"
  | "chart-lab-complete"
  | "journal-reflection"
  | "practice-complete"
  | "interactive-question"
  | "flashcard-session"
  | "trend-lesson-complete"
  | "trend-exercise-complete"
  | "trend-challenge-complete"
  | "strategy-lesson-complete"
  | "strategy-practice-complete"
  | "strategy-challenge-complete"
  | "readiness-assessment-complete"
  | "readiness-pillar-complete"
  | "simulator-session-complete"

export type ActivitySource =
  | "paths"
  | "book-lab"
  | "training"
  | "chart-lab"
  | "quiz"
  | "journal"
  | "flashcards"
  | "trend-spotter"
  | "strategy-wiki"
  | "trader-readiness"
  | "simulator"

export interface ActivityLogItem {
  id: string
  type: ActivityType
  source: ActivitySource
  title: string
  entityId: string
  /**
   * Client-computed, display-only estimate. Never trusted server-side —
   * the server derives the real XP award from its own catalog
   * (`lib/gamification/xp-catalog.ts`) keyed off `type`/`entityId`/`score`.
   * See `lib/gamification/record-activity.ts`.
   */
  xpAwarded: number
  /** Raw score (0-100) for scoreable activities (e.g. quizzes), if any. */
  score?: number
  completedAt: string
  dateKey: string
  weekKey: string
}

export interface WeeklyTargetState {
  daysPerWeek: number | null
  setAt: string | null
}

export interface WeeklyStreakState {
  streak: number
  activeDaysByWeek: Record<string, string[]>
  lastEvaluatedWeekKey: string | null
}

export interface LearningActivityInput {
  type: ActivityType
  source: ActivitySource
  title: string
  entityId: string
  xpAwarded?: number
  score?: number
}

export type MotivationEvent =
  | { type: "streak-started"; streak: number }
  | { type: "streak-continued"; streak: number }
  | { type: "weekly-target-hit"; weeksStreak: number }
  | { type: "weekly-target-prompt" }
  | { type: "badge-unlocked"; badgeId: string; badgeName: string }
  | { type: "rank-up"; tier: number; title: string; insignia: string }
  | {
      type: "achievement-unlocked"
      achievementId: string
      name: string
      icon: string
      bonusXp: number
    }
  | { type: "challenge-complete"; period: string; rewardXp: number }
  | { type: "xp-awarded"; amount: number; reason: string }

export interface StoredLearningMapState {
  foundationCelebrated: boolean
  manuallyCompletedNodes: string[]
  previewedNodes: string[]
}

export function getInitialLearningMapState(): StoredLearningMapState {
  return {
    foundationCelebrated: false,
    manuallyCompletedNodes: [],
    previewedNodes: [],
  }
}

export interface UserState {
  progress: StoredUserProgress
  lessonProgress: StoredLessonProgress[]
  quizAttempts: StoredQuizAttempt[]
  drillSessions: StoredDrillSession[]
  journalEntries: JournalEntry[]
  earnedBadgeIds: string[]
  bookLab: StoredBookLabProgress
  activityLog: ActivityLogItem[]
  weeklyTarget: WeeklyTargetState
  weeklyStreak: WeeklyStreakState
  flashcards: StoredFlashcardState
  trendSpotter: StoredTrendSpotterState
  strategyWiki: StoredStrategyWikiState
  learningMap: StoredLearningMapState
  traderReadiness: StoredTraderReadinessState
  liveTradingPhase: LivePhaseState
  simulator: StoredSimulatorState
  gamification: StoredGamificationState
}

export const STORAGE_KEYS = {
  progress: "tradetrainer_user_progress",
  lessonProgress: "tradetrainer_lesson_progress",
  quizAttempts: "tradetrainer_quiz_attempts",
  drillSessions: "tradetrainer_drill_sessions",
  journalEntries: "tradetrainer_journal_entries",
  badges: "tradetrainer_user_badges",
  bookLab: "tradetrainer_book_lab",
  activityLog: "tradetrainer_activity_log",
  weeklyTarget: "tradetrainer_weekly_target",
  weeklyStreak: "tradetrainer_weekly_streak",
  flashcardProgress: "tradetrainer_flashcard_progress",
  flashcardSessions: "tradetrainer_flashcard_sessions",
  trendSpotterProgress: "tradetrainer_trend_spotter_progress",
  trendSpotterSessions: "tradetrainer_trend_spotter_sessions",
  trendChallengeAttempts: "tradetrainer_trend_challenge_attempts",
  strategyProgress: "tradetrainer_strategy_progress",
  strategySessions: "tradetrainer_strategy_sessions",
  strategyChallenges: "tradetrainer_strategy_challenges",
  learningMapProgress: "tradetrainer_learning_map_progress",
  unlockedNodes: "tradetrainer_unlocked_nodes",
  completedNodes: "tradetrainer_completed_nodes",
  stageProgress: "tradetrainer_stage_progress",
  masteryScores: "tradetrainer_mastery_scores",
  traderReadiness: "tradetrainer_trader_readiness",
  liveTradingPhase: "tradetrainer_live_trading_phase",
  progressArchives: "tradetrainer_progress_archives",
  simulator: "tradetrainer_simulator",
  gamification: "tradetrainer_gamification",
} as const
