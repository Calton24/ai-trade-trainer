import { badgeDefinitions } from "@/lib/mock/badges"

import type {
  ActivityLogItem,
  ActivitySource,
  ActivityType,
  LearningActivityInput,
  MotivationEvent,
  UserState,
  WeeklyStreakState,
  WeeklyTargetState,
} from "./types"

/** Local calendar date YYYY-MM-DD */
export function getDateKey(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

/** Monday of the week containing `date`, as YYYY-MM-DD */
export function getWeekKey(date = new Date()): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return getDateKey(d)
}

export function getWeekDayLabels(): string[] {
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
}

export function getWeekDayKeys(weekKey = getWeekKey()): string[] {
  const monday = new Date(`${weekKey}T12:00:00`)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return getDateKey(d)
  })
}

export function getInitialWeeklyTarget(): WeeklyTargetState {
  return { daysPerWeek: null, setAt: null }
}

export function getInitialWeeklyStreak(): WeeklyStreakState {
  return {
    streak: 0,
    activeDaysByWeek: {},
    lastEvaluatedWeekKey: null,
  }
}

export function hasMadeProgressToday(state: UserState): boolean {
  const today = getDateKey()
  return state.activityLog.some((a) => a.dateKey === today)
}

export function getTodayActivity(state: UserState): ActivityLogItem[] {
  const today = getDateKey()
  return state.activityLog.filter((a) => a.dateKey === today)
}

export function calculateDailyStreak(state: UserState): number {
  const days = new Set(state.activityLog.map((a) => a.dateKey))
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

export function calculateWeeklyStreak(state: UserState): number {
  return state.weeklyStreak.streak
}

export function calculateWeeklyTargetProgress(state: UserState) {
  const weekKey = getWeekKey()
  const target = state.weeklyTarget.daysPerWeek ?? 3
  const activeDays = state.weeklyStreak.activeDaysByWeek[weekKey] ?? []
  const dayKeys = getWeekDayKeys(weekKey)
  const completed = activeDays.length
  const met = completed >= target
  const remaining = Math.max(0, target - completed)

  return {
    weekKey,
    target,
    completed,
    remaining,
    met,
    activeDays,
    dayKeys,
    hasTargetSet: state.weeklyTarget.daysPerWeek !== null,
  }
}

function evaluatePreviousWeek(
  state: UserState,
  currentWeekKey: string
): { state: UserState; hitTarget: boolean } {
  const ws = state.weeklyStreak
  if (ws.lastEvaluatedWeekKey === currentWeekKey) {
    return { state, hitTarget: false }
  }

  let streak = ws.streak
  let hitTarget = false

  if (ws.lastEvaluatedWeekKey) {
    const prevKey = ws.lastEvaluatedWeekKey
    const prevDays = ws.activeDaysByWeek[prevKey]?.length ?? 0
    const target = state.weeklyTarget.daysPerWeek ?? 3
    if (state.weeklyTarget.daysPerWeek !== null && prevDays >= target) {
      streak += 1
      hitTarget = true
    } else if (state.weeklyTarget.daysPerWeek !== null) {
      streak = 0
    }
  }

  return {
    state: {
      ...state,
      weeklyStreak: {
        ...ws,
        streak,
        lastEvaluatedWeekKey: currentWeekKey,
      },
    },
    hitTarget,
  }
}

function addActiveDay(state: UserState, dateKey: string, weekKey: string): UserState {
  const existing = state.weeklyStreak.activeDaysByWeek[weekKey] ?? []
  if (existing.includes(dateKey)) return state

  return {
    ...state,
    weeklyStreak: {
      ...state.weeklyStreak,
      activeDaysByWeek: {
        ...state.weeklyStreak.activeDaysByWeek,
        [weekKey]: [...existing, dateKey],
      },
    },
  }
}

function syncDailyStreakProgress(state: UserState): UserState {
  const streak = calculateDailyStreak(state)
  const today = getDateKey()
  return {
    ...state,
    progress: {
      ...state.progress,
      streak,
      lastActivityDate: today,
    },
  }
}

function evaluateWeeklyBadges(state: UserState): UserState {
  const earned = new Set(state.earnedBadgeIds)
  const progress = calculateWeeklyTargetProgress(state)
  const ws = state.weeklyStreak

  if (state.activityLog.length >= 1) earned.add("first-learning-day")
  if (progress.met && progress.hasTargetSet) earned.add("first-weekly-target")
  if (progress.completed >= 3 && progress.hasTargetSet) earned.add("three-day-week")
  if (ws.streak >= 2) earned.add("two-week-streak")
  if (ws.streak >= 4) earned.add("four-week-streak")
  if (ws.streak >= 8) earned.add("eight-week-streak")
  if (ws.streak >= 12) earned.add("twelve-week-streak")
  if (ws.streak >= 12) earned.add("consistent-trader")

  return { ...state, earnedBadgeIds: [...earned] }
}

export function extractMotivationEvents(
  before: UserState,
  after: UserState
): MotivationEvent[] {
  const events: MotivationEvent[] = []
  const hadActivity = before.activityLog.length > 0
  const hadToday = hasMadeProgressToday(before)
  const prevStreak = calculateDailyStreak(before)
  const newStreak = calculateDailyStreak(after)

  if (!hadActivity && after.activityLog.length > 0) {
    events.push({ type: "streak-started", streak: newStreak })
    if (after.weeklyTarget.daysPerWeek === null) {
      events.push({ type: "weekly-target-prompt" })
    }
  } else if (!hadToday && hasMadeProgressToday(after) && newStreak > prevStreak) {
    events.push({ type: "streak-continued", streak: newStreak })
  }

  events.push(...detectBadgeEvents(before, after))

  const beforeWeekly = calculateWeeklyTargetProgress(before)
  const afterWeekly = calculateWeeklyTargetProgress(after)
  if (
    afterWeekly.met &&
    afterWeekly.hasTargetSet &&
    !beforeWeekly.met
  ) {
    events.push({
      type: "weekly-target-hit",
      weeksStreak: after.weeklyStreak.streak,
    })
  } else if (
    afterWeekly.met &&
    afterWeekly.hasTargetSet &&
    after.weeklyStreak.streak > before.weeklyStreak.streak
  ) {
    events.push({
      type: "weekly-target-hit",
      weeksStreak: after.weeklyStreak.streak,
    })
  }

  return events
}

function detectBadgeEvents(before: UserState, after: UserState): MotivationEvent[] {
  const events: MotivationEvent[] = []
  const beforeSet = new Set(before.earnedBadgeIds)
  for (const id of after.earnedBadgeIds) {
    if (!beforeSet.has(id)) {
      const badge = badgeDefinitions.find((b) => b.id === id)
      events.push({
        type: "badge-unlocked",
        badgeId: id,
        badgeName: badge?.name ?? id,
      })
    }
  }
  return events
}

export function recordLearningActivity(
  state: UserState,
  input: LearningActivityInput
): { state: UserState; events: MotivationEvent[] } {
  const events: MotivationEvent[] = []
  const before = state
  const now = new Date()
  const dateKey = getDateKey(now)
  const weekKey = getWeekKey(now)
  const hadActivityBefore = state.activityLog.length > 0
  const hadTodayBefore = hasMadeProgressToday(state)
  const prevStreak = calculateDailyStreak(state)

  let next: UserState = {
    ...state,
    activityLog: [
      {
        id: crypto.randomUUID(),
        type: input.type,
        source: input.source,
        title: input.title,
        entityId: input.entityId,
        xpAwarded: input.xpAwarded ?? 0,
        completedAt: now.toISOString(),
        dateKey,
        weekKey,
      },
      ...state.activityLog,
    ].slice(0, 500),
  }

  const rollover = evaluatePreviousWeek(next, weekKey)
  next = rollover.state
  if (rollover.hitTarget) {
    events.push({
      type: "weekly-target-hit",
      weeksStreak: next.weeklyStreak.streak,
    })
  }

  next = addActiveDay(next, dateKey, weekKey)
  next = syncDailyStreakProgress(next)
  next = evaluateWeeklyBadges(next)

  const newStreak = calculateDailyStreak(next)
  if (!hadActivityBefore) {
    events.push({ type: "streak-started", streak: newStreak })
    if (next.weeklyTarget.daysPerWeek === null) {
      events.push({ type: "weekly-target-prompt" })
    }
  } else if (!hadTodayBefore && newStreak > prevStreak) {
    events.push({ type: "streak-continued", streak: newStreak })
  }

  events.push(...detectBadgeEvents(before, next))

  return { state: next, events }
}

export function setWeeklyTarget(
  state: UserState,
  daysPerWeek: number
): UserState {
  return {
    ...state,
    weeklyTarget: {
      daysPerWeek,
      setAt: new Date().toISOString(),
    },
  }
}

export function getGlobalProgressSnapshot(state: UserState) {
  const weekly = calculateWeeklyTargetProgress(state)
  return {
    dailyStreak: calculateDailyStreak(state),
    weeklyStreak: state.weeklyStreak.streak,
    weeklyTarget: weekly,
    todayActivity: getTodayActivity(state),
    totalActivities: state.activityLog.length,
    bookLabCompleted: state.bookLab.completedConceptIds.length,
    lessonsCompleted: state.lessonProgress.length,
    quizzesCompleted: state.quizAttempts.length,
    drillsCompleted: state.drillSessions.length,
    journalEntries: state.journalEntries.length,
    xp: state.progress.xp,
    level: state.progress.level,
  }
}

export type { ActivityType, ActivitySource, LearningActivityInput, MotivationEvent }
