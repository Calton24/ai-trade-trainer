import type { SupabaseClient } from "@supabase/supabase-js"

import { getRankByTier } from "@/lib/progression/ranks"
import type { LeaderboardEntry, LeaderboardPeriod } from "@/lib/leaderboard/types"

interface LeaderboardRow {
  user_id: string
  username: string
  display_name: string
  avatar_url: string | null
  country: string | null
  lifetime_xp: number
  current_streak: number
  highest_rank_tier: number
  competency_score: number
  daily_xp: number
  weekly_xp: number
  monthly_xp: number
  lessons_completed: number
  books_completed: number
}

function periodXp(row: LeaderboardRow, period: LeaderboardPeriod): number {
  switch (period) {
    case "daily":
      return row.daily_xp
    case "weekly":
      return row.weekly_xp
    case "monthly":
      return row.monthly_xp
    case "all-time":
      return row.lifetime_xp
  }
}

export async function fetchPublicLeaderboard(
  supabase: SupabaseClient,
  period: LeaderboardPeriod,
  limit = 50
): Promise<LeaderboardEntry[]> {
  const orderColumn =
    period === "daily"
      ? "daily_xp"
      : period === "weekly"
        ? "weekly_xp"
        : period === "monthly"
          ? "monthly_xp"
          : "lifetime_xp"

  const { data, error } = await supabase
    .from("leaderboard_public")
    .select("*")
    .order(orderColumn, { ascending: false })
    .limit(limit)

  if (error || !data) return []

  return (data as LeaderboardRow[]).map((row, index) => {
    const rank = getRankByTier(row.highest_rank_tier)
    return {
      id: row.user_id,
      rank: index + 1,
      username: row.username || row.display_name,
      rankTitle: rank.title,
      rankTier: row.highest_rank_tier,
      insignia: rank.insignia,
      xp: row.lifetime_xp,
      periodXp: periodXp(row, period),
      streak: row.current_streak,
      lessonsCompleted: row.lessons_completed,
      booksCompleted: row.books_completed,
      avatar: row.avatar_url ?? "🧑‍💻",
      country: row.country ?? undefined,
      isCurrentUser: false,
      isSeeded: false,
    }
  })
}
