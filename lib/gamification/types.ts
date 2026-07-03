import type { ActivityType } from "@/lib/user-state/types"

/**
 * The only shape the client may send to report a learning event. It
 * describes *facts* about what happened — never an XP amount, rank,
 * streak, or achievement id. The server (`record-activity.ts`) is the sole
 * authority on what those facts are worth; see docs/database-v1.md
 * ("gamification trust boundary").
 */
export interface ActivityFact {
  eventType: ActivityType
  entityId: string
  /** Raw score 0-100, only meaningful for scoreable events (e.g. quizzes). */
  score?: number
  attemptId?: string
  /** Informational only — the server always uses its own clock for dedupe/streaks. */
  completedAt?: string
}

/** Trusted, server-recomputed totals — always derived from `xp_events`. */
export interface RecordActivityStats {
  lifetimeXp: number
  level: number
  rankTier: number
  streak: number
}

export interface RecordActivityEventResult {
  awarded: boolean
  xpAwarded: number
  reason: string
}
