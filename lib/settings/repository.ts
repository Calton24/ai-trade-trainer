import type { SupabaseClient } from "@supabase/supabase-js"

import type { UserProfile } from "@/lib/auth/types"
import type { Json } from "@/lib/supabase/database.types"
import { getDefaultSettings } from "./defaults"
import type {
  NotificationPreferences,
  PrivacySettings,
  UserSettingsBundle,
} from "./types"
import {
  clampWeeklyTargetDays,
  normalizeExperienceLevel,
  normalizeLearningPlan,
  normalizeProfileCountry,
  normalizeProfileUsername,
  normalizeStudyIntensity,
  normalizeTradingGoals,
} from "./profile-normalization"

interface ProfileSettingsRow {
  display_name: string | null
  username: string | null
  avatar_url: string | null
  country: string | null
  experience_level: string | null
  trading_experience?: string | null
  trading_goals: Json | null
  preferred_market: string | null
  study_intensity: string | null
  learning_plan: string | null
  weekly_target_days: number | null
  public_leaderboard: boolean | null
  leaderboard_opt_in: boolean | null
}

export async function fetchUserSettings(
  supabase: SupabaseClient,
  userId: string
): Promise<UserSettingsBundle | null> {
  const { data, error } = await supabase
    .from("user_settings")
    .select("settings_json")
    .eq("user_id", userId)
    .maybeSingle()

  if (error || !data?.settings_json) return null
  const defaults = getDefaultSettings()
  const parsed = data.settings_json as Partial<UserSettingsBundle>
  return {
    ...defaults,
    ...parsed,
    profile: { ...defaults.profile, ...parsed.profile },
    privacy: { ...defaults.privacy, ...parsed.privacy },
    notifications: { ...defaults.notifications, ...parsed.notifications },
  }
}

export async function saveUserSettings(
  supabase: SupabaseClient,
  userId: string,
  settings: UserSettingsBundle
): Promise<{ error?: string }> {
  const { error } = await supabase.from("user_settings").upsert(
    {
      user_id: userId,
      settings_json: settings,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )
  if (error) return { error: error.message }
  return {}
}

export async function fetchPrivacySettings(
  supabase: SupabaseClient,
  userId: string
): Promise<PrivacySettings | null> {
  const { data, error } = await supabase
    .from("privacy_settings")
    .select(
      "leaderboard_visible, show_country, show_streak, show_trader_rank, show_username, friend_leaderboard_visible"
    )
    .eq("user_id", userId)
    .maybeSingle()

  if (error || !data) return null

  return {
    leaderboardVisible: data.leaderboard_visible,
    showCountryOnLeaderboard: data.show_country,
    showStreakPublicly: data.show_streak,
    showTraderRankPublicly: data.show_trader_rank,
    showUsernamePublicly: data.show_username,
    friendLeaderboardVisible: data.friend_leaderboard_visible,
  }
}

export async function fetchNotificationPreferences(
  supabase: SupabaseClient,
  userId: string
): Promise<NotificationPreferences | null> {
  const { data, error } = await supabase
    .from("notification_preferences")
    .select(
      "daily_reminder, weekly_target_reminder, streak_reminder, challenge_reminder, new_content_updates, leaderboard_updates"
    )
    .eq("user_id", userId)
    .maybeSingle()

  if (error || !data) return null

  return {
    dailyReminder: data.daily_reminder,
    weeklyTargetReminder: data.weekly_target_reminder,
    streakReminder: data.streak_reminder,
    challengeReminder: data.challenge_reminder,
    newContentUpdates: data.new_content_updates,
    leaderboardUpdates: data.leaderboard_updates,
  }
}

/** Load the full settings bundle for an authenticated user (Supabase only). */
export async function fetchAuthenticatedSettingsBundle(
  supabase: SupabaseClient,
  userId: string
): Promise<UserSettingsBundle> {
  const defaults = getDefaultSettings()
  const [userSettings, profileSettings, privacy, notifications] =
    await Promise.all([
      fetchUserSettings(supabase, userId),
      fetchProfileSettings(supabase, userId),
      fetchPrivacySettings(supabase, userId),
      fetchNotificationPreferences(supabase, userId),
    ])

  const profile = profileSettings?.profile ?? defaults.profile
  const profilePrivacy = profileSettings?.privacy ?? {}

  return {
    profile,
    privacy: {
      ...defaults.privacy,
      ...(privacy ?? {}),
      leaderboardVisible:
        privacy?.leaderboardVisible ??
        profilePrivacy.leaderboardVisible ??
        defaults.privacy.leaderboardVisible,
    },
    notifications: notifications ?? defaults.notifications,
    billingPlan: userSettings?.billingPlan ?? defaults.billingPlan,
    updatedAt: userSettings?.updatedAt ?? defaults.updatedAt,
  }
}

export async function syncPrivacySettings(
  supabase: SupabaseClient,
  userId: string,
  privacy: PrivacySettings
): Promise<{ error?: string }> {
  const { error } = await supabase.from("privacy_settings").upsert(
    {
      user_id: userId,
      leaderboard_visible: privacy.leaderboardVisible,
      show_country: privacy.showCountryOnLeaderboard,
      show_streak: privacy.showStreakPublicly,
      show_trader_rank: privacy.showTraderRankPublicly,
      show_username: privacy.showUsernamePublicly,
      friend_leaderboard_visible: privacy.friendLeaderboardVisible,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )
  if (error) return { error: error.message }
  return {}
}

export async function syncNotificationPreferences(
  supabase: SupabaseClient,
  userId: string,
  notifications: NotificationPreferences
): Promise<{ error?: string }> {
  const { error } = await supabase.from("notification_preferences").upsert(
    {
      user_id: userId,
      daily_reminder: notifications.dailyReminder,
      weekly_target_reminder: notifications.weeklyTargetReminder,
      streak_reminder: notifications.streakReminder,
      challenge_reminder: notifications.challengeReminder,
      new_content_updates: notifications.newContentUpdates,
      leaderboard_updates: notifications.leaderboardUpdates,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )
  if (error) return { error: error.message }
  return {}
}

export async function fetchProfileSettings(
  supabase: SupabaseClient,
  userId: string
): Promise<{
  profile: UserSettingsBundle["profile"]
  privacy: Partial<UserSettingsBundle["privacy"]>
} | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "display_name, username, avatar_url, country, experience_level, trading_experience, trading_goals, preferred_market, study_intensity, learning_plan, weekly_target_days, public_leaderboard, leaderboard_opt_in"
    )
    .eq("id", userId)
    .maybeSingle()

  if (error || !data) return null

  const defaults = getDefaultSettings()
  const profile = data as ProfileSettingsRow
  const username = normalizeProfileUsername(profile.username)

  const bundle = {
    profile: {
      ...defaults.profile,
      displayName: profile.display_name ?? "",
      username,
      avatarUrl: profile.avatar_url ?? null,
      country: normalizeProfileCountry(profile.country),
      tradingExperience: normalizeExperienceLevel(
        profile.experience_level ?? profile.trading_experience
      ),
      tradingGoals: normalizeTradingGoals(profile.trading_goals),
      preferredMarket: profile.preferred_market ?? "",
      studyIntensity: normalizeStudyIntensity(profile.study_intensity),
      weeklyTargetDays: clampWeeklyTargetDays(profile.weekly_target_days),
      learningPlan: normalizeLearningPlan(profile.learning_plan),
    },
    privacy: {
      leaderboardVisible: Boolean(
        (profile.public_leaderboard ?? profile.leaderboard_opt_in) && username
      ),
    },
  }

  if (process.env.NODE_ENV === "development") {
    console.debug("[settings] loaded profile", profile)
  }

  return bundle
}

export async function syncProfileFromSettings(
  supabase: SupabaseClient,
  userId: string,
  settings: UserSettingsBundle
): Promise<{ error?: string }> {
  const { profile, privacy } = settings
  const username = normalizeProfileUsername(profile.username)
  const publicLeaderboard = privacy.leaderboardVisible && Boolean(username)
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: profile.displayName || null,
      username: username || null,
      country: normalizeProfileCountry(profile.country) || null,
      experience_level: profile.tradingExperience,
      trading_goals: profile.tradingGoals,
      preferred_market: profile.preferredMarket || null,
      study_intensity: normalizeStudyIntensity(profile.studyIntensity),
      learning_plan: normalizeLearningPlan(profile.learningPlan),
      weekly_target_days: clampWeeklyTargetDays(profile.weeklyTargetDays),
      avatar_url: profile.avatarUrl,
      public_leaderboard: publicLeaderboard,
      leaderboard_opt_in: publicLeaderboard,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) return { error: error.message }

  const privacyResult = await syncPrivacySettings(supabase, userId, privacy)
  if (privacyResult.error) return privacyResult

  const notificationResult = await syncNotificationPreferences(
    supabase,
    userId,
    settings.notifications
  )
  if (notificationResult.error) return notificationResult

  return {}
}

export async function recordProgressReset(
  supabase: SupabaseClient,
  userId: string,
  section: string
): Promise<void> {
  await supabase.from("progress_reset_events").insert({
    user_id: userId,
    section,
  })
}

export async function requestAccountDeletion(
  supabase: SupabaseClient,
  userId: string
): Promise<{ error?: string }> {
  const { error } = await supabase.from("account_deletion_requests").upsert(
    {
      user_id: userId,
      status: "pending",
      requested_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )
  if (error) return { error: error.message }
  return {}
}

/** Merge remote profile fields into settings bundle. */
export function mergeProfileIntoSettings(
  settings: UserSettingsBundle,
  profile: UserProfile | null
): UserSettingsBundle {
  if (!profile) return settings
  const username = normalizeProfileUsername(profile.username)
  const tradingGoals = Array.isArray(profile.tradingGoals)
    ? normalizeTradingGoals(profile.tradingGoals)
    : settings.profile.tradingGoals
  return {
    ...settings,
    profile: {
      ...settings.profile,
      displayName: profile.name || settings.profile.displayName,
      username,
      avatarUrl: profile.avatarUrl ?? settings.profile.avatarUrl,
      country:
        normalizeProfileCountry(profile.country) || settings.profile.country,
      tradingExperience:
        normalizeExperienceLevel(profile.tradingExperience) ??
        settings.profile.tradingExperience,
      tradingGoals,
      preferredMarket:
        profile.preferredMarket ?? settings.profile.preferredMarket,
      studyIntensity: normalizeStudyIntensity(
        profile.studyIntensity,
        settings.profile.studyIntensity
      ),
      learningPlan: normalizeLearningPlan(
        profile.learningPlan,
        settings.profile.learningPlan
      ),
      weeklyTargetDays:
        profile.weeklyTarget ?? settings.profile.weeklyTargetDays,
    },
    privacy: {
      ...settings.privacy,
      leaderboardVisible:
        typeof profile.publicLeaderboard === "boolean"
          ? profile.publicLeaderboard && Boolean(username)
          : settings.privacy.leaderboardVisible,
    },
  }
}
