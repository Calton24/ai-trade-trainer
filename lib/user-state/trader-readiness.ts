import type {
  ReadinessAssessmentAttempt,
  ReadinessPillarId,
  StoredTraderReadinessState,
  TraderReadinessStats,
} from "@/lib/trader-readiness/types"
import { getInitialTraderReadinessState } from "@/lib/trader-readiness/types"
import { getTraderLevel } from "@/lib/trader-readiness/levels"
import {
  computeOverallReadiness,
  findStrongestPillar,
  findWeakestPillar,
} from "@/lib/trader-readiness/scoring"
import { buildReadinessStats } from "@/lib/trader-readiness/recommendations"
import { recordLearningActivity } from "./activity"
import type { UserState } from "./types"

export { getInitialTraderReadinessState }
export type { StoredTraderReadinessState, ReadinessAssessmentAttempt }

export function recordPillarScore(
  state: UserState,
  pillarId: ReadinessPillarId,
  score: number
): UserState {
  const pillarScores = {
    ...state.traderReadiness.pillarScores,
    [pillarId]: score,
  }

  return {
    ...state,
    traderReadiness: {
      ...state.traderReadiness,
      pillarScores,
      lastPillarCompletedAt: new Date().toISOString(),
    },
  }
}

export function recordReadinessAssessment(
  state: UserState,
  attempt: Omit<
    ReadinessAssessmentAttempt,
    "id" | "completedAt" | "overallScore" | "traderLevel" | "weakestPillar" | "strongestPillar"
  > & { id?: string }
): { state: UserState; sessionId: string } {
  const sessionId = attempt.id ?? crypto.randomUUID()
  const pillarScores = attempt.pillarScores

  const overallScore = computeOverallReadiness(pillarScores)
  const filled = {
    "market-knowledge": pillarScores["market-knowledge"] ?? 0,
    "chart-reading": pillarScores["chart-reading"] ?? 0,
    "trade-selection": pillarScores["trade-selection"] ?? 0,
    "risk-management": pillarScores["risk-management"] ?? 0,
    psychology: pillarScores.psychology ?? 0,
    "journal-analysis": pillarScores["journal-analysis"] ?? 0,
    "strategy-mastery": pillarScores["strategy-mastery"] ?? 0,
  }

  const full: ReadinessAssessmentAttempt = {
    ...attempt,
    id: sessionId,
    overallScore,
    traderLevel: getTraderLevel(overallScore),
    weakestPillar: findWeakestPillar(filled),
    strongestPillar: findStrongestPillar(filled),
    completedAt: new Date().toISOString(),
  }

  const xpEarned = attempt.xpEarned || Math.round(overallScore / 2)

  let next: UserState = {
    ...state,
    traderReadiness: {
      ...state.traderReadiness,
      pillarScores,
      assessmentAttempts: [
        full,
        ...state.traderReadiness.assessmentAttempts,
      ].slice(0, 20),
      lastAssessmentAt: full.completedAt,
      readinessXP: state.traderReadiness.readinessXP + xpEarned,
      readinessStreak: state.traderReadiness.readinessStreak + 1,
    },
  }

  const { state: withActivity } = recordLearningActivity(next, {
    type: "readiness-assessment-complete",
    source: "trader-readiness",
    title: `Trader Readiness Assessment (${overallScore}%)`,
    entityId: sessionId,
    xpAwarded: xpEarned,
  })

  return { state: withActivity, sessionId }
}

export function computeTraderReadinessStats(
  state: UserState
): TraderReadinessStats {
  const tr = state.traderReadiness
  const latestWeaknesses =
    tr.assessmentAttempts[0]?.detectedWeaknesses ?? []

  return buildReadinessStats(
    tr.pillarScores,
    tr.assessmentAttempts.length,
    tr.readinessXP,
    latestWeaknesses
  )
}

export function getLatestAssessment(
  state: UserState
): ReadinessAssessmentAttempt | null {
  return state.traderReadiness.assessmentAttempts[0] ?? null
}
