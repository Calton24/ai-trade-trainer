import type { SupabaseClient } from "@supabase/supabase-js"

import {
  assertOnboardingProfileUpdate,
  buildOnboardingProfileUpdate,
  PROFILE_ONBOARDING_SELECT,
} from "@/lib/data/onboarding-profile-update"
import { formatOnboardingSaveError } from "@/lib/data/onboarding-schema"
import {
  DEFAULT_ONBOARDING_DATA,
  type OnboardingData,
  type OnboardingState,
  type OnboardingStep,
} from "@/lib/onboarding/types"
import {
  isLeaderboardUsernameRequiredError,
  normalizeUsername,
  validateStep,
} from "@/lib/onboarding/validation"
import type { Json } from "@/lib/supabase/database.types"
import { isMissingColumnError } from "@/lib/data/onboarding-schema"
import {
  clampWeeklyTargetDays,
  normalizeExperienceLevel,
  normalizeLearningPlan,
  normalizeProfileCountry,
  normalizeProfileUsername,
  normalizeStudyIntensity,
  normalizeTradingGoals,
} from "@/lib/settings/profile-normalization"

const PROFILE_ONBOARDING_SELECT_LEGACY =
  "display_name, username, country, experience_level, trading_goals, study_intensity, learning_plan, weekly_target_days, public_leaderboard, leaderboard_opt_in, onboarding_completed, updated_at"

interface ProfileOnboardingRow {
  display_name: string | null
  username: string | null
  country: string | null
  experience_level: string | null
  trading_goals: Json | string[] | null
  preferred_market?: string | null
  study_intensity: string | null
  learning_plan: string | null
  weekly_target_days: number | null
  public_leaderboard?: boolean | null
  leaderboard_opt_in?: boolean | null
  onboarding_step?: number | null
  onboarding_completed: boolean | null
  onboarding_completed_at?: string | null
  updated_at: string | null
}

function rowToData(row: ProfileOnboardingRow): OnboardingData {
  const publicBoard = row.public_leaderboard ?? row.leaderboard_opt_in ?? false

  return {
    displayName: row.display_name ?? "",
    username: normalizeProfileUsername(row.username),
    country: normalizeProfileCountry(row.country),
    optInLeaderboard: Boolean(publicBoard),
    experienceLevel:
      normalizeExperienceLevel(row.experience_level) ?? "complete-beginner",
    tradingGoals: normalizeTradingGoals(row.trading_goals),
    preferredMarket: row.preferred_market ?? "",
    studyIntensity: normalizeStudyIntensity(row.study_intensity, "consistent"),
    learningPlan: normalizeLearningPlan(row.learning_plan, "six-month"),
    weeklyTargetDays: clampWeeklyTargetDays(row.weekly_target_days),
  }
}

export function inferOnboardingStep(
  data: OnboardingData,
  savedStep?: number | null
): OnboardingStep {
  if (savedStep && savedStep >= 1 && savedStep <= 4) {
    return savedStep as OnboardingStep
  }
  if (!data.displayName.trim()) return 1
  if (!data.experienceLevel) return 2
  if (!data.studyIntensity || !data.learningPlan) return 3
  return 4
}

export async function getOnboardingState(
  supabase: SupabaseClient,
  userId: string
): Promise<OnboardingState | null> {
  let data: ProfileOnboardingRow | null = null
  let error: { message: string } | null = null

  const full = await supabase
    .from("profiles")
    .select(PROFILE_ONBOARDING_SELECT)
    .eq("id", userId)
    .maybeSingle()

  if (full.error && isMissingColumnError(full.error)) {
    const minimal = await supabase
      .from("profiles")
      .select(PROFILE_ONBOARDING_SELECT_LEGACY)
      .eq("id", userId)
      .maybeSingle()
    data = minimal.data as ProfileOnboardingRow | null
    error = minimal.error
  } else {
    data = full.data as ProfileOnboardingRow | null
    error = full.error
  }

  if (error || !data) return null

  const onboardingData = rowToData(data)
  const step = inferOnboardingStep(onboardingData, data.onboarding_step)

  return {
    ...onboardingData,
    step,
    onboardingCompleted: data.onboarding_completed ?? false,
    updatedAt: data.updated_at,
  }
}

async function updateProfilePatch(
  supabase: SupabaseClient,
  userId: string,
  patch: ReturnType<typeof buildOnboardingProfileUpdate>
): Promise<{ error?: string }> {
  assertOnboardingProfileUpdate(patch)

  const { error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", userId)

  if (error) {
    return { error: formatOnboardingSaveError(error) }
  }

  return {}
}

function formatValidationError(message: string | null): string | null {
  if (!message) return null
  if (isLeaderboardUsernameRequiredError(message)) {
    return "Choose a username to appear on public leaderboards, or turn this off for now."
  }
  return message
}

async function assertUsernameAvailable(
  supabase: SupabaseClient,
  userId: string,
  username: string
): Promise<{ error?: string }> {
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .neq("id", userId)
    .maybeSingle()

  if (existing) return { error: "Username is already taken." }
  return {}
}

export async function saveOnboardingStep(
  supabase: SupabaseClient,
  userId: string,
  step: OnboardingStep,
  data: OnboardingData
): Promise<{ error?: string; updatedAt?: string }> {
  const validationError = formatValidationError(validateStep(step, data))
  if (validationError) return { error: validationError }

  const username = normalizeUsername(data.username)
  if (username) {
    const taken = await assertUsernameAvailable(supabase, userId, username)
    if (taken.error) return taken
  }

  const patch = buildOnboardingProfileUpdate({ data, step })
  const updateResult = await updateProfilePatch(supabase, userId, patch)
  if (updateResult.error) return updateResult

  await supabase.from("weekly_targets").upsert(
    {
      user_id: userId,
      days_per_week: patch.weekly_target_days ?? data.weeklyTargetDays,
      updated_at: patch.updated_at,
    },
    { onConflict: "user_id" }
  )

  return { updatedAt: patch.updated_at }
}

export async function checkUsernameAvailable(
  supabase: SupabaseClient,
  userId: string,
  username: string
): Promise<{ available: boolean; error?: string }> {
  const normalized = normalizeUsername(username)
  if (!normalized) return { available: true }
  if (!/^[a-z0-9_-]{3,24}$/.test(normalized)) {
    return { available: false, error: "Invalid username format." }
  }

  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", normalized)
    .neq("id", userId)
    .maybeSingle()

  return { available: !data }
}

export async function completeOnboarding(
  supabase: SupabaseClient,
  userId: string,
  data: OnboardingData
): Promise<{ error?: string }> {
  const validationError = formatValidationError(validateStep(4, data))
  if (validationError) return { error: validationError }

  const username = normalizeUsername(data.username)
  if (username) {
    const taken = await assertUsernameAvailable(supabase, userId, username)
    if (taken.error) return taken
  }

  const now = new Date().toISOString()
  const patch = buildOnboardingProfileUpdate({
    data,
    step: 4,
    completed: true,
    completedAt: now,
  })

  if (process.env.NODE_ENV === "development") {
    console.debug("[onboarding] final profile payload", patch)
  }

  const updateResult = await updateProfilePatch(supabase, userId, patch)
  if (process.env.NODE_ENV === "development") {
    console.debug("[onboarding] final profile update result", updateResult)
  }
  if (updateResult.error) return updateResult

  await supabase.from("weekly_targets").upsert(
    {
      user_id: userId,
      days_per_week: patch.weekly_target_days ?? data.weeklyTargetDays,
      updated_at: now,
    },
    { onConflict: "user_id" }
  )

  await supabase
    .from("feature_enrollments")
    .upsert(
      { user_id: userId, feature_id: "trading-foundations" },
      { onConflict: "user_id,feature_id" }
    )

  const pathEnrollment = await supabase
    .from("path_enrollments")
    .upsert(
      { user_id: userId, path_id: "trading-foundations" },
      { onConflict: "user_id,path_id" }
    )
  if (pathEnrollment.error) {
    // Non-fatal — feature enrollment still unlocks the path in-app
  }

  return {}
}

export function emptyOnboardingFromAuthMeta(
  name?: string | null,
  email?: string | null
): OnboardingData {
  const fallback =
    name?.trim() ||
    (email ? email.split("@")[0]?.replace(/[._+]/g, " ") : "") ||
    ""
  return {
    ...DEFAULT_ONBOARDING_DATA,
    displayName: fallback,
  }
}
