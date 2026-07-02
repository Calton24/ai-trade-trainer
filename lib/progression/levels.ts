/** XP thresholds per level (cumulative). */
export const LEVEL_XP_THRESHOLDS = [0, 0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800]

/**
 * Central XP catalog. Every meaningful action earns XP from here so the
 * progression engine stays dynamic — new content/actions slot in without
 * touching rank logic. Quizzes, sims and practical work are weighted far above
 * passive reading so XP tracks demonstrated competence, not time spent.
 */
export const XP_REWARDS = {
  // Knowledge intake (lighter — passive)
  lessonComplete: 50,
  bookConceptComplete: 50,
  flashcardReview: 10,
  journalReflection: 40,
  dailyRevision: 30,
  caseStudy: 120,
  // Demonstrated knowledge (heavier — active)
  quizPassed: 100,
  perfectQuiz: 150,
  chartExercise: 80,
  trendSpotterDrill: 80,
  strategyPractice: 80,
  simulatorSession: 300,
  // Major milestones
  bookComplete: 750,
  courseComplete: 1500,
  milestoneExam: 500,
  assessmentComplete: 200,
  // Habit / engagement
  dailyLogin: 20,
  dailyStreakBonus: 20,
  weeklyTargetBonus: 150,
  weeklyStreakBonus: 150,
  // Challenge rewards
  dailyChallengeChest: 150,
  weeklyChallengeBonus: 400,
  monthlyChallengeBonus: 1200,
  // Achievements default bonus (each achievement can override)
  achievementBonus: 100,
} as const

export type XpRewardKey = keyof typeof XP_REWARDS

export function levelFromXP(xp: number): number {
  let level = 1
  for (let i = LEVEL_XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_XP_THRESHOLDS[i]) {
      level = i + 1
      break
    }
  }
  return level
}

export function xpForLevel(level: number): number {
  const idx = Math.min(level - 1, LEVEL_XP_THRESHOLDS.length - 1)
  return LEVEL_XP_THRESHOLDS[Math.max(0, idx)] ?? 0
}

export function xpToNextLevel(xp: number, level: number): number {
  const nextThreshold =
    LEVEL_XP_THRESHOLDS[Math.min(level, LEVEL_XP_THRESHOLDS.length - 1)] ??
    level * 100
  return Math.max(0, nextThreshold - xp)
}

export function xpProgressPercent(xp: number, level: number): number {
  const current = xpForLevel(level)
  const next =
    LEVEL_XP_THRESHOLDS[Math.min(level, LEVEL_XP_THRESHOLDS.length - 1)] ??
    current + 100
  const range = next - current
  if (range <= 0) return 100
  return Math.min(100, Math.round(((xp - current) / range) * 100))
}

export function getXpProgressPercent(progress: {
  xp: number
  level: number
}): number {
  return xpProgressPercent(progress.xp, progress.level)
}

export function getLevelTitle(level: number): string {
  const titles: Record<number, string> = {
    1: "Chart Curious",
    2: "Candle Reader",
    3: "Level Spotter",
    4: "Setup Scout",
    5: "Pattern Learner",
    6: "Trend Tracker",
    7: "Risk Manager",
    8: "Strategy Student",
    9: "Disciplined Trader",
    10: "Consistent Trader",
  }
  return titles[level] ?? `Level ${level} Trader`
}
