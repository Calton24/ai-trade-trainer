import type { SupabaseClient } from "@supabase/supabase-js"

import type { UserProfile, TradingExperience } from "@/lib/auth/types"
import { levelFromXP } from "@/lib/progression/levels"
import type {
  StudyIntensity,
  LearningPlan,
  TradingGoalId,
} from "@/lib/settings/types"
import {
  normalizeExperienceLevel,
  normalizeLearningPlan,
  normalizeProfileCountry,
  normalizeProfileUsername,
  normalizeStudyIntensity,
  normalizeTradingGoals,
} from "@/lib/settings/profile-normalization"

export interface OnboardingInput {
  displayName: string
  username?: string
  optInLeaderboard?: boolean
  country: string
  experienceLevel: TradingExperience
  tradingGoals: TradingGoalId[]
  studyIntensity: StudyIntensity
  weeklyTargetDays: number
  learningPlan: LearningPlan
}

export async function fetchProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<
  | (UserProfile & { onboardingCompleted: boolean; username: string | null })
  | null
> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle()

  if (error || !data) return null

  const { data: streakRow } = await supabase
    .from("streaks")
    .select("current_streak")
    .eq("user_id", userId)
    .maybeSingle()

  return {
    id: data.id,
    name: data.display_name ?? "Trader",
    email: data.email ?? "",
    avatarUrl: data.avatar_url,
    tradingExperience: normalizeExperienceLevel(
      data.experience_level ?? data.trading_experience
    ),
    createdAt: data.created_at,
    currentLevel: data.level ?? levelFromXP(data.xp ?? 0),
    totalXP: data.xp ?? 0,
    streakDays: streakRow?.current_streak ?? data.streak ?? 0,
    weeklyTarget: data.weekly_target_days,
    lessonsCompleted: data.lessons_completed ?? 0,
    quizzesCompleted: data.quizzes_completed ?? 0,
    drillsCompleted: data.drills_completed ?? 0,
    strongestSkill: data.strongest_skill,
    weakestSkill: data.weakest_skill,
    onboardingCompleted: data.onboarding_completed ?? false,
    username: normalizeProfileUsername(data.username) || null,
    tradingGoals: normalizeTradingGoals(data.trading_goals),
    preferredMarket: data.preferred_market ?? null,
    studyIntensity: normalizeStudyIntensity(data.study_intensity),
    learningPlan: normalizeLearningPlan(data.learning_plan),
    country: normalizeProfileCountry(data.country) || null,
    publicLeaderboard:
      data.public_leaderboard ?? data.leaderboard_opt_in ?? false,
  }
}

export async function completeOnboarding(
  supabase: SupabaseClient,
  userId: string,
  input: OnboardingInput
): Promise<{ error?: string }> {
  const { completeOnboarding: finalize } = await import("./onboarding-service")
  return finalize(supabase, userId, {
    displayName: input.displayName,
    username: input.username ?? "",
    country: input.country,
    optInLeaderboard: input.optInLeaderboard ?? false,
    experienceLevel: input.experienceLevel,
    tradingGoals: input.tradingGoals,
    preferredMarket: "",
    studyIntensity: input.studyIntensity,
    learningPlan: input.learningPlan,
    weeklyTargetDays: input.weeklyTargetDays,
  })
}
