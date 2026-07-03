import type { SupabaseClient } from "@supabase/supabase-js"

import type { ActivityFact } from "@/lib/gamification/types"
import type { ActivityLogItem } from "@/lib/user-state/types"

export interface ActivityCompletionInput {
  entityType: string
  entityId: string
  status?: "not_started" | "in_progress" | "completed"
  score?: number | null
}

/**
 * `user_progress` is a normal user-owned progress table (RLS: owner can
 * read/write their own rows freely) — safe to call with the browser's
 * RLS-scoped Supabase client.
 */
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

/**
 * Finds activity-log entries not yet synced, upserts their `user_progress`
 * row client-side (safe — owner-scoped, no entitlement implications), and
 * returns the underlying *facts* (event type, entity id, score) for the
 * server to independently judge and reward.
 *
 * Deliberately does **not** compute or send an XP amount: the client only
 * reports that an event occurred. `/api/progress/record-activity`
 * (service-role) decides whether it's valid, whether it's already been
 * rewarded, and how much it's worth — see docs/database-v1.md
 * ("gamification trust boundary").
 */
export async function syncNewActivityLogEvents(
  supabase: SupabaseClient,
  userId: string,
  activities: ActivityLogItem[],
  syncedIds: Set<string>
): Promise<{ syncedActivityIds: string[]; facts: ActivityFact[] }> {
  const fresh = activities.filter((a) => !syncedIds.has(a.id))
  if (fresh.length === 0) return { syncedActivityIds: [], facts: [] }

  const facts: ActivityFact[] = []
  for (const activity of fresh) {
    await upsertUserProgress(supabase, userId, {
      entityType: activity.type,
      entityId: activity.entityId,
      status: "completed",
    })
    facts.push({
      eventType: activity.type,
      entityId: activity.entityId,
      score: activity.score,
      completedAt: activity.completedAt,
    })
    syncedIds.add(activity.id)
  }

  return { syncedActivityIds: fresh.map((a) => a.id), facts }
}
