import type { SupabaseClient } from "@supabase/supabase-js"

import { recordXpEvent } from "@/lib/data/xp-service"
import { levelFromXP } from "@/lib/progression/levels"
import { getTierForXp } from "@/lib/progression/ranks"
import { getDateKey } from "@/lib/user-state/activity"

import {
  DEFAULT_QUIZ_PASS_THRESHOLD,
  QUIZ_PASS_XP,
  QUIZ_PERFECT_XP,
  XP_CATALOG,
  getQuizPassThreshold,
  isKnownQuiz,
} from "./xp-catalog"
import { calculateStreakFromDateKeys } from "./streak"
import type {
  ActivityFact,
  RecordActivityEventResult,
  RecordActivityStats,
} from "./types"

/**
 * Checks whether a reward has already been granted for this exact dedupe
 * key. `sourceId: null` matches "daily-global" rewards (dedupe ignores the
 * entity). Fails **closed**: if the check itself errors, we treat the
 * event as already-rewarded rather than risk a double-award.
 */
async function hasExistingReward(
  supabase: SupabaseClient,
  userId: string,
  source: string,
  sourceId: string | null,
  dateKey?: string
): Promise<boolean> {
  let query = supabase
    .from("xp_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("source", source)

  query = sourceId === null ? query.is("source_id", null) : query.eq("source_id", sourceId)
  if (dateKey) query = query.eq("date_key", dateKey)

  const { count, error } = await query
  if (error) {
    console.error("[gamification] idempotency check failed", error)
    return true
  }
  return (count ?? 0) > 0
}

/**
 * Recomputes lifetime XP, level, rank tier, and current streak strictly
 * from `xp_events` (the only trusted source) and overwrites the
 * corresponding columns on `user_stats` and `profiles`. Always run this
 * after processing an event (and on any gamification sync tick, even
 * without a new event) — it makes those columns self-heal to the trusted
 * value regardless of what a client-supplied `state` snapshot claims.
 */
export async function recomputeTrustedStats(
  supabase: SupabaseClient,
  userId: string
): Promise<RecordActivityStats> {
  const { data, error } = await supabase
    .from("xp_events")
    .select("amount, date_key")
    .eq("user_id", userId)

  if (error) throw error

  const rows = (data ?? []) as { amount: number; date_key: string }[]
  const lifetimeXp = rows.reduce((sum, r) => sum + (r.amount ?? 0), 0)
  const level = levelFromXP(lifetimeXp)
  const rankTier = getTierForXp(lifetimeXp)
  const streak = calculateStreakFromDateKeys(rows.map((r) => r.date_key))

  const { data: existingStats } = await supabase
    .from("user_stats")
    .select("longest_streak")
    .eq("user_id", userId)
    .maybeSingle()

  const longestStreak = Math.max(existingStats?.longest_streak ?? 0, streak)

  await supabase.from("user_stats").upsert(
    {
      user_id: userId,
      lifetime_xp: lifetimeXp,
      highest_rank_tier: rankTier,
      current_streak: streak,
      longest_streak: longestStreak,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )

  await supabase
    .from("profiles")
    .update({
      xp: lifetimeXp,
      level,
      streak,
      rank_tier: rankTier,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  return { lifetimeXp, level, rankTier, streak }
}

function clampScore(score: number | undefined): number {
  if (typeof score !== "number" || !Number.isFinite(score)) return 0
  return Math.min(100, Math.max(0, score))
}

async function awardQuizXp(
  supabase: SupabaseClient,
  userId: string,
  entityId: string,
  score: number
): Promise<RecordActivityEventResult> {
  if (!isKnownQuiz(entityId)) {
    return { awarded: false, xpAwarded: 0, reason: "Unknown quiz." }
  }

  const threshold = getQuizPassThreshold(entityId) || DEFAULT_QUIZ_PASS_THRESHOLD
  const passed = score >= threshold
  const perfect = score >= 100

  if (!passed) {
    return { awarded: false, xpAwarded: 0, reason: "Quiz not passed." }
  }

  let total = 0
  let awardedAny = false

  const alreadyPassed = await hasExistingReward(
    supabase,
    userId,
    "quiz-complete:pass",
    entityId
  )
  if (!alreadyPassed) {
    await recordXpEvent(supabase, userId, {
      source: "quiz-complete:pass",
      sourceId: entityId,
      amount: QUIZ_PASS_XP,
      reason: "Quiz passed",
    })
    total += QUIZ_PASS_XP
    awardedAny = true
  }

  if (perfect) {
    const alreadyPerfect = await hasExistingReward(
      supabase,
      userId,
      "quiz-complete:perfect",
      entityId
    )
    if (!alreadyPerfect) {
      await recordXpEvent(supabase, userId, {
        source: "quiz-complete:perfect",
        sourceId: entityId,
        amount: QUIZ_PERFECT_XP,
        reason: "Perfect quiz score",
      })
      total += QUIZ_PERFECT_XP
      awardedAny = true
    }
  }

  return {
    awarded: awardedAny,
    xpAwarded: total,
    reason: awardedAny ? "Quiz reward granted." : "Quiz already rewarded.",
  }
}

export type RecordActivityEventOutcome =
  | { ok: true; event: RecordActivityEventResult }
  | { ok: false; error: string; status: number }

/**
 * Validates and rewards a single client-reported learning-event *fact*.
 * The client never supplies an XP amount — this is the sole authority on
 * how much (if anything) an event is worth, using the server-owned catalog
 * (`xp-catalog.ts`). Idempotent: replaying the same fact (e.g. a page
 * reload re-sending activity the client hasn't marked "synced" yet) never
 * double-awards.
 */
export async function recordActivityEvent(
  supabase: SupabaseClient,
  userId: string,
  fact: ActivityFact
): Promise<RecordActivityEventOutcome> {
  if (!fact.entityId) {
    return { ok: false, error: "Missing entityId.", status: 400 }
  }

  if (fact.eventType === "quiz-complete") {
    const event = await awardQuizXp(
      supabase,
      userId,
      fact.entityId,
      clampScore(fact.score)
    )
    return { ok: true, event }
  }

  const entry = XP_CATALOG[fact.eventType]
  if (!entry) {
    return {
      ok: false,
      error: `Unknown event type: ${fact.eventType}`,
      status: 400,
    }
  }

  if (entry.validateEntity && !entry.validateEntity(fact.entityId)) {
    return { ok: false, error: "Unknown entity for event type.", status: 400 }
  }

  const source = fact.eventType
  const sourceId = entry.mode === "daily-global" ? null : fact.entityId
  const dedupeDateKey = entry.mode === "once" ? undefined : getDateKey()

  const alreadyRewarded = await hasExistingReward(
    supabase,
    userId,
    source,
    sourceId,
    dedupeDateKey
  )

  if (alreadyRewarded) {
    return {
      ok: true,
      event: { awarded: false, xpAwarded: 0, reason: "Already rewarded." },
    }
  }

  await recordXpEvent(supabase, userId, {
    source,
    sourceId: sourceId ?? undefined,
    amount: entry.amount,
    reason: entry.label,
  })

  return {
    ok: true,
    event: { awarded: true, xpAwarded: entry.amount, reason: entry.label },
  }
}
