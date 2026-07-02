import { getRankByTier, getTierForXp } from "@/lib/progression/ranks"

import type { LeaderboardEntry, LeaderboardPeriod } from "./types"

/**
 * Seeded competitor pool.
 *
 * These are placeholder learners so the leaderboards feel alive before the
 * multiplayer backend is populated. Each persona has a stable lifetime XP and
 * activity profile; period XP is derived deterministically per period key so
 * standings shift day-to-day without ever being random across reloads.
 *
 * When real users + per-period XP land in Supabase, swap these out via
 * `lib/leaderboard/repository.ts` — the entry shape is identical.
 */

interface SeedPersona {
  name: string
  avatar: string
  country: string
  xp: number
  streak: number
  lessonsCompleted: number
  booksCompleted: number
  /** 0..1 — how much of their XP is recent activity. */
  activity: number
}

const PERSONAS: SeedPersona[] = [
  { name: "AlphaSeeker", avatar: "🦅", country: "🇺🇸", xp: 48200, streak: 64, lessonsCompleted: 142, booksCompleted: 2, activity: 0.9 },
  { name: "CandleQueen", avatar: "👑", country: "🇬🇧", xp: 44100, streak: 51, lessonsCompleted: 131, booksCompleted: 2, activity: 0.85 },
  { name: "RiskRonin", avatar: "🥷", country: "🇯🇵", xp: 39850, streak: 47, lessonsCompleted: 124, booksCompleted: 2, activity: 0.95 },
  { name: "ZenTrader", avatar: "🧘", country: "🇮🇳", xp: 36400, streak: 38, lessonsCompleted: 118, booksCompleted: 1, activity: 0.7 },
  { name: "PipHunter", avatar: "🎯", country: "🇩🇪", xp: 33120, streak: 29, lessonsCompleted: 110, booksCompleted: 1, activity: 0.8 },
  { name: "TrendWolf", avatar: "🐺", country: "🇨🇦", xp: 30050, streak: 22, lessonsCompleted: 101, booksCompleted: 1, activity: 0.75 },
  { name: "BreakoutBabe", avatar: "💎", country: "🇦🇺", xp: 27800, streak: 19, lessonsCompleted: 96, booksCompleted: 1, activity: 0.9 },
  { name: "ChartNinja", avatar: "🗡️", country: "🇰🇷", xp: 24600, streak: 33, lessonsCompleted: 88, booksCompleted: 1, activity: 0.65 },
  { name: "BullRunBilly", avatar: "🐂", country: "🇧🇷", xp: 21900, streak: 14, lessonsCompleted: 79, booksCompleted: 1, activity: 0.85 },
  { name: "FibFox", avatar: "🦊", country: "🇫🇷", xp: 19450, streak: 11, lessonsCompleted: 71, booksCompleted: 1, activity: 0.6 },
  { name: "SwingSage", avatar: "🧓", country: "🇿🇦", xp: 17200, streak: 9, lessonsCompleted: 64, booksCompleted: 0, activity: 0.7 },
  { name: "ScalpStar", avatar: "⭐", country: "🇪🇸", xp: 15050, streak: 7, lessonsCompleted: 58, booksCompleted: 0, activity: 0.95 },
  { name: "MacroMaven", avatar: "🌍", country: "🇳🇱", xp: 12800, streak: 16, lessonsCompleted: 49, booksCompleted: 0, activity: 0.55 },
  { name: "GapGoblin", avatar: "👺", country: "🇮🇹", xp: 10400, streak: 5, lessonsCompleted: 41, booksCompleted: 0, activity: 0.8 },
  { name: "DeltaDiva", avatar: "💃", country: "🇲🇽", xp: 8650, streak: 4, lessonsCompleted: 34, booksCompleted: 0, activity: 0.75 },
  { name: "RangeRebel", avatar: "🤘", country: "🇸🇪", xp: 6900, streak: 12, lessonsCompleted: 27, booksCompleted: 0, activity: 0.6 },
  { name: "NoviceNova", avatar: "✨", country: "🇵🇹", xp: 5200, streak: 3, lessonsCompleted: 21, booksCompleted: 0, activity: 0.9 },
  { name: "PaperHandsPete", avatar: "📄", country: "🇮🇪", xp: 3850, streak: 2, lessonsCompleted: 16, booksCompleted: 0, activity: 0.7 },
  { name: "RookieRae", avatar: "🐣", country: "🇳🇿", xp: 2400, streak: 6, lessonsCompleted: 11, booksCompleted: 0, activity: 0.85 },
  { name: "FreshFib", avatar: "🌿", country: "🇸🇬", xp: 1150, streak: 1, lessonsCompleted: 5, booksCompleted: 0, activity: 0.95 },
]

function hashKey(key: string): number {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 0xffffffff
}

/** Fraction of lifetime XP a persona earns in the given period window. */
function periodFraction(period: LeaderboardPeriod): number {
  switch (period) {
    case "daily":
      return 0.012
    case "weekly":
      return 0.07
    case "monthly":
      return 0.26
    case "all-time":
      return 1
  }
}

export function getSeededEntries(
  period: LeaderboardPeriod,
  periodKey: string
): LeaderboardEntry[] {
  const fraction = periodFraction(period)

  return PERSONAS.map((p) => {
    const tier = getTierForXp(p.xp)
    const rank = getRankByTier(tier)

    let periodXp = p.xp
    if (period !== "all-time") {
      const jitter = 0.5 + hashKey(`${p.name}:${periodKey}`) // 0.5..1.5
      periodXp = Math.round(p.xp * fraction * p.activity * jitter)
    }

    return {
      id: `seed-${p.name}`,
      rank: 0,
      username: p.name,
      rankTitle: rank.title,
      rankTier: tier,
      insignia: rank.insignia,
      xp: p.xp,
      periodXp,
      streak: p.streak,
      lessonsCompleted: p.lessonsCompleted,
      booksCompleted: p.booksCompleted,
      avatar: p.avatar,
      country: p.country,
      isCurrentUser: false,
      isSeeded: true,
    }
  })
}
