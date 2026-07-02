import type { SupabaseClient } from "@supabase/supabase-js"

import {
  fetchUserSettings,
  saveUserSettings,
  syncProfileFromSettings,
} from "@/lib/settings/repository"
import type { UserSettingsBundle } from "@/lib/settings/types"

export async function loadSettings(
  supabase: SupabaseClient,
  userId: string
): Promise<UserSettingsBundle | null> {
  return fetchUserSettings(supabase, userId)
}

export async function saveSettings(
  supabase: SupabaseClient,
  userId: string,
  settings: UserSettingsBundle
): Promise<{ error?: string }> {
  const result = await saveUserSettings(supabase, userId, settings)
  if (result.error) return result
  return syncProfileFromSettings(supabase, userId, settings)
}
