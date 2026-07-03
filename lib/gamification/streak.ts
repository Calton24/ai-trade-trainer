import { getDateKey } from "@/lib/user-state/activity"

/**
 * Trusted daily streak, computed purely from server-known activity dates
 * (distinct `xp_events.date_key` rows) — never from client-reported state.
 * Mirrors the client's `calculateDailyStreak` (`lib/user-state/activity.ts`)
 * algorithm so the number a user sees doesn't jump around, but the
 * underlying dates it walks are always the trusted ones.
 */
export function calculateStreakFromDateKeys(dateKeys: string[]): number {
  const days = new Set(dateKeys)
  if (days.size === 0) return 0

  let streak = 0
  const cursor = new Date()
  const today = getDateKey(cursor)

  if (!days.has(today)) {
    cursor.setDate(cursor.getDate() - 1)
  }

  while (days.has(getDateKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}
