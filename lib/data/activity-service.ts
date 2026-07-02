import type { SupabaseClient } from "@supabase/supabase-js"

import type { ActivityLogItem } from "@/lib/user-state/types"
import { recordXpEvent } from "./xp-service"

export interface ActivityCompletionInput {
  entityType: string
  entityId: string
  status?: "not_started" | "in_progress" | "completed"
  score?: number | null
  xpAmount: number
  source: string
  reason?: string
}

export async function upsertUserProgress(
  supabase: SupabaseClient,
  userId: string,
  input: ActivityCompletionInput
): Promise<void> {
  const now = new Date().toISOString()
  await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      entity_type: input.entityType,
      entity_id: input.entityId,
      status: input.status ?? "completed",
      score: input.score ?? null,
      attempts: 1,
      completed_at: input.status === "completed" ? now : null,
      updated_at: now,
    },
    { onConflict: "user_id,entity_type,entity_id" }
  )
}

export async function recordActivityCompletion(
  supabase: SupabaseClient,
  userId: string,
  input: ActivityCompletionInput
): Promise<void> {
  await upsertUserProgress(supabase, userId, input)
  if (input.xpAmount > 0) {
    await recordXpEvent(supabase, userId, {
      source: input.source,
      sourceId: input.entityId,
      amount: input.xpAmount,
      reason: input.reason,
    })
  }
}

/** Sync new activity-log XP rows to Supabase (deduped by activity id). */
export async function syncNewActivityLogEvents(
  supabase: SupabaseClient,
  userId: string,
  activities: ActivityLogItem[],
  syncedIds: Set<string>
): Promise<string[]> {
  const fresh = activities.filter(
    (a) => !syncedIds.has(a.id) && a.xpAwarded > 0
  )
  if (fresh.length === 0) return []

  for (const activity of fresh) {
    await recordActivityCompletion(supabase, userId, {
      entityType: activity.type,
      entityId: activity.entityId,
      status: "completed",
      xpAmount: activity.xpAwarded,
      source: activity.source,
      reason: activity.title,
    })
    syncedIds.add(activity.id)
  }

  return fresh.map((a) => a.id)
}
