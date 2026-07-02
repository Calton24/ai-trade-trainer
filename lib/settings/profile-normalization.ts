import type { TradingExperience } from "@/lib/auth/types"
import { normalizeCountryName } from "@/lib/countries"
import { normalizeUsername } from "@/lib/onboarding/validation"
import type { Json } from "@/lib/supabase/database.types"
import {
  TRADING_GOAL_OPTIONS,
  type LearningPlan,
  type StudyIntensity,
  type TradingGoalId,
} from "@/lib/settings/types"

const USERNAME_PLACEHOLDERS = new Set(["public_leaderboard_name"])
const GOAL_IDS = new Set<string>(TRADING_GOAL_OPTIONS.map((goal) => goal.id))

function key(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
}

export function normalizeProfileUsername(
  value: string | null | undefined
): string {
  const username = normalizeUsername(value ?? "")
  if (!username || USERNAME_PLACEHOLDERS.has(username)) return ""
  return username
}

export function normalizeExperienceLevel(
  value: unknown
): TradingExperience | null {
  switch (key(value)) {
    case "complete-beginner":
      return "complete-beginner"
    case "beginner":
      return "beginner"
    case "intermediate":
      return "intermediate"
    case "advanced":
      return "advanced"
    default:
      return null
  }
}

export function normalizeStudyIntensity(
  value: unknown,
  fallback: StudyIntensity = "casual"
): StudyIntensity {
  switch (key(value)) {
    case "locked-in":
      return "locked-in"
    case "consistent":
      return "consistent"
    case "casual":
      return "casual"
    default:
      return fallback
  }
}

export function normalizeLearningPlan(
  value: unknown,
  fallback: LearningPlan = "casual"
): LearningPlan {
  switch (key(value)) {
    case "locked-in":
      return "locked-in"
    case "six-month":
    case "6-month":
      return "six-month"
    case "casual":
      return "casual"
    default:
      return fallback
  }
}

export function normalizeTradingGoals(
  value: Json | string[] | null | undefined
): TradingGoalId[] {
  if (!value) return []
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as Json
      return normalizeTradingGoals(parsed)
    } catch {
      return []
    }
  }
  if (!Array.isArray(value)) return []

  const goals: TradingGoalId[] = []
  for (const goal of value) {
    if (typeof goal === "string" && GOAL_IDS.has(goal)) {
      goals.push(goal as TradingGoalId)
    }
  }
  return goals
}

export function normalizeProfileCountry(
  value: string | null | undefined
): string {
  return normalizeCountryName(value)
}

export function clampWeeklyTargetDays(
  value: number | null | undefined
): number {
  const number = Number(value ?? 3)
  return Math.min(
    7,
    Math.max(1, Math.round(Number.isFinite(number) ? number : 3))
  )
}
