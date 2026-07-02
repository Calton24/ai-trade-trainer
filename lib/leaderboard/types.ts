export type LeaderboardPeriod = "daily" | "weekly" | "monthly" | "all-time"

export interface LeaderboardEntry {
  id: string
  rank: number
  username: string
  rankTitle: string
  rankTier: number
  insignia: string
  /** Lifetime XP. */
  xp: number
  /** XP earned within the selected period (equals xp for all-time). */
  periodXp: number
  streak: number
  lessonsCompleted: number
  booksCompleted: number
  /** Emoji avatar / flag. */
  avatar: string
  country?: string
  isCurrentUser: boolean
  /** Placeholder competitor until the multiplayer backend is enabled. */
  isSeeded: boolean
}

export const LEADERBOARD_PERIOD_LABELS: Record<LeaderboardPeriod, string> = {
  daily: "Today",
  weekly: "This Week",
  monthly: "This Month",
  "all-time": "All Time",
}
