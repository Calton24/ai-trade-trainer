import { recordActivityOnce } from "@/lib/gamification/client-record-activity"
import type { ActivityFact, RecordActivityStats } from "@/lib/gamification/types"
import type { UserState } from "@/lib/user-state/types"

interface RecordActivityResponse {
  ok?: boolean
  error?: string
  stats?: RecordActivityStats
}

async function postRecordActivity(body: {
  event?: ActivityFact
  state?: UserState
}): Promise<{ error?: string }> {
  try {
    const response = await fetch("/api/progress/record-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const parsed = (await response.json().catch(() => ({}))) as RecordActivityResponse
      return { error: parsed.error ?? `Sync failed (${response.status}).` }
    }

    return {}
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Sync failed.",
    }
  }
}

/**
 * Client-side call to the trusted server route that records learning-event
 * facts and syncs the rest of the gamification-derived UI state.
 *
 * The client never sends an XP amount, rank, streak, or achievement id —
 * only *facts* about what happened (`ActivityFact[]`). The server decides
 * whether each fact is valid, whether it's already been rewarded, and how
 * much (if anything) it's worth, then recomputes XP/level/streak/rank from
 * its own trusted ledger. `state` is optional and only feeds the
 * lower-stakes UI mirror (badges, weekly target, streak-row, competence
 * snapshot, completion counts) — it is never used for XP/rank/streak.
 *
 * See docs/database-v1.md ("gamification trust boundary") and
 * `app/api/progress/record-activity/route.ts`.
 */
export async function syncGamificationState(
  state: UserState,
  facts: ActivityFact[]
): Promise<{ error?: string }> {
  if (facts.length === 0) {
    return postRecordActivity({ state })
  }

  let lastError: string | undefined
  for (let i = 0; i < facts.length; i++) {
    const isLast = i === facts.length - 1
    const fact = facts[i]
    // Client-side dedupe/debounce only — the server remains the source of
    // truth for idempotency (see recordActivityOnce's docstring).
    const result = await recordActivityOnce(
      {
        eventType: fact.eventType,
        entityId: fact.entityId,
        attemptId: fact.attemptId,
      },
      () => postRecordActivity({ event: fact, state: isLast ? state : undefined })
    )
    if (!result.skipped && result.error) lastError = result.error
  }

  return lastError ? { error: lastError } : {}
}
