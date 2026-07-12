import type { SupabaseClient } from "@supabase/supabase-js"

import { ALL_EXECUTION_SCENARIOS } from "@/content/execution-lab"
import { MISTAKE_LABELS, type MistakeCode } from "./mistake-codes"
import {
  classifyScenarioHealth,
  computeScenarioQualityScore,
  HEALTH_LABEL_DISPLAY,
} from "./quality-score"
import type { ScenarioHealthLabel } from "./health-config"
import type { AdminAnalyticsResponse, ScenarioAdminMetrics } from "./types"
import type { ExecutionScenarioAttemptRow } from "./types"

export interface AdminAnalyticsFilters {
  packId?: string | null
  difficulty?: string | null
  mode?: string | null
  symbol?: string | null
  dateFrom?: string | null
  dateTo?: string | null
}

export async function fetchAdminAttemptRows(
  admin: SupabaseClient,
  filters: AdminAnalyticsFilters
): Promise<ExecutionScenarioAttemptRow[]> {
  let query = admin.from("execution_scenario_attempts").select("*")

  if (filters.packId) query = query.eq("pack_id", filters.packId)
  if (filters.mode) query = query.eq("mode", filters.mode)
  if (filters.dateFrom) query = query.gte("created_at", filters.dateFrom)
  if (filters.dateTo) query = query.lte("created_at", filters.dateTo)

  const { data, error } = await query.limit(5000)
  if (error) throw error
  return (data ?? []) as ExecutionScenarioAttemptRow[]
}

export function buildAdminAnalytics(
  rows: ExecutionScenarioAttemptRow[],
  filters: AdminAnalyticsFilters
): AdminAnalyticsResponse {
  const scenarios = ALL_EXECUTION_SCENARIOS.filter((s) => {
    if (filters.packId && s.packId !== filters.packId) return false
    if (filters.difficulty && s.difficulty !== filters.difficulty) return false
    if (filters.symbol && s.symbol !== filters.symbol) return false
    return true
  })

  const metrics: ScenarioAdminMetrics[] = scenarios.map((scenario) => {
    const attempts = rows.filter((r) => r.scenario_id === scenario.id)
    const starts = attempts.length
    const completed = attempts.filter((a) => a.status === "completed")
    const abandoned = attempts.filter((a) => a.status === "abandoned")
    const scores = completed
      .map((a) => a.execution_score)
      .filter((s): s is number => s != null)

    const modeBreakdown: Record<string, number> = {}
    for (const a of attempts) {
      modeBreakdown[a.mode] = (modeBreakdown[a.mode] ?? 0) + 1
    }

    const mistakeCounts = new Map<string, number>()
    const violationCounts = new Map<string, number>()
    for (const a of completed) {
      for (const code of a.mistake_codes ?? []) {
        mistakeCounts.set(code, (mistakeCounts.get(code) ?? 0) + 1)
      }
      for (const v of a.rule_violations ?? []) {
        violationCounts.set(v.type, (violationCounts.get(v.type) ?? 0) + 1)
      }
    }

    const topMistake = topKey(mistakeCounts)
    const topViolation = topKey(violationCounts)

    const completionRate = starts > 0 ? completed.length / starts : 0
    const abandonmentRate = starts > 0 ? abandoned.length / starts : 0
    const avgScore = average(scores)
    const medianScore = median(scores)
    const avgHints = average(completed.map((a) => a.hints_used))
    const revealRate =
      completed.length > 0
        ? completed.filter((a) => a.reveal_used).length / completed.length
        : 0
    const avgDuration = average(
      completed.map((a) => a.duration_seconds).filter((v): v is number => v != null)
    )
    const decisionRate = rate(completed, (a) => a.decision_correct === true)
    const strategyRate = rate(
      completed.filter((a) => a.strategy_selected),
      (a) => a.strategy_correct === true
    )
    const noTradeRate =
      completed.length > 0
        ? completed.filter((a) => a.decision === "no_trade" || a.decision === "wait")
            .length / completed.length
        : 0
    const avgGap = average(
      completed
        .map((a) => a.confidence_correctness_gap)
        .filter((v): v is number => v != null)
    )

    const qualityInput = {
      sampleSize: completed.length,
      completionRate,
      abandonmentRate,
      averageScore: avgScore,
      scoreStdDev: stdDev(scores),
      averageHints: avgHints,
      revealRate,
      decisionCorrectnessRate: decisionRate,
      averageConfidenceGap: avgGap,
      medianDurationSeconds: median(
        completed
          .map((a) => a.duration_seconds ?? 0)
          .filter((v) => v > 0)
      ),
    }

    const healthLabel: ScenarioHealthLabel = classifyScenarioHealth(qualityInput)
    const qualityScore = computeScenarioQualityScore(qualityInput)

    return {
      scenarioId: scenario.id,
      title: scenario.title,
      packId: scenario.packId ?? null,
      difficulty: scenario.difficulty,
      symbol: scenario.symbol,
      modeBreakdown,
      totalStarts: starts,
      completions: completed.length,
      abandonments: abandoned.length,
      abandonmentRate: Math.round(abandonmentRate * 100),
      averageExecutionScore: Math.round(avgScore),
      medianExecutionScore: Math.round(medianScore),
      averageHintsUsed: Math.round(avgHints * 10) / 10,
      revealRate: Math.round(revealRate * 100),
      averageCompletionTimeSeconds: Math.round(avgDuration),
      decisionCorrectnessRate: Math.round(decisionRate * 100),
      strategyCorrectnessRate: Math.round(strategyRate * 100),
      noTradeSelectionRate: Math.round(noTradeRate * 100),
      averageConfidenceGap: Math.round(avgGap),
      topMistake: topMistake ? (MISTAKE_LABELS[topMistake as keyof typeof MISTAKE_LABELS] ?? topMistake) : null,
      topViolation: topViolation,
      healthLabel,
      qualityScore,
    }
  })

  const packs = [...new Set(ALL_EXECUTION_SCENARIOS.map((s) => s.packId).filter(Boolean))] as string[]
  const difficulties = [...new Set(ALL_EXECUTION_SCENARIOS.map((s) => s.difficulty))]
  const modes = ["guided", "practice", "arcade"]

  return {
    scenarios: metrics.sort((a, b) => b.totalStarts - a.totalStarts),
    filters: { packs, difficulties, modes },
  }
}

function average(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((s, v) => s + v, 0) / values.length
}

function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function stdDev(values: number[]): number {
  if (values.length < 2) return 0
  const mean = average(values)
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length
  return Math.sqrt(variance)
}

function rate<T>(items: T[], pred: (item: T) => boolean): number {
  if (items.length === 0) return 0
  return items.filter(pred).length / items.length
}

function topKey(map: Map<string, number>): string | null {
  let best: string | null = null
  let bestCount = 0
  for (const [k, v] of map) {
    if (v > bestCount) {
      best = k
      bestCount = v
    }
  }
  return best
}
