import { getDateKey, getWeekKey } from "@/lib/user-state/activity"
import type {
  ActivityLogItem,
  ActivityType,
  UserState,
} from "@/lib/user-state/types"

import { XP_REWARDS } from "./levels"

export type ChallengePeriod = "daily" | "weekly" | "monthly"

export interface ChallengeObjective {
  id: string
  label: string
  target: number
  current: number
  done: boolean
}

export interface ChallengeSet {
  id: string
  period: ChallengePeriod
  title: string
  rewardXp: number
  objectives: ChallengeObjective[]
  completed: number
  total: number
  allDone: boolean
  claimed: boolean
  /** True once all objectives are met and reward has not yet been claimed. */
  claimable: boolean
}

const LESSON_TYPES: ActivityType[] = ["lesson-complete", "book-concept-complete"]
const QUIZ_TYPES: ActivityType[] = ["quiz-complete"]
const DRILL_TYPES: ActivityType[] = [
  "chart-drill-complete",
  "chart-lab-complete",
  "trend-exercise-complete",
  "strategy-practice-complete",
]
const REFLECTION_TYPES: ActivityType[] = ["journal-reflection", "practice-complete"]
const SIM_TYPES: ActivityType[] = ["simulator-session-complete"]

function countTypes(items: ActivityLogItem[], types: ActivityType[]): number {
  const set = new Set(types)
  return items.filter((a) => set.has(a.type)).length
}

function xpSum(items: ActivityLogItem[]): number {
  return items.reduce((sum, a) => sum + a.xpAwarded, 0)
}

function activeDays(items: ActivityLogItem[]): number {
  return new Set(items.map((a) => a.dateKey)).size
}

function todayItems(state: UserState): ActivityLogItem[] {
  const today = getDateKey()
  return state.activityLog.filter((a) => a.dateKey === today)
}

function weekItems(state: UserState): ActivityLogItem[] {
  const weekKey = getWeekKey()
  return state.activityLog.filter((a) => a.weekKey === weekKey)
}

function monthItems(state: UserState): ActivityLogItem[] {
  const month = getDateKey().slice(0, 7)
  return state.activityLog.filter((a) => a.dateKey.startsWith(month))
}

function obj(
  id: string,
  label: string,
  target: number,
  current: number
): ChallengeObjective {
  return { id, label, target, current: Math.min(current, target), done: current >= target }
}

function buildSet(
  id: string,
  period: ChallengePeriod,
  title: string,
  rewardXp: number,
  objectives: ChallengeObjective[],
  claimedIds: string[]
): ChallengeSet {
  const completed = objectives.filter((o) => o.done).length
  const allDone = completed === objectives.length
  const claimed = claimedIds.includes(id)
  return {
    id,
    period,
    title,
    rewardXp,
    objectives,
    completed,
    total: objectives.length,
    allDone,
    claimed,
    claimable: allDone && !claimed,
  }
}

/** Deterministic daily objective selection so it changes day to day. */
function hashKey(key: string): number {
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0
  return h
}

export function getDailyChallenges(state: UserState): ChallengeSet {
  const items = todayItems(state)
  const dateKey = getDateKey()
  const claimed = state.gamification?.claimedChallengeIds ?? []

  const pool: ChallengeObjective[] = [
    obj("d-lessons", "Complete 3 lessons", 3, countTypes(items, LESSON_TYPES)),
    obj("d-quiz", "Pass 1 quiz", 1, countTypes(items, QUIZ_TYPES)),
    obj("d-drill", "Complete 1 chart drill", 1, countTypes(items, DRILL_TYPES)),
    obj("d-xp", "Earn 200 XP today", 200, xpSum(items)),
    obj("d-reflect", "Write 1 reflection", 1, countTypes(items, REFLECTION_TYPES)),
    obj("d-active", "Complete 5 activities", 5, items.length),
  ]

  // Rotate which 3 objectives are active each day.
  const start = hashKey(dateKey) % pool.length
  const objectives = [0, 1, 2].map((i) => pool[(start + i) % pool.length])

  return buildSet(
    `daily-${dateKey}`,
    "daily",
    "Daily Challenge",
    XP_REWARDS.dailyChallengeChest,
    objectives,
    claimed
  )
}

export function getWeeklyChallenges(state: UserState): ChallengeSet {
  const items = weekItems(state)
  const weekKey = getWeekKey()
  const claimed = state.gamification?.claimedChallengeIds ?? []
  const targetDays = Math.min(state.weeklyTarget.daysPerWeek ?? 5, 7)

  const objectives: ChallengeObjective[] = [
    obj("w-xp", "Earn 1,000 XP this week", 1000, xpSum(items)),
    obj("w-quiz", "Pass 5 quizzes", 5, countTypes(items, QUIZ_TYPES)),
    obj("w-active", `Be active ${targetDays} days`, targetDays, activeDays(items)),
    obj("w-sim", "Complete 1 simulation", 1, countTypes(items, SIM_TYPES)),
  ]

  return buildSet(
    `weekly-${weekKey}`,
    "weekly",
    "Weekly Challenge",
    XP_REWARDS.weeklyChallengeBonus,
    objectives,
    claimed
  )
}

export function getMonthlyChallenges(state: UserState): ChallengeSet {
  const items = monthItems(state)
  const month = getDateKey().slice(0, 7)
  const claimed = state.gamification?.claimedChallengeIds ?? []

  const objectives: ChallengeObjective[] = [
    obj("m-xp", "Earn 5,000 XP this month", 5000, xpSum(items)),
    obj("m-lessons", "Complete 20 lessons", 20, countTypes(items, LESSON_TYPES)),
    obj("m-active", "Be active 20 days", 20, activeDays(items)),
    obj("m-sim", "Complete 3 simulations", 3, countTypes(items, SIM_TYPES)),
  ]

  return buildSet(
    `monthly-${month}`,
    "monthly",
    "Monthly Challenge",
    XP_REWARDS.monthlyChallengeBonus,
    objectives,
    claimed
  )
}

export function getAllChallenges(state: UserState): ChallengeSet[] {
  return [
    getDailyChallenges(state),
    getWeeklyChallenges(state),
    getMonthlyChallenges(state),
  ]
}

export function getChallengeById(
  state: UserState,
  id: string
): ChallengeSet | undefined {
  return getAllChallenges(state).find((c) => c.id === id)
}
