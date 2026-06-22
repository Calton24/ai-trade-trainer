import type { AIReview, JournalEntry, TradeMark } from "@/lib/types"

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

export interface StoredUserProgress {
  level: number
  xp: number
  streak: number
  lastActivityDate: string | null
  activePathId: string | null
  completedSyllabusItems: string[]
  pathProgress: Record<string, number>
}

export interface UserState {
  progress: StoredUserProgress
  lessonProgress: StoredLessonProgress[]
  quizAttempts: StoredQuizAttempt[]
  drillSessions: StoredDrillSession[]
  journalEntries: JournalEntry[]
  earnedBadgeIds: string[]
}

export const STORAGE_KEYS = {
  progress: "tradetrainer_user_progress",
  lessonProgress: "tradetrainer_lesson_progress",
  quizAttempts: "tradetrainer_quiz_attempts",
  drillSessions: "tradetrainer_drill_sessions",
  journalEntries: "tradetrainer_journal_entries",
  badges: "tradetrainer_user_badges",
} as const
