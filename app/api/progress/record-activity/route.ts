import { NextResponse } from "next/server"

import { requireAuth } from "@/lib/api/auth-guard"
import {
  recomputeTrustedStats,
  recordActivityEvent,
} from "@/lib/gamification/record-activity"
import type { ActivityFact, RecordActivityEventResult } from "@/lib/gamification/types"
import { captureError } from "@/lib/observability/sentry"
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin"
import { syncProfileSummary } from "@/lib/supabase/sync"
import type { UserState } from "@/lib/user-state/types"

const KNOWN_EVENT_TYPES = new Set<ActivityFact["eventType"]>([
  "lesson-complete",
  "quiz-complete",
  "book-concept-complete",
  "chart-drill-complete",
  "chart-lab-complete",
  "journal-reflection",
  "practice-complete",
  "interactive-question",
  "flashcard-session",
  "trend-lesson-complete",
  "trend-exercise-complete",
  "trend-challenge-complete",
  "strategy-lesson-complete",
  "strategy-practice-complete",
  "strategy-challenge-complete",
  "readiness-assessment-complete",
  "readiness-pillar-complete",
  "simulator-session-complete",
])

interface RequestBody {
  /** A single learning-event fact. Never an XP amount, rank, or streak. */
  event?: unknown
  /**
   * Optional — feeds only the pre-existing, lower-stakes UI mirror sync
   * (badges, weekly target, streak-row, competence snapshot, lesson
   * progress rows, completion counts) via `syncProfileSummary`. It is
   * NEVER used for XP/level/streak/rank — `recomputeTrustedStats` always
   * runs afterward and overwrites those from `xp_events`.
   */
  state?: UserState
}

function parseFact(value: unknown): ActivityFact | null {
  if (!value || typeof value !== "object") return null
  const v = value as Record<string, unknown>

  const eventType = v.eventType
  const entityId = v.entityId
  if (
    typeof eventType !== "string" ||
    !KNOWN_EVENT_TYPES.has(eventType as ActivityFact["eventType"])
  ) {
    return null
  }
  if (typeof entityId !== "string" || entityId.length === 0 || entityId.length > 200) {
    return null
  }

  const fact: ActivityFact = {
    eventType: eventType as ActivityFact["eventType"],
    entityId,
  }
  if (typeof v.score === "number" && Number.isFinite(v.score)) fact.score = v.score
  if (typeof v.attemptId === "string") fact.attemptId = v.attemptId
  if (typeof v.completedAt === "string") fact.completedAt = v.completedAt
  return fact
}

/**
 * The sole trusted write path for gamification/entitlement state.
 *
 * The client reports learning-event *facts only* — event type, entity id,
 * and (where applicable) a raw score. It never sends an XP amount, rank
 * tier, streak count, or achievement id. This route decides all of that:
 *
 *  - `recordActivityEvent` validates the fact against the content
 *    registry, looks up the reward from the server-owned catalog
 *    (`lib/gamification/xp-catalog.ts`), and inserts an idempotent
 *    `xp_events` row — replaying the same fact never double-awards.
 *  - `recomputeTrustedStats` then recomputes lifetime XP, level, rank
 *    tier, and streak strictly from `xp_events` and overwrites
 *    `user_stats` / `profiles`. This always runs (even with no `event`),
 *    so those columns self-heal to the trusted value on every call —
 *    regardless of anything in `state`.
 *
 * Replaces `/api/progress/sync-gamification`, which trusted a
 * client-computed XP/state payload directly and could be used to inflate
 * XP, rank, or streaks with a crafted request. See docs/database-v1.md
 * ("gamification trust boundary").
 *
 * Achievements (`user_badges`) and `competency_score` are **not** fully
 * re-derived from trusted server data in this pass — they still come from
 * `syncProfileSummary`'s client-reported `state` (unchanged from before,
 * still admin-only/RLS-safe, just not re-validated fact-by-fact). Doing so
 * properly needs a trusted server-side event ledger with richer per-event
 * metadata than exists today; see docs/database-v1.md for the scoped
 * follow-up.
 */
export async function POST(request: Request) {
  const authResult = await requireAuth()
  if (!authResult.ok) return authResult.response

  if (!isAdminConfigured()) {
    console.error("[progress/record-activity] Supabase admin credentials missing.")
    return NextResponse.json({ error: "Not configured." }, { status: 501 })
  }

  const body = (await request.json().catch(() => ({}))) as RequestBody
  const admin = createAdminClient()
  const userId = authResult.user.id

  let eventResult: RecordActivityEventResult | undefined

  if (body.event !== undefined) {
    const fact = parseFact(body.event)
    if (!fact) {
      return NextResponse.json({ error: "Invalid event payload." }, { status: 400 })
    }

    if (process.env.NODE_ENV === "development") {
      console.debug(
        `[progress/record-activity] ${fact.eventType} entityId=${fact.entityId} userId=${userId}`
      )
    }

    try {
      const result = await recordActivityEvent(admin, userId, fact)
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: result.status })
      }
      eventResult = result.event
      if (process.env.NODE_ENV === "development" && !eventResult.awarded) {
        console.debug(
          `[progress/record-activity] duplicate reward ignored — ${fact.eventType} entityId=${fact.entityId} (${eventResult.reason})`
        )
      }
    } catch (error) {
      console.error("[progress/record-activity] event failed", error)
      captureError(error, { route: "progress/record-activity", userId, fact })
      return NextResponse.json({ error: "Failed to record activity." }, { status: 500 })
    }
  }

  try {
    if (body.state && body.state.progress) {
      await syncProfileSummary(admin, userId, body.state)
    }
    const stats = await recomputeTrustedStats(admin, userId)
    return NextResponse.json({ ok: true, event: eventResult, stats })
  } catch (error) {
    console.error("[progress/record-activity] sync failed", error)
    captureError(error, { route: "progress/record-activity", userId, stage: "sync" })
    return NextResponse.json({ error: "Sync failed." }, { status: 500 })
  }
}
