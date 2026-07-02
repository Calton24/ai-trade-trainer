import type { SupabaseClient } from "@supabase/supabase-js"

import { computeBehavioralCompetence } from "@/lib/competence/behavioral-scoring"
import type { ArchiveSlice } from "@/lib/competence/reset-with-archive"
import { resolveCurrentPhase } from "@/lib/competence/live-trading-phases"
import type { BehavioralEventInput } from "@/lib/competence/types"
import type { UserState } from "@/lib/user-state/types"

function journalCompletionRate(state: UserState): number {
  const entries = state.journalEntries.length
  if (entries === 0) return 0
  const withNotes = state.journalEntries.filter(
    (j) => j.personalNote && j.personalNote.length > 10
  ).length
  return Math.round((withNotes / entries) * 100)
}

export async function syncCompetenceSnapshot(
  supabase: SupabaseClient,
  userId: string,
  state: UserState
): Promise<void> {
  const scores = computeBehavioralCompetence(state)
  const phase = state.liveTradingPhase ?? {
    currentPhase: "education" as const,
    simulatedUnlockedAt: null,
    livePrepUnlockedAt: null,
    goLiveUnlockedAt: null,
    riskQuizPassed: false,
    losingStreakScenarioPassed: false,
    strategyClarityPassed: false,
    journalCompletionRate: 0,
    emotionalViolations: 0,
    tradesInPhase: 0,
  }
  const journalRate = journalCompletionRate(state)

  await supabase.from("trader_competence").upsert(
    {
      user_id: userId,
      knowledge_score: scores.knowledgeScore,
      chart_score: scores.chartScore,
      trade_selection_score: scores.tradeSelectionScore,
      risk_score: scores.riskScore,
      psychology_score: scores.psychologyScore,
      consistency_score: scores.consistencyScore,
      execution_score: scores.executionScore,
      overall_score: scores.overallScore,
      weakest_area: scores.weakestArea,
      recommended_next_module: scores.recommendedNextModule,
      assessment_count: state.traderReadiness.assessmentAttempts.length,
      drill_count: state.drillSessions.length,
      journal_completion_rate: journalRate,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )

  await supabase.from("live_trading_phase").upsert(
    {
      user_id: userId,
      current_phase: resolveCurrentPhase(state, phase),
      simulated_unlocked_at: phase.simulatedUnlockedAt,
      live_prep_unlocked_at: phase.livePrepUnlockedAt,
      go_live_unlocked_at: phase.goLiveUnlockedAt,
      risk_quiz_passed: phase.riskQuizPassed,
      losing_streak_scenario_passed: phase.losingStreakScenarioPassed,
      strategy_clarity_passed: phase.strategyClarityPassed,
      journal_completion_rate: journalRate,
      emotional_violations: phase.emotionalViolations,
      trades_in_phase: phase.tradesInPhase,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )
}

export async function insertBehavioralEvents(
  supabase: SupabaseClient,
  userId: string,
  events: BehavioralEventInput[]
): Promise<void> {
  if (events.length === 0) return

  await supabase.from("behavioral_events").insert(
    events.map((e) => ({
      user_id: userId,
      event_type: e.eventType,
      pillar: e.pillar,
      entity_id: e.entityId,
      score: e.score ?? null,
      metadata: e.metadata ?? {},
    }))
  )
}

export async function archiveProgressSlice(
  supabase: SupabaseClient,
  userId: string,
  archive: ArchiveSlice
): Promise<void> {
  await supabase.from("progress_archives").insert({
    user_id: userId,
    section: archive.section,
    archived_state: archive.state,
    archived_at: archive.archivedAt,
  })
}

export async function syncLessonProgressRows(
  supabase: SupabaseClient,
  userId: string,
  state: UserState
): Promise<void> {
  const rows = state.lessonProgress.map((lp) => ({
    user_id: userId,
    lesson_id: lp.lessonId,
    status: "completed" as const,
    score: null,
    attempts: 1,
    last_updated: lp.completedAt ?? new Date().toISOString(),
  }))

  if (rows.length === 0) return

  await supabase.from("user_lesson_progress").upsert(rows, {
    onConflict: "user_id,lesson_id",
  })
}
