import type { SupabaseClient } from "@supabase/supabase-js"

import { getExecutionScenario, getPackForScenario } from "@/content/execution-lab"
import type { ExecutionMode } from "@/lib/execution-lab/types"

import { computeTrustedAttemptResult } from "./trusted-scoring"
import type {
  AttemptCompletePayload,
  AttemptCompleteResponse,
  AttemptStartResponse,
  ExecutionScenarioAttemptRow,
} from "./types"

const OPEN_ATTEMPT_WINDOW_MS = 2 * 60 * 60 * 1000

export function validateScenarioId(scenarioId: string) {
  const scenario = getExecutionScenario(scenarioId)
  if (!scenario) return null
  const pack = getPackForScenario(scenarioId)
  return {
    scenario,
    packId: scenario.packId ?? pack?.id ?? null,
  }
}

export async function startScenarioAttempt(
  admin: SupabaseClient,
  userId: string,
  scenarioId: string,
  mode: ExecutionMode
): Promise<AttemptStartResponse> {
  const meta = validateScenarioId(scenarioId)
  if (!meta) throw new Error("UNKNOWN_SCENARIO")

  const cutoff = new Date(Date.now() - OPEN_ATTEMPT_WINDOW_MS).toISOString()
  const { data: existing } = await admin
    .from("execution_scenario_attempts")
    .select("id, started_at")
    .eq("user_id", userId)
    .eq("scenario_id", scenarioId)
    .eq("status", "started")
    .gte("started_at", cutoff)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existing) {
    return { attemptId: existing.id, startedAt: existing.started_at }
  }

  const now = new Date().toISOString()
  const { data, error } = await admin
    .from("execution_scenario_attempts")
    .insert({
      user_id: userId,
      scenario_id: scenarioId,
      pack_id: meta.packId,
      mode,
      status: "started",
      started_at: now,
      updated_at: now,
    })
    .select("id, started_at")
    .single()

  if (error || !data) throw error ?? new Error("INSERT_FAILED")
  return { attemptId: data.id, startedAt: data.started_at }
}

export async function completeScenarioAttempt(
  admin: SupabaseClient,
  userId: string,
  payload: AttemptCompletePayload
): Promise<AttemptCompleteResponse> {
  const { data: row, error: fetchError } = await admin
    .from("execution_scenario_attempts")
    .select("*")
    .eq("id", payload.attemptId)
    .eq("user_id", userId)
    .maybeSingle()

  if (fetchError) throw fetchError
  if (!row) throw new Error("ATTEMPT_NOT_FOUND")

  const attempt = row as ExecutionScenarioAttemptRow

  if (attempt.status === "completed") {
    return {
      attemptId: attempt.id,
      executionScore: attempt.execution_score ?? 0,
      decisionCorrect: attempt.decision_correct ?? false,
      strategyCorrect: attempt.strategy_correct ?? false,
      mistakeCodes: attempt.mistake_codes ?? [],
      alreadyCompleted: true,
    }
  }

  const meta = validateScenarioId(attempt.scenario_id)
  if (!meta) throw new Error("UNKNOWN_SCENARIO")

  const trusted = computeTrustedAttemptResult(meta.scenario, payload)
  const completedAt = new Date().toISOString()
  const startedAt = new Date(attempt.started_at).getTime()
  const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000))

  const { error: updateError } = await admin
    .from("execution_scenario_attempts")
    .update({
      status: "completed",
      completed_at: completedAt,
      duration_seconds: durationSeconds,
      decision: trusted.decision,
      expected_decision: trusted.expectedDecision,
      decision_correct: trusted.decisionCorrect,
      strategy_selected: payload.strategy,
      expected_strategy: meta.scenario.bestStrategy,
      strategy_correct: trusted.strategyCorrect,
      execution_score: trusted.scores.executionScore,
      market_reading_score: trusted.scores.marketReadingScore,
      structure_score: trusted.scores.structureScore,
      entry_score: trusted.scores.entryScore,
      stop_score: trusted.scores.stopScore,
      target_score: trusted.scores.targetScore,
      risk_score: trusted.scores.riskScore,
      management_score: trusted.scores.managementScore,
      patience_score: trusted.scores.patienceScore,
      confidence: payload.confidence,
      confidence_correctness_gap: trusted.confidenceGap,
      hints_used: payload.hintsUsed,
      reveal_used: payload.revealUsed,
      rule_violations: payload.ruleViolations ?? [],
      mistake_codes: trusted.mistakeCodes,
      updated_at: completedAt,
    })
    .eq("id", payload.attemptId)
    .eq("user_id", userId)
    .eq("status", "started")

  if (updateError) throw updateError

  return {
    attemptId: payload.attemptId,
    executionScore: trusted.scores.executionScore,
    decisionCorrect: trusted.decisionCorrect,
    strategyCorrect: trusted.strategyCorrect,
    mistakeCodes: trusted.mistakeCodes,
  }
}

export async function abandonScenarioAttempt(
  admin: SupabaseClient,
  userId: string,
  attemptId: string,
  meaningfulInteraction: boolean
): Promise<{ ok: boolean; reason?: string }> {
  if (!meaningfulInteraction) {
    const { error } = await admin
      .from("execution_scenario_attempts")
      .delete()
      .eq("id", attemptId)
      .eq("user_id", userId)
      .eq("status", "started")
    if (error) throw error
    return { ok: true, reason: "discarded_no_interaction" }
  }

  const { data: row } = await admin
    .from("execution_scenario_attempts")
    .select("status, started_at")
    .eq("id", attemptId)
    .eq("user_id", userId)
    .maybeSingle()

  if (!row || row.status !== "started") return { ok: true, reason: "not_open" }

  const durationSeconds = Math.max(
    1,
    Math.round((Date.now() - new Date(row.started_at).getTime()) / 1000)
  )

  const { error } = await admin
    .from("execution_scenario_attempts")
    .update({
      status: "abandoned",
      duration_seconds: durationSeconds,
      updated_at: new Date().toISOString(),
    })
    .eq("id", attemptId)
    .eq("user_id", userId)
    .eq("status", "started")

  if (error) throw error
  return { ok: true }
}
