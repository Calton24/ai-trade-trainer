import type { Difficulty } from "@/lib/types"

export type StrategyCategory =
  | "Price Action"
  | "Trend Following"
  | "Momentum"
  | "Reversal"
  | "Day Trading"
  | "Structure"
  | "Professional Forex"

export type MasteryLevel =
  | "not_started"
  | "learning"
  | "practising"
  | "competent"
  | "strong"
  | "mastered"

export type StrategyTradeDecision = "trade" | "skip"

export interface StrategySetupStep {
  id: string
  title: string
  explanation: string
  beginnerTip?: string
}

export interface StrategyChartExample {
  id: string
  title: string
  chartScenarioId: string
  variant: "clean" | "failed" | "skip"
  caption: string
}

export interface StrategyPracticeExercise {
  id: string
  strategyId: string
  title: string
  scenarioId: string
  task: string
  expectedTradeDecision: StrategyTradeDecision
  improvementTip: string
}

export interface TradingStrategy {
  id: string
  slug: string
  title: string
  category: StrategyCategory
  difficulty: Difficulty | "beginner-intermediate"
  summary: string
  bestMarketCondition: string
  timeframes: string[]
  whenToUse: string
  whenToAvoid: string
  setupSteps: StrategySetupStep[]
  entryLogic: string
  stopLossLogic: string
  takeProfitLogic: string
  invalidationRules: string[]
  commonMistakes: string[]
  chartExamples: StrategyChartExample[]
  practiceExercises: StrategyPracticeExercise[]
  flashcardDeckSlug?: string
  relatedStrategySlugs: string[]
  featured?: boolean
}

export interface StrategyPracticeAttempt {
  id: string
  strategyId: string
  exerciseId: string
  chartScore: number
  tradeDecision: StrategyTradeDecision | null
  reasoning: string
  confidenceRating: 1 | 2 | 3 | 4 | 5
  totalScore: number
  completedAt: string
}

export interface StrategyChallengeAttempt {
  id: string
  strategyId: string
  score: number
  total: number
  hitRate: number
  missedIds: string[]
  xpEarned: number
  completedAt: string
}

export interface StrategyProgressRecord {
  strategyId: string
  lessonsCompleted: number
  practiceAttempts: number
  challengeAttempts: number
  averageScore: number
  bestScore: number
  confidenceSum: number
  confidenceCount: number
  masteryLevel: MasteryLevel
  lastPractisedAt: string | null
  recentHighScores: number[]
}

export interface StoredStrategyWikiState {
  completedStrategyIds: string[]
  strategyProgress: Record<string, StrategyProgressRecord>
  practiceAttempts: StrategyPracticeAttempt[]
  challengeAttempts: StrategyChallengeAttempt[]
  strategyWikiXP: number
}

export interface StrategyWikiStats {
  strategiesStarted: number
  totalStrategies: number
  lessonsCompleted: number
  strategiesMastered: number
  practiceSessions: number
  challengeSessions: number
  averageScore: number
  weakestStrategySlug: string | null
  weakestStrategyTitle: string | null
  recommendedStrategySlug: string | null
  recommendedStrategyTitle: string | null
  strategyWikiXP: number
}

export function getInitialStrategyWikiState(): StoredStrategyWikiState {
  return {
    completedStrategyIds: [],
    strategyProgress: {},
    practiceAttempts: [],
    challengeAttempts: [],
    strategyWikiXP: 0,
  }
}

export interface StrategyPracticeScore {
  score: number
  passed: boolean
  chartScore: number
  tradeCorrect: boolean
  correct: string[]
  missed: string[]
  tip: string
  summary: string
}
