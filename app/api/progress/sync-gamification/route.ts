import { NextResponse } from "next/server"

/**
 * Retired. This endpoint trusted a client-computed XP/state payload
 * directly — a crafted request could inflate XP, rank tier, or streaks.
 *
 * Replaced by `/api/progress/record-activity`, which accepts only
 * learning-event *facts* (event type, entity id, score) and computes
 * XP/rank/streak server-side from the trusted `xp_events` ledger. See
 * docs/database-v1.md ("gamification trust boundary").
 */
export async function POST() {
  return NextResponse.json(
    { error: "Gone. Use /api/progress/record-activity." },
    { status: 410 }
  )
}
