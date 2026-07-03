import { getDateKey, getWeekKey } from "@/lib/user-state/activity"
import { computeAllLibraryBookStats } from "@/lib/user-state/library"
import { getRankByTier, getTierForXp } from "@/lib/progression/ranks"
import type { UserState } from "@/lib/user-state/types"

import { getSeededEntries } from "./seed"
import type { LeaderboardEntry, LeaderboardPeriod } from "./types"

export * from "./types"

function periodKeyFor(period: LeaderboardPeriod): string {
  switch (period) {
    case "daily":
      return getDateKey()
    case "weekly":
      return getWeekKey()
    case "monthly":
      return getDateKey().slice(0, 7)
    case "all-time":
      return "all"
  }
}

function userPeriodXp(state: UserState, period: LeaderboardPeriod): number {
  if (period === "all-time") return state.progress.xp
  const log = state.activityLog
  if (period === "daily") {
    const today = getDateKey()
    return log
      .filter((a) => a.dateKey === today)
      .reduce((s, a) => s + a.xpAwarded, 0)
  }
  if (period === "weekly") {
    const week = getWeekKey()
    return log
      .filter((a) => a.weekKey === week)
      .reduce((s, a) => s + a.xpAwarded, 0)
  }
  const month = getDateKey().slice(0, 7)
  return log
    .filter((a) => a.dateKey.startsWith(month))
    .reduce((s, a) => s + a.xpAwarded, 0)
}

export function buildUserEntry(
  state: UserState,
  period: LeaderboardPeriod,
  displayName: string
): LeaderboardEntry {
  const xp = state.progress.xp
  const tier = Math.max(
    state.gamification?.highestRankTier ?? 1,
    getTierForXp(xp)
  )
  const rank = getRankByTier(tier)
  const booksCompleted = Object.values(computeAllLibraryBookStats(state)).filter(
    (b) => b.completed
  ).length

  return {
    id: "current-user",
    rank: 0,
    username: displayName,
    rankTitle: rank.title,
    rankTier: tier,
    insignia: rank.insignia,
    xp,
    periodXp: userPeriodXp(state, period),
    streak: state.progress.streak,
    lessonsCompleted:
      state.lessonProgress.length + state.bookLab.completedConceptIds.length,
    booksCompleted,
    avatar: "🧑‍💻",
    isCurrentUser: true,
    isSeeded: false,
  }
}

export interface LeaderboardResult {
  period: LeaderboardPeriod
  entries: LeaderboardEntry[]
  currentUserRank: number
  currentUserEntry: LeaderboardEntry | null
  /** True when demo personas fill the board (unauthenticated preview only). */
  isDemoBoard: boolean
}

export interface GetLeaderboardOptions {
  /** Demo personas for marketing / offline preview. Off for authenticated users. */
  includeSeeded?: boolean
}

/**
 * Build a ranked leaderboard for the given period.
 * Authenticated production boards should set includeSeeded: false.
 */
export function getLeaderboard(
  state: UserState,
  period: LeaderboardPeriod,
  displayName = "You",
  options: GetLeaderboardOptions = {}
): LeaderboardResult {
  const includeSeeded = options.includeSeeded ?? false
  const user = buildUserEntry(state, period, displayName)

  const metric = (e: LeaderboardEntry) =>
    period === "all-time" ? e.xp : e.periodXp

  const combined = includeSeeded
    ? [...getSeededEntries(period, periodKeyFor(period)), user]
    : [user]

  combined.sort((a, b) => metric(b) - metric(a))
  combined.forEach((e, i) => {
    e.rank = i + 1
  })

  const currentUserEntry = combined.find((e) => e.isCurrentUser) ?? null

  return {
    period,
    entries: combined,
    currentUserRank: currentUserEntry?.rank ?? combined.length,
    currentUserEntry,
    isDemoBoard: includeSeeded,
  }
}
