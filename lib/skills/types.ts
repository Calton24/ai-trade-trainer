/** Canonical skill identifiers — single source of truth for the practice OS. */
export type SkillId =
  | "trend-detection"
  | "continuation"
  | "reversal"
  | "support-resistance"
  | "break-retest"
  | "liquidity"
  | "position-sizing"
  | "stop-placement"
  | "risk-reward"
  | "discipline"
  | "confidence-calibration"
  | "journal-quality"
  | "market-context"
  | "pair-selection"
  | "trade-or-skip"
  | "post-trade-review"
  | "replay-accuracy"
  | "decision-quality"

export type SkillCategory =
  | "pattern-recognition"
  | "risk-management"
  | "psychology"
  | "professional-workflow"
  | "market-reading"

export type MarketReadingLevel =
  | "Beginner"
  | "Developing"
  | "Intermediate"
  | "Advanced"
  | "Professional"

export interface SkillScore {
  id: SkillId
  label: string
  category: SkillCategory
  /** 0–100 weighted score */
  score: number
  level: MarketReadingLevel
  attemptCount: number
  chartsAnalysed: number
  lastPracticeAt: string | null
  /** Week-over-week delta (positive = improving) */
  weekTrend: number
}

export interface CategoryScore {
  id: SkillCategory
  label: string
  score: number
  level: MarketReadingLevel
  skills: SkillScore[]
}

export interface SkillProfile {
  marketReadingScore: number
  marketReadingLevel: MarketReadingLevel
  confidenceAccuracy: number
  chartsAnalysed: number
  replaySessions: number
  categories: CategoryScore[]
  skills: Record<SkillId, SkillScore>
  weakestSkill: SkillId | null
  strongestSkill: SkillId | null
  practiceStreak: number
  learningStreak: number
}

export interface DailyTrainingItem {
  id: string
  label: string
  description: string
  count: number
  href: string
  skillId: SkillId
  estimatedMinutes: number
  completed: boolean
}

export interface DailyTrainingPlan {
  dateKey: string
  items: DailyTrainingItem[]
  estimatedMinutes: number
  completedCount: number
  allComplete: boolean
  bonusClaimed: boolean
  bonusXp: number
}

export interface AdaptiveRecommendation {
  skillId: SkillId
  label: string
  reason: string
  href: string
  priority: number
}

export interface DailyChallenge {
  id: string
  dateKey: string
  title: string
  description: string
  href: string
  skillId: SkillId
  xpReward: number
  completed: boolean
}

export interface WeeklyReport {
  weekKey: string
  hoursTrained: number
  chartsAnalysed: number
  replayAccuracy: number
  weakestSkill: SkillId | null
  strongestSkill: SkillId | null
  improvement: number
  recommendedFocus: string
  dailyActivity: { day: string; charts: number }[]
}

export interface JournalInsight {
  id: string
  message: string
  severity: "info" | "warning" | "positive"
}

export interface PracticeDrill {
  id: string
  title: string
  description: string
  href: string
  skillIds: SkillId[]
  difficulty: MarketReadingLevel
  estimatedMinutes: number
  available: boolean
  badge?: string
}
