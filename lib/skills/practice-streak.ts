import { getDateKey } from "@/lib/user-state/activity"
import type { UserState } from "@/lib/user-state/types"

export function calculatePracticeStreak(state: UserState): number {
  const practiceDates = new Set<string>()

  for (const a of state.patternAttempts) {
    practiceDates.add(a.completedAt.slice(0, 10))
  }
  for (const d of state.drillSessions) {
    practiceDates.add(d.completedAt.slice(0, 10))
  }
  for (const a of state.trendSpotter.exerciseAttempts) {
    practiceDates.add(a.completedAt.slice(0, 10))
  }
  for (const a of state.simulator.attempts) {
    practiceDates.add(a.completedAt.slice(0, 10))
  }
  for (const a of state.strategyWiki.practiceAttempts) {
    practiceDates.add(a.completedAt.slice(0, 10))
  }

  const sorted = [...practiceDates].sort().reverse()
  if (sorted.length === 0) return 0

  let streak = 0
  const today = getDateKey()
  let cursor = new Date(`${today}T12:00:00`)

  if (!sorted.includes(today)) {
    cursor.setDate(cursor.getDate() - 1)
  }

  while (true) {
    const key = getDateKey(cursor)
    if (!sorted.includes(key)) break
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export function bumpPracticeStreak(state: UserState): UserState {
  const streak = calculatePracticeStreak(state)
  return {
    ...state,
    progress: {
      ...state.progress,
      practiceStreak: streak,
      lastPracticeDate: getDateKey(),
    },
  }
}

export function completeDailyTrainingItem(
  state: UserState,
  itemId: string
): UserState {
  const dateKey = getDateKey()
  const current = state.dailyTraining
  const completedItemIds =
    current?.dateKey === dateKey
      ? [...new Set([...current.completedItemIds, itemId])]
      : [itemId]

  const allComplete = completedItemIds.length >= 4

  return {
    ...state,
    dailyTraining: {
      dateKey,
      completedItemIds,
      allComplete,
      bonusClaimed: current?.dateKey === dateKey ? current.bonusClaimed : false,
    },
  }
}

export function claimDailyTrainingBonus(state: UserState): UserState {
  if (!state.dailyTraining?.allComplete || state.dailyTraining.bonusClaimed) {
    return state
  }
  return {
    ...state,
    dailyTraining: {
      ...state.dailyTraining,
      bonusClaimed: true,
    },
  }
}
