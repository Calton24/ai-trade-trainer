export type TradeMarkType =
  | "support"
  | "resistance"
  | "trend"
  | "break"
  | "retest"
  | "entry"
  | "stop_loss"
  | "take_profit"

export type DrillType =
  | "identify_support"
  | "identify_resistance"
  | "spot_trend"
  | "mark_break"
  | "mark_retest"
  | "place_entry_sl_tp"

export type Difficulty = "beginner" | "intermediate" | "advanced"

export type TradeRecommendation = "take" | "skip"

export interface Candle {
  time: number
  open: number
  high: number
  low: number
  close: number
}

export interface TradeMark {
  type: TradeMarkType
  price: number
  index: number
}

export interface Drill {
  id: string
  type: DrillType
  title: string
  description: string
  difficulty: Difficulty
  requiredMarks: TradeMarkType[]
  instructions: string
}

export interface AIReview {
  score: number
  summary: string
  strengths: string[]
  mistakes: string[]
  improvement: string
  recommendation: TradeRecommendation
  riskRewardFeedback?: string
  beginnerExplanation?: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: string
}

export interface UserProgress {
  level: number
  xp: number
  xpForCurrentLevel: number
  xpForNextLevel: number
  streak: number
  lessonsCompleted: number
  totalLessons: number
  drillsCompleted: number
  quizzesCompleted: number
  quizAverageScore: number
  accuracy: number
  weakestSkill: string
  recommendedLessonId: string
  activePathId: string
  pathProgressPercent: number
  nextSyllabusItemId: string
  recommendedAction: string
  badgeIds: string[]
}

export interface JournalEntry {
  id: string
  setupPracticed: string
  marksSummary: string
  aiFeedbackSummary: string
  confidenceRating: 1 | 2 | 3 | 4 | 5
  mistakeTag: string
  personalNote: string
  createdAt: string
  source?: "book-lab" | "training" | "reflection" | "course" | "strategy-wiki" | "simulator"
  conceptTitle?: string
  drillType?: string
}

export interface CommunityPost {
  id: string
  author: string
  avatarInitials: string
  content: string
  type: "drill_share" | "mistake_discussion" | "challenge" | "general"
  likes: number
  createdAt: string
}

export interface PricingTier {
  id: string
  name: string
  price: string
  period?: string
  description: string
  studyAlignment?: string
  features: string[]
  badge?: "most-popular" | "best-value"
  /** @deprecated use badge */
  highlighted?: boolean
  cta: string
  stripePriceId?: string
  billingInterval?: string
}

export interface ProgressStats {
  weeklyDrills: number
  weeklyDrillsGoal: number
  setupAccuracy: number
  disciplineScore: number
  mistakesBreakdown: { label: string; count: number }[]
  bestHabit: string
  worstHabit: string
}

export interface QuizDiscussionPrompt {
  id: string
  label: string
}

export interface QuizDiscussionResponse {
  promptId: string
  response: string
}
