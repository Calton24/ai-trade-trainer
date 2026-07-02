import type { Database, Json } from "@/lib/supabase/database.types"
import { normalizeCountryName } from "@/lib/countries"
import type { OnboardingData, OnboardingStep } from "@/lib/onboarding/types"
import { normalizeUsername } from "@/lib/onboarding/validation"

/** Columns onboarding is allowed to write on public.profiles */
export const ONBOARDING_PROFILE_UPDATE_KEYS = [
  "display_name",
  "username",
  "country",
  "experience_level",
  "trading_goals",
  "preferred_market",
  "study_intensity",
  "learning_plan",
  "weekly_target_days",
  "public_leaderboard",
  "onboarding_step",
  "onboarding_completed",
  "onboarding_completed_at",
  "updated_at",
] as const satisfies readonly (keyof Database["public"]["Tables"]["profiles"]["Update"])[]

export type OnboardingProfileUpdate = Pick<
  Database["public"]["Tables"]["profiles"]["Update"],
  (typeof ONBOARDING_PROFILE_UPDATE_KEYS)[number]
>

export const PROFILE_ONBOARDING_SELECT_COLUMNS = [
  "display_name",
  "username",
  "country",
  "experience_level",
  "trading_goals",
  "preferred_market",
  "study_intensity",
  "learning_plan",
  "weekly_target_days",
  "public_leaderboard",
  "leaderboard_opt_in",
  "onboarding_step",
  "onboarding_completed",
  "onboarding_completed_at",
  "updated_at",
] as const

export const PROFILE_ONBOARDING_SELECT = PROFILE_ONBOARDING_SELECT_COLUMNS.join(", ")

function clampWeeklyTargetDays(days: number): number {
  return Math.min(7, Math.max(1, Math.round(days)))
}

function toTradingGoalsJson(goals: OnboardingData["tradingGoals"]): Json {
  return goals as Json
}

export interface BuildOnboardingProfileUpdateOptions {
  data: OnboardingData
  step: OnboardingStep
  completed?: boolean
  completedAt?: string | null
}

/** Build a typed, normalized profile patch for onboarding saves. */
export function buildOnboardingProfileUpdate(
  options: BuildOnboardingProfileUpdateOptions
): OnboardingProfileUpdate {
  const { data, step, completed = false, completedAt = null } = options
  const username = normalizeUsername(data.username)
  const publicLeaderboard = data.optInLeaderboard && Boolean(username)

  const patch: OnboardingProfileUpdate = {
    display_name: data.displayName.trim() || null,
    username: username || null,
    country: normalizeCountryName(data.country) || null,
    experience_level: data.experienceLevel,
    trading_goals: toTradingGoalsJson(data.tradingGoals),
    preferred_market: data.preferredMarket.trim() || null,
    study_intensity: data.studyIntensity,
    learning_plan: data.learningPlan,
    weekly_target_days: clampWeeklyTargetDays(data.weeklyTargetDays),
    public_leaderboard: publicLeaderboard,
    onboarding_step: step,
    onboarding_completed: completed,
    onboarding_completed_at: completed ? (completedAt ?? new Date().toISOString()) : null,
    updated_at: new Date().toISOString(),
  }

  return stripUndefined(patch)
}

function stripUndefined(patch: OnboardingProfileUpdate): OnboardingProfileUpdate {
  const next: OnboardingProfileUpdate = {}
  for (const key of ONBOARDING_PROFILE_UPDATE_KEYS) {
    const value = patch[key]
    if (value !== undefined) {
      ;(next as Record<string, unknown>)[key] = value
    }
  }
  return next
}

/** Fail loudly in dev if payload contains keys outside the allowlist. */
export function assertOnboardingProfileUpdate(
  patch: OnboardingProfileUpdate
): void {
  if (process.env.NODE_ENV !== "development") return

  for (const key of Object.keys(patch)) {
    if (
      !ONBOARDING_PROFILE_UPDATE_KEYS.includes(
        key as (typeof ONBOARDING_PROFILE_UPDATE_KEYS)[number]
      )
    ) {
      throw new Error(
        `[onboarding] Unknown profiles column in payload: "${key}". ` +
          `Allowed: ${ONBOARDING_PROFILE_UPDATE_KEYS.join(", ")}`
      )
    }
  }
}
