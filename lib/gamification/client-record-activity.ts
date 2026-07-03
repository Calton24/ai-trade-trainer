"use client"

/**
 * Client-side UX/performance guard against firing the same learning-event
 * fact twice in quick succession — e.g. React Strict Mode's deliberate
 * double-invoke of effects in development, a doubled click before a button
 * disables, or a component re-render replaying the same completion action.
 *
 * This is explicitly NOT a security or correctness boundary. The server
 * (`/api/progress/record-activity` → `hasExistingReward` in
 * `lib/gamification/record-activity.ts`) is the sole source of truth for
 * idempotency and will always reject/ignore a genuine duplicate even if this
 * guard is bypassed entirely (new tab, page reload, direct fetch, etc). This
 * exists purely to avoid redundant network chatter and UI flicker on the
 * client.
 *
 * Root-cause note: the settings-page infinite `/api/progress/record-activity`
 * loop this guard was added alongside was NOT a duplicate-event problem —
 * it was an unconditional-persist-during-hydration bug (see
 * `lib/user-state/activity.ts`'s `setWeeklyTarget` and
 * `components/providers/user-state-provider.tsx`'s `setWeeklyTargetDays`).
 * This guard is defense-in-depth for the class of bug the loop resembled
 * (repeated activity recording), not a fix for that specific bug.
 */

const DEBOUNCE_MS = 5000

/** Keys of events successfully sent within the last `DEBOUNCE_MS`. */
const recentlySent = new Map<string, number>()
/** Keys of events currently in flight (request not yet settled). */
const inFlight = new Set<string>()

export interface RecordActivityOnceEvent {
  eventType: string
  entityId: string
  /** Distinguishes repeat attempts at the same entity, if applicable. */
  attemptId?: string
}

export type RecordActivityOnceResult<T> =
  | { skipped: true }
  | ({ skipped?: false } & T)

function keyOf(event: RecordActivityOnceEvent): string {
  return `${event.eventType}:${event.entityId}:${event.attemptId ?? ""}`
}

/**
 * Runs `send()` at most once per `(eventType, entityId, attemptId)` key
 * within the debounce window, and never concurrently for the same key.
 * Retries are allowed after a failed attempt (network error, non-2xx) —
 * only successful sends start the debounce window.
 */
export async function recordActivityOnce<T extends { error?: string }>(
  event: RecordActivityOnceEvent,
  send: () => Promise<T>
): Promise<RecordActivityOnceResult<T>> {
  if (!event.eventType || !event.entityId) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[client-record-activity] recordActivityOnce called without an " +
          "explicit eventType/entityId. Activity recording must only ever " +
          "be triggered from explicit learner completion actions (lesson " +
          "complete, quiz submit, drill/session finish, etc.) — never from " +
          "rendering, hydration, or generic state syncing.",
        event
      )
    }
  }

  const key = keyOf(event)

  if (inFlight.has(key)) {
    return { skipped: true }
  }

  const lastSentAt = recentlySent.get(key)
  if (lastSentAt !== undefined && Date.now() - lastSentAt < DEBOUNCE_MS) {
    return { skipped: true }
  }

  inFlight.add(key)
  try {
    const result = await send()
    if (!result.error) {
      recentlySent.set(key, Date.now())
    }
    return result
  } finally {
    inFlight.delete(key)
  }
}

/** Test-only escape hatch — clears all in-memory guard state. */
export function clearRecordActivityGuard(): void {
  recentlySent.clear()
  inFlight.clear()
}
