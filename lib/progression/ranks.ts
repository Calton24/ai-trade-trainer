import { getPlatformMasteryXp } from "./xp-engine"

export interface TraderRank {
  tier: number
  title: string
  /** Emoji insignia for the rank. */
  insignia: string
  /** Tailwind gradient for badge/border styling. */
  accent: string
  /** Rewards unlocked at this rank. */
  benefits: string[]
}

/**
 * The 15 Trader Ranks. Titles are aspirational but grounded — progression
 * mirrors the real journey from novice to professional. XP thresholds are NOT
 * stored here; they are derived dynamically from the platform XP budget so the
 * curve scales as content is added.
 */
export const TRADER_RANKS: TraderRank[] = [
  {
    tier: 1,
    title: "Novice Trader",
    insignia: "🌱",
    accent: "from-zinc-500/30 to-zinc-400/10",
    benefits: ["Profile rank badge", "Access to foundational lessons"],
  },
  {
    tier: 2,
    title: "Student Trader",
    insignia: "📗",
    accent: "from-lime-500/30 to-green-500/10",
    benefits: ["Student profile badge", "Daily challenges unlocked"],
  },
  {
    tier: 3,
    title: "Apprentice Trader",
    insignia: "📘",
    accent: "from-emerald-500/30 to-teal-500/10",
    benefits: ["Apprentice badge", "Weekly challenges unlocked"],
  },
  {
    tier: 4,
    title: "Developing Trader",
    insignia: "📈",
    accent: "from-teal-500/30 to-cyan-500/10",
    benefits: ["Developing badge", "Bronze avatar border"],
  },
  {
    tier: 5,
    title: "Consistent Learner",
    insignia: "🔥",
    accent: "from-cyan-500/30 to-sky-500/10",
    benefits: ["Consistency badge", "Monthly challenges unlocked"],
  },
  {
    tier: 6,
    title: "Market Student",
    insignia: "🎓",
    accent: "from-sky-500/30 to-blue-500/10",
    benefits: ["Market Student badge", "Advanced quizzes unlocked"],
  },
  {
    tier: 7,
    title: "Technical Analyst",
    insignia: "📊",
    accent: "from-blue-500/30 to-indigo-500/10",
    benefits: ["Analyst badge", "Silver avatar border"],
  },
  {
    tier: 8,
    title: "Disciplined Trader",
    insignia: "🛡️",
    accent: "from-indigo-500/30 to-violet-500/10",
    benefits: ["Discipline badge", "Advanced psychology modules"],
  },
  {
    tier: 9,
    title: "Competent Trader",
    insignia: "⚙️",
    accent: "from-violet-500/30 to-purple-500/10",
    benefits: ["Competent badge", "Exclusive strategy modules"],
  },
  {
    tier: 10,
    title: "Advanced Trader",
    insignia: "🚀",
    accent: "from-purple-500/30 to-fuchsia-500/10",
    benefits: ["Advanced badge", "Gold avatar border"],
  },
  {
    tier: 11,
    title: "Professional Trader",
    insignia: "💼",
    accent: "from-fuchsia-500/30 to-pink-500/10",
    benefits: ["Professional badge & banner", "Harder milestone exams"],
  },
  {
    tier: 12,
    title: "Elite Trader",
    insignia: "✨",
    accent: "from-amber-500/30 to-yellow-500/10",
    benefits: ["Elite badge", "Elite profile banner"],
  },
  {
    tier: 13,
    title: "Master Trader",
    insignia: "👑",
    accent: "from-yellow-500/30 to-amber-400/10",
    benefits: ["Master badge", "Master title & avatar frame"],
  },
  {
    tier: 14,
    title: "Market Wizard",
    insignia: "🧙",
    accent: "from-orange-500/30 to-amber-500/10",
    benefits: ["Wizard badge", "Animated avatar border"],
  },
  {
    tier: 15,
    title: "Legendary Trader",
    insignia: "🏆",
    accent: "from-rose-500/30 via-amber-500/20 to-yellow-400/10",
    benefits: ["Legendary badge & banner", "Hall of Fame placement"],
  },
]

export const MAX_RANK_TIER = TRADER_RANKS.length

/**
 * Shape of the rank curve. A power > 1 makes early ranks quick (fast early
 * motivation) and later ranks progressively steeper (mastery takes real work).
 */
const CURVE_POWER = 1.8

/**
 * Cumulative minimum XP required to reach each rank tier, derived from the live
 * platform mastery budget. Rank 1 = 0, the final rank = full mastery total.
 */
export function getRankThresholds(masteryXp = getPlatformMasteryXp()): number[] {
  const steps = MAX_RANK_TIER - 1
  return TRADER_RANKS.map((_, i) => {
    if (i === 0) return 0
    if (i === steps) return Math.round(masteryXp)
    const ratio = Math.pow(i / steps, CURVE_POWER)
    return Math.round(masteryXp * ratio)
  })
}

export interface RankProgress {
  rank: TraderRank
  tier: number
  nextRank: TraderRank | null
  /** Minimum XP for the current rank. */
  rankFloor: number
  /** Minimum XP for the next rank (null at max). */
  nextRankFloor: number | null
  xpIntoRank: number
  xpForRank: number
  xpToNext: number
  percentToNext: number
  isMax: boolean
}

export function getRankByTier(tier: number): TraderRank {
  const clamped = Math.min(Math.max(tier, 1), MAX_RANK_TIER)
  return TRADER_RANKS[clamped - 1]
}

export function getTierForXp(
  xp: number,
  thresholds = getRankThresholds()
): number {
  let tier = 1
  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) tier = i + 1
  }
  return tier
}

export function getRankProgress(
  xp: number,
  thresholds = getRankThresholds()
): RankProgress {
  const tier = getTierForXp(xp, thresholds)
  const rank = getRankByTier(tier)
  const isMax = tier >= MAX_RANK_TIER
  const rankFloor = thresholds[tier - 1] ?? 0
  const nextRankFloor = isMax ? null : thresholds[tier] ?? null
  const xpForRank = isMax ? 0 : (nextRankFloor ?? rankFloor) - rankFloor
  const xpIntoRank = xp - rankFloor
  const xpToNext = isMax ? 0 : Math.max(0, (nextRankFloor ?? xp) - xp)
  const percentToNext = isMax
    ? 100
    : xpForRank > 0
      ? Math.min(100, Math.round((xpIntoRank / xpForRank) * 100))
      : 0

  return {
    rank,
    tier,
    nextRank: isMax ? null : getRankByTier(tier + 1),
    rankFloor,
    nextRankFloor,
    xpIntoRank,
    xpForRank,
    xpToNext,
    percentToNext,
    isMax,
  }
}

/** All ranks with their XP floor — handy for a full progression ladder UI. */
export function getRankLadder(thresholds = getRankThresholds()) {
  return TRADER_RANKS.map((rank, i) => ({
    rank,
    floor: thresholds[i] ?? 0,
  }))
}
