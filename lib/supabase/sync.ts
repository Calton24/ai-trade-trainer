import type { SupabaseClient } from "@supabase/supabase-js"

import type { UserProfile } from "@/lib/auth/types"
import { computeBehavioralCompetence } from "@/lib/competence/behavioral-scoring"
import { levelFromXP } from "@/lib/progression/levels"
import { getTierForXp } from "@/lib/progression/ranks"
import { computeCompetencyScore } from "@/lib/progression/competency"
import { syncUserStats } from "@/lib/data/xp-service"
import { getDateKey, getWeekKey } from "@/lib/user-state/activity"
import { computeAllLibraryBookStats } from "@/lib/user-state/library"
import { computeTraderReadinessStats } from "@/lib/user-state/trader-readiness"
import type { UserState } from "@/lib/user-state/types"
import { getDefaultPhaseState } from "@/lib/competence/live-trading-phases"
import { loadUserState, normalizeUserState } from "@/lib/user-state"
import {
  normalizeExperienceLevel,
  normalizeLearningPlan,
  normalizeProfileCountry,
  normalizeProfileUsername,
  normalizeStudyIntensity,
  normalizeTradingGoals,
} from "@/lib/settings/profile-normalization"
import {
  archiveProgressSlice,
  syncCompetenceSnapshot,
  syncLessonProgressRows,
} from "@/lib/supabase/progress-repository"

const STATE_VERSION = 1

export async function fetchLearningState(
  supabase: SupabaseClient,
  userId: string
): Promise<UserState | null> {
  const { data, error } = await supabase
    .from("user_learning_state")
    .select("state_json, updated_at")
    .eq("user_id", userId)
    .maybeSingle()

  if (error || !data?.state_json) return null

  const parsed = data.state_json as Partial<UserState>
  if (!parsed.progress) return null

  return normalizeUserState(parsed)
}

export async function saveLearningState(
  supabase: SupabaseClient,
  userId: string,
  state: UserState
): Promise<{ error?: string }> {
  const { error } = await supabase.from("user_learning_state").upsert(
    {
      user_id: userId,
      state_version: STATE_VERSION,
      state_json: state,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )

  if (error) return { error: error.message }
  return {}
}

/**
 * Writes every gamification/entitlement-derived field computed from a
 * user's learning state: the score columns on `profiles` (xp, level,
 * streak, rank_tier, competency_score, xp_today/week/month, ...),
 * `streaks`, `weekly_targets`, `user_badges`, `user_stats` (via
 * `syncUserStats`), and the competence/lesson-progress mirrors.
 *
 * As of migration 015, `authenticated` no longer has UPDATE privilege on
 * the gamification columns of `profiles` (only identity/preference columns
 * remain client-writable) or on `user_stats` at all. **Only call this with
 * the service-role admin client**, scoped to a server-verified `userId` —
 * see `app/api/progress/sync-gamification/route.ts`, the sole caller.
 * Never call this with a browser-supplied Supabase client.
 */
export async function syncProfileSummary(
  supabase: SupabaseClient,
  userId: string,
  state: UserState
): Promise<void> {
  const readiness = computeTraderReadinessStats(state)
  const competence = computeBehavioralCompetence(state)
  const competency = computeCompetencyScore(state)

  const dayKey = getDateKey()
  const weekKey = getWeekKey()
  const monthKey = dayKey.slice(0, 7)
  const log = state.activityLog
  const xpToday = log
    .filter((a) => a.dateKey === dayKey)
    .reduce((s, a) => s + a.xpAwarded, 0)
  const xpWeek = log
    .filter((a) => a.weekKey === weekKey)
    .reduce((s, a) => s + a.xpAwarded, 0)
  const xpMonth = log
    .filter((a) => a.dateKey.startsWith(monthKey))
    .reduce((s, a) => s + a.xpAwarded, 0)
  const booksCompleted = Object.values(
    computeAllLibraryBookStats(state)
  ).filter((b) => b.completed).length
  const rankTier = Math.max(
    state.gamification?.highestRankTier ?? 1,
    getTierForXp(state.progress.xp)
  )

  await supabase
    .from("profiles")
    .update({
      level: state.progress.level,
      xp: state.progress.xp,
      streak: state.progress.streak,
      weekly_target_days: state.weeklyTarget.daysPerWeek,
      lessons_completed: state.lessonProgress.length,
      quizzes_completed: state.quizAttempts.length,
      drills_completed: state.drillSessions.length,
      books_completed: booksCompleted,
      rank_tier: rankTier,
      competency_score: competency.score,
      xp_today: xpToday,
      xp_week: xpWeek,
      xp_month: xpMonth,
      xp_period_key_day: dayKey,
      xp_period_key_week: weekKey,
      xp_period_key_month: monthKey,
      strongest_skill: readiness.strongestPillarLabel,
      weakest_skill: competence.weakestArea ?? readiness.weakestPillarLabel,
      last_practice_date: state.progress.lastActivityDate,
      active_path_id: state.progress.activePathId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  await supabase.from("streaks").upsert(
    {
      user_id: userId,
      current_streak: state.progress.streak,
      last_activity_date: state.progress.lastActivityDate,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )

  if (state.weeklyTarget.daysPerWeek !== null) {
    await supabase.from("weekly_targets").upsert(
      {
        user_id: userId,
        days_per_week: state.weeklyTarget.daysPerWeek,
        active_days_by_week: state.weeklyStreak.activeDaysByWeek,
        weekly_streak: state.weeklyStreak.streak,
        last_evaluated_week_key: state.weeklyStreak.lastEvaluatedWeekKey,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
  }

  for (const badgeId of state.earnedBadgeIds) {
    await supabase
      .from("user_badges")
      .upsert(
        { user_id: userId, badge_id: badgeId },
        { onConflict: "user_id,badge_id", ignoreDuplicates: true }
      )
  }

  await syncCompetenceSnapshot(supabase, userId, state)
  await syncLessonProgressRows(supabase, userId, state)

  const longestStreak = state.weeklyStreak?.streak ?? state.progress.streak
  await syncUserStats(supabase, userId, {
    lifetimeXp: state.progress.xp,
    highestRankTier: rankTier,
    currentStreak: state.progress.streak,
    longestStreak,
    competencyScore: competency.score,
    lessonsCompleted: state.lessonProgress.length,
    quizzesCompleted: state.quizAttempts.length,
    drillsCompleted: state.drillSessions.length,
    booksCompleted,
    simulationsCompleted: state.simulator.completedStageIds.length,
    lastActivityAt: state.progress.lastActivityDate
      ? `${state.progress.lastActivityDate}T12:00:00Z`
      : null,
  })
}

export async function archiveProgressReset(
  supabase: SupabaseClient,
  userId: string,
  archive: Parameters<typeof archiveProgressSlice>[2]
): Promise<void> {
  await archiveProgressSlice(supabase, userId, archive)
}

/**
 * Merge anonymous localStorage preview progress with a remote snapshot.
 *
 * **Anonymous / dev preview only** — never call for authenticated users.
 * Authenticated sessions must use Supabase `user_learning_state` as the sole source of truth.
 */
export function mergeAnonymousPreviewState(
  local: UserState,
  remote: UserState | null,
  options?: { authenticatedUserId?: string | null }
): UserState {
  if (options?.authenticatedUserId) {
    const message =
      "mergeAnonymousPreviewState must not run for authenticated users"
    if (process.env.NODE_ENV === "development") {
      throw new Error(message)
    }
    return remote ?? local
  }

  if (!remote) return local

  const localHasActivity = local.activityLog.length > 0
  const remoteHasActivity = remote.activityLog.length > 0

  let merged: UserState
  if (!remoteHasActivity && localHasActivity) merged = local
  else if (!localHasActivity && remoteHasActivity) merged = remote
  else if (remote.progress.xp > local.progress.xp) merged = remote
  else if (local.progress.xp > remote.progress.xp) merged = local
  else if (remote.activityLog.length > local.activityLog.length) merged = remote
  else merged = local

  const localPhase = local.liveTradingPhase ?? getDefaultPhaseState()
  const remotePhase = remote.liveTradingPhase ?? getDefaultPhaseState()
  const phaseOrder = [
    "education",
    "simulated",
    "live_prep",
    "go_live",
    "live_active",
  ] as const
  const localIdx = phaseOrder.indexOf(localPhase.currentPhase)
  const remoteIdx = phaseOrder.indexOf(remotePhase.currentPhase)
  const advancedPhase = remoteIdx > localIdx ? remotePhase : localPhase

  return normalizeUserState({
    ...merged,
    gamification:
      merged.gamification ?? local.gamification ?? remote.gamification,
    liveTradingPhase: {
      ...advancedPhase,
      riskQuizPassed: localPhase.riskQuizPassed || remotePhase.riskQuizPassed,
      losingStreakScenarioPassed:
        localPhase.losingStreakScenarioPassed ||
        remotePhase.losingStreakScenarioPassed,
      strategyClarityPassed:
        localPhase.strategyClarityPassed || remotePhase.strategyClarityPassed,
    },
  })
}

/** @deprecated Use mergeAnonymousPreviewState — anonymous preview only. */
export const mergeLearningStates = mergeAnonymousPreviewState

export async function fetchUserProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle()

  if (error || !data) return null

  const { data: streakRow } = await supabase
    .from("streaks")
    .select("current_streak")
    .eq("user_id", userId)
    .maybeSingle()

  return {
    id: data.id,
    name: data.display_name ?? "Trader",
    email: data.email ?? "",
    avatarUrl: data.avatar_url,
    tradingExperience: normalizeExperienceLevel(
      data.experience_level ?? data.trading_experience
    ),
    createdAt: data.created_at,
    currentLevel: data.level ?? levelFromXP(data.xp ?? 0),
    totalXP: data.xp ?? 0,
    streakDays: streakRow?.current_streak ?? data.streak ?? 0,
    weeklyTarget: data.weekly_target_days,
    lessonsCompleted: data.lessons_completed ?? 0,
    quizzesCompleted: data.quizzes_completed ?? 0,
    drillsCompleted: data.drills_completed ?? 0,
    strongestSkill: data.strongest_skill,
    weakestSkill: data.weakest_skill,
    onboardingCompleted: data.onboarding_completed ?? false,
    username: normalizeProfileUsername(data.username) || null,
    tradingGoals: normalizeTradingGoals(data.trading_goals),
    preferredMarket: data.preferred_market ?? null,
    studyIntensity: normalizeStudyIntensity(data.study_intensity),
    learningPlan: normalizeLearningPlan(data.learning_plan),
    country: normalizeProfileCountry(data.country) || null,
    publicLeaderboard:
      data.public_leaderboard ?? data.leaderboard_opt_in ?? false,
  }
}

export async function fetchEnrollments(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  const { data } = await supabase
    .from("feature_enrollments")
    .select("feature_id")
    .eq("user_id", userId)

  return data?.map((r) => r.feature_id) ?? []
}

/** Anonymous localStorage progress — not used for authenticated users. */
export function getAnonymousLocalState(): UserState {
  return loadUserState()
}
