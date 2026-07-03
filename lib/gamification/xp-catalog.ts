import { getLessonById, getQuizById } from "@/content/registry"
import { getLibraryConceptById } from "@/content/library"
import { ALL_TREND_LESSONS } from "@/content/trend-spotter/curriculum"
import { ALL_STRATEGIES } from "@/content/strategies"
import { READINESS_PILLARS } from "@/content/trader-readiness/pillars"

import type { ActivityType } from "@/lib/user-state/types"

export type IdempotencyMode =
  /** Rewarded once, ever, per (user, eventType, entityId). */
  | "once"
  /** Rewarded once per calendar day, per (user, eventType, entityId). */
  | "daily"
  /** Rewarded once per calendar day, per (user, eventType) — entityId ignored for dedupe. */
  | "daily-global"

export interface XpCatalogEntry {
  mode: IdempotencyMode
  /** Flat XP amount. The client can never override this. */
  amount: number
  /** Human-readable reason stored on the xp_events row. */
  label: string
  /** Optional content-registry existence check for the reported entityId. */
  validateEntity?: (entityId: string) => boolean
}

/**
 * Server-owned XP rewards catalog — the single source of truth for how much
 * every learning event is worth. Only server code may import this
 * (`lib/gamification/record-activity.ts` and the API route that calls it).
 * The client never sees these amounts: it reports *what happened*
 * (`ActivityFact`), never *how much it's worth*.
 *
 * `quiz-complete` is deliberately excluded — it's scored (pass/perfect) and
 * handled by `awardQuizXp` in `record-activity.ts` using `QUIZ_PASS_XP` /
 * `QUIZ_PERFECT_XP` below.
 *
 * Amounts mirror the pre-existing client-side catalog
 * (`lib/progression/levels.ts` `XP_REWARDS`) for continuity, adapted to a
 * flat idempotent-per-event model rather than the score-proportional
 * client math it replaces (see docs/database-v1.md — "gamification trust
 * boundary" — for why proportional/score-weighted rewards for drills were
 * dropped in favour of flat, capped, server-decided amounts).
 */
export const XP_CATALOG: Partial<Record<ActivityType, XpCatalogEntry>> = {
  "lesson-complete": {
    mode: "once",
    amount: 50,
    label: "Lesson completed",
    validateEntity: (id) => Boolean(getLessonById(id)),
  },
  "book-concept-complete": {
    mode: "once",
    amount: 50,
    label: "Book Lab concept completed",
    validateEntity: (id) => Boolean(getLibraryConceptById(id)),
  },
  "chart-drill-complete": {
    mode: "daily",
    amount: 80,
    label: "Chart drill completed",
  },
  "chart-lab-complete": {
    mode: "daily",
    amount: 60,
    label: "Chart Lab scenario completed",
  },
  "journal-reflection": {
    mode: "daily-global",
    amount: 40,
    label: "Journal reflection",
  },
  "practice-complete": {
    mode: "daily",
    amount: 80,
    label: "Practice drill completed",
  },
  "interactive-question": {
    mode: "once",
    amount: 10,
    label: "Interactive question answered",
  },
  "flashcard-session": {
    mode: "daily-global",
    amount: 30,
    label: "Flashcard session completed",
  },
  "trend-lesson-complete": {
    mode: "once",
    amount: 50,
    label: "Trend Spotter lesson completed",
    validateEntity: (id) =>
      ALL_TREND_LESSONS.some((l) => l.id === id || l.slug === id),
  },
  "trend-exercise-complete": {
    mode: "daily",
    amount: 80,
    label: "Trend Spotter exercise completed",
  },
  "trend-challenge-complete": {
    mode: "daily",
    amount: 80,
    label: "Trend Spotter challenge completed",
  },
  "strategy-lesson-complete": {
    mode: "once",
    amount: 50,
    label: "Strategy lesson completed",
    validateEntity: (id) =>
      ALL_STRATEGIES.some((s) => s.id === id || s.slug === id),
  },
  "strategy-practice-complete": {
    mode: "daily",
    amount: 80,
    label: "Strategy practice completed",
  },
  "strategy-challenge-complete": {
    mode: "daily",
    amount: 80,
    label: "Strategy challenge completed",
  },
  "readiness-assessment-complete": {
    mode: "once",
    amount: 200,
    label: "Readiness assessment completed",
  },
  "readiness-pillar-complete": {
    mode: "once",
    amount: 50,
    label: "Readiness pillar completed",
    validateEntity: (id) => READINESS_PILLARS.some((p) => p.id === id),
  },
  "simulator-session-complete": {
    mode: "daily",
    amount: 300,
    label: "Simulator session completed",
  },
}

/** Awarded once per quiz on first pass. */
export const QUIZ_PASS_XP = 100
/** Awarded once per quiz, additionally, the first time it's scored 100%. */
export const QUIZ_PERFECT_XP = 150
/** Fallback passing threshold for quizzes with no explicit `passingScore`. */
export const DEFAULT_QUIZ_PASS_THRESHOLD = 70

export function isKnownQuiz(quizId: string): boolean {
  return Boolean(getQuizById(quizId))
}

export function getQuizPassThreshold(quizId: string): number {
  return getQuizById(quizId)?.passingScore ?? DEFAULT_QUIZ_PASS_THRESHOLD
}
