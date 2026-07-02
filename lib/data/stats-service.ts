import type { SupabaseClient } from "@supabase/supabase-js"

import { syncUserStats } from "./xp-service"

export interface UserStatsRow {
  user_id: string
  lifetime_xp: number
  highest_rank_tier: number
  current_streak: number
  longest_streak: number
  competency_score: number
  lessons_completed: number
  quizzes_completed: number
  drills_completed: number
  books_completed: number
  simulations_completed: number
  last_activity_at: string | null
}

export async function fetchUserStats(
  supabase: SupabaseClient,
  userId: string
): Promise<UserStatsRow | null> {
  const { data, error } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  if (error || !data) return null
  return data as UserStatsRow
}

export { syncUserStats }
