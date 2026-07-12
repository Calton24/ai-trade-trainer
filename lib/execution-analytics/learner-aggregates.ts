import type { SupabaseClient } from "@supabase/supabase-js"

import { EXECUTION_PACKS, getExecutionScenario } from "@/content/execution-lab"
import { SKILL_LABELS } from "@/lib/skills/definitions"
import type { SkillId } from "@/lib/skills/types"

import { MISTAKE_LABELS, type MistakeCode } from "./mistake-codes"
import type {
  CoachingRecommendation,
  ExecutionScenarioAttemptRow,
  LearnerAnalyticsOverview,
  LearnerAnalyticsResponse,
  PackAnalyticsSummary,
  RecentAttemptSummary,
} from "./types"
import { fromDbDecision } from "./types"

const RECENT_DAYS = 30

const MISTAKE_COACHING: Partial<
  Record<MistakeCode, { href: string; label: string; reason: string }>
> = {
  "missed-no-trade": {
    href: "/execution-lab?pack=patience",
    label: "Patience Academy",
    reason: "Recent attempts show missed no-trade opportunities.",
  },
  "forced-trade": {
    href: "/execution-lab?pack=patience",
    label: "Patience Academy",
    reason: "You may be forcing trades when standing aside is correct.",
  },
  "misread-reversal": {
    href: "/execution-lab?pack=reversal",
    label: "Reversal Academy",
    reason: "Pullback vs reversal confusion detected in recent attempts.",
  },
  "misread-pullback": {
    href: "/execution-lab?pack=continuation",
    label: "Continuation Academy",
    reason: "Recent attempts suggest pullback misreads.",
  },
  "against-htf-bias": {
    href: "/execution-lab?pack=eod",
    label: "EOD Academy",
    reason: "Higher-timeframe context may need reinforcement.",
  },
  "entered-too-early": {
    href: "/paths/market-structure-mastery/lessons/structure-replay",
    label: "Structure Replay",
    reason: "Entries are landing before confirmation.",
  },
  "stop-too-tight": {
    href: "/paths/risk-management/lessons/position-sizing-basics",
    label: "Risk Management",
    reason: "Stops may be too tight for the structure.",
  },
  "poor-risk-reward": {
    href: "/execution-lab",
    label: "Execution Lab",
    reason: "Risk/reward planning needs deliberate reps.",
  },
}

function recentCutoff(): string {
  const d = new Date()
  d.setDate(d.getDate() - RECENT_DAYS)
  return d.toISOString()
}

export async function fetchLearnerAttempts(
  supabase: SupabaseClient,
  userId: string,
  limit = 50
): Promise<ExecutionScenarioAttemptRow[]> {
  const { data, error } = await supabase
    .from("execution_scenario_attempts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as ExecutionScenarioAttemptRow[]
}

export function buildLearnerAnalytics(
  attempts: ExecutionScenarioAttemptRow[]
): LearnerAnalyticsResponse {
  const started = attempts.length
  const completed = attempts.filter((a) => a.status === "completed")
  const completedCount = completed.length

  const overview: LearnerAnalyticsOverview = {
    scenariosCompleted: completedCount,
    scenariosStarted: started,
    completionRate: started > 0 ? Math.round((completedCount / started) * 100) : 0,
    averageExecutionScore: avg(completed.map((a) => a.execution_score)),
    averageDurationSeconds: avg(completed.map((a) => a.duration_seconds)),
    noTradeAccuracy: pct(
      completed.filter((a) => a.decision === "no_trade" || a.decision === "wait"),
      (a) => a.decision_correct === true
    ),
    strategySelectionAccuracy: pct(
      completed.filter((a) => a.strategy_selected),
      (a) => a.strategy_correct === true
    ),
    confidenceCalibration: Math.round(
      100 -
        avg(completed.map((a) => a.confidence_correctness_gap)) /
          Math.max(1, completed.filter((a) => a.confidence).length)
    ),
    hintsPerCompleted: avg(completed.map((a) => a.hints_used)),
    revealRate: pct(completed, (a) => a.reveal_used),
  }

  const byPack: PackAnalyticsSummary[] = EXECUTION_PACKS.map((pack) => {
    const packAttempts = attempts.filter((a) => a.pack_id === pack.id)
    const packCompleted = packAttempts.filter((a) => a.status === "completed")
    const recent = packAttempts.filter((a) => a.created_at >= recentCutoff())
    const older = packAttempts.filter((a) => a.created_at < recentCutoff())
    const recentAvg = avg(recent.filter((a) => a.execution_score != null).map((a) => a.execution_score))
    const olderAvg = avg(older.filter((a) => a.execution_score != null).map((a) => a.execution_score))

    const skillScores = pack.skillIds.map((id) => ({
      id,
      label: SKILL_LABELS[id as SkillId],
      score: avg(
        packCompleted
          .filter((a) => a.execution_score != null)
          .map((a) => a.execution_score)
      ),
    }))
    skillScores.sort((a, b) => a.score - b.score)

    return {
      packId: pack.id,
      packTitle: pack.title,
      attempts: packAttempts.length,
      completed: packCompleted.length,
      completionRate:
        packAttempts.length > 0
          ? Math.round((packCompleted.length / packAttempts.length) * 100)
          : 0,
      averageScore: avg(packCompleted.map((a) => a.execution_score)),
      strongestSkill: skillScores[skillScores.length - 1]?.label ?? null,
      weakestSkill: skillScores[0]?.label ?? null,
      recentTrend: Math.round(recentAvg - olderAvg),
    }
  })

  const recentAttempts: RecentAttemptSummary[] = attempts.slice(0, 12).map((a) => {
    const scenario = getExecutionScenario(a.scenario_id)
    return {
      id: a.id,
      scenarioId: a.scenario_id,
      scenarioTitle: scenario?.title ?? a.scenario_id,
      packId: a.pack_id,
      mode: a.mode,
      executionScore: a.execution_score,
      decision: fromDbDecision(a.decision),
      decisionCorrect: a.decision_correct,
      hintsUsed: a.hints_used,
      durationSeconds: a.duration_seconds,
      completedAt: a.completed_at,
      status: a.status,
    }
  })

  const coachingRecommendations = buildCoachingFromMistakes(
    completed.filter((a) => a.created_at >= recentCutoff())
  )

  return { overview, byPack, recentAttempts, coachingRecommendations }
}

function buildCoachingFromMistakes(
  recentCompleted: ExecutionScenarioAttemptRow[]
): CoachingRecommendation[] {
  const counts = new Map<MistakeCode, number>()
  for (const a of recentCompleted) {
    for (const code of a.mistake_codes ?? []) {
      if (code in MISTAKE_LABELS) {
        counts.set(code as MistakeCode, (counts.get(code as MistakeCode) ?? 0) + 1)
      }
    }
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
  return sorted.map(([code, count], i) => {
    const coach = MISTAKE_COACHING[code]
    return {
      label: coach?.label ?? MISTAKE_LABELS[code],
      reason: coach?.reason ?? `Frequent issue: ${MISTAKE_LABELS[code]} (${count}×)`,
      href: coach?.href ?? "/execution-lab",
      priority: 3 - i,
    }
  })
}

function avg(values: (number | null | undefined)[]): number {
  const nums = values.filter((v): v is number => v != null && Number.isFinite(v))
  if (nums.length === 0) return 0
  return Math.round(nums.reduce((s, v) => s + v, 0) / nums.length)
}

function pct<T>(items: T[], pred: (item: T) => boolean): number {
  if (items.length === 0) return 0
  return Math.round((items.filter(pred).length / items.length) * 100)
}

export { buildCoachingFromMistakes }
