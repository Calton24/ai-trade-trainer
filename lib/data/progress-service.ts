import type { SupabaseClient } from "@supabase/supabase-js"

import type { UserState } from "@/lib/user-state/types"

const STATE_VERSION = 1

export async function fetchLearningProgress(
  supabase: SupabaseClient,
  userId: string
): Promise<UserState | null> {
  const { data, error } = await supabase
    .from("user_learning_state")
    .select("state_json, updated_at")
    .eq("user_id", userId)
    .maybeSingle()

  if (error || !data?.state_json) return null

  const parsed = data.state_json as Partial<UserState>
  if (!parsed.progress) return null

  return parsed as UserState
}

export async function saveLearningProgress(
  supabase: SupabaseClient,
  userId: string,
  state: UserState
): Promise<{ error?: string }> {
  const { error } = await supabase.from("user_learning_state").upsert(
    {
      user_id: userId,
      state_version: STATE_VERSION,
      state_json: state,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )

  if (error) return { error: error.message }
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
