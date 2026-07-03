import type { SupabaseClient } from "@supabase/supabase-js"

import { getDateKey, getWeekKey } from "@/lib/user-state/activity"

export interface XpEventInput {
  source: string
  sourceId?: string
  amount: number
  reason?: string
}

/**
 * `xp_events` is entitlement/leaderboard-adjacent — as of migration 015,
 * `authenticated` has no insert/update/delete privilege on it at all. Only
 * call this with the service-role admin client (see
 * `app/api/progress/sync-gamification/route.ts`), scoped to a
 * server-verified `userId`. Never call this with a browser-supplied
 * Supabase client or a client-supplied `userId`.
 */
export async function recordXpEvent(
  supabase: SupabaseClient,
  userId: string,
  event: XpEventInput
): Promise<void> {
  const dateKey = getDateKey()
  await supabase.from("xp_events").insert({
    user_id: userId,
    source: event.source,
    source_id: event.sourceId ?? null,
    amount: event.amount,
    reason: event.reason ?? null,
    date_key: dateKey,
    week_key: getWeekKey(),
    month_key: dateKey.slice(0, 7),
  })
}

/**
 * `user_stats` is entitlement/leaderboard-adjacent — as of migration 015,
 * `authenticated` has no insert/update privilege on it at all. Only call
 * this with the service-role admin client, scoped to a server-verified
 * `userId`. See `recordXpEvent` above for the same rule.
 */
export async function syncUserStats(
  supabase: SupabaseClient,
  userId: string,
  stats: {
    lifetimeXp: number
    highestRankTier: number
    currentStreak: number
    longestStreak: number
    competencyScore: number
    lessonsCompleted: number
    quizzesCompleted: number
    drillsCompleted: number
    booksCompleted: number
    simulationsCompleted: number
    lastActivityAt: string | null
  }
): Promise<void> {
  await supabase.from("user_stats").upsert(
    {
      user_id: userId,
      lifetime_xp: stats.lifetimeXp,
      highest_rank_tier: stats.highestRankTier,
      current_streak: stats.currentStreak,
      longest_streak: stats.longestStreak,
      competency_score: stats.competencyScore,
      lessons_completed: stats.lessonsCompleted,
      quizzes_completed: stats.quizzesCompleted,
      drills_completed: stats.drillsCompleted,
      books_completed: stats.booksCompleted,
      simulations_completed: stats.simulationsCompleted,
      last_activity_at: stats.lastActivityAt,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )
}
