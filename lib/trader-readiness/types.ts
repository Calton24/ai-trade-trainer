export const READINESS_PILLARS = [
  "market-knowledge",
  "chart-reading",
  "trade-selection",
  "risk-management",
  "psychology",
  "journal-analysis",
  "strategy-mastery",
] as const

export type ReadinessPillarId = (typeof READINESS_PILLARS)[number]

export type TraderLevel =
  | "beginner"
  | "developing"
  | "structured"
  | "consistent"
  | "elite"

export type KnowledgeQuestionType = "multiple-choice" | "true-false" | "fill-blank"

export interface KnowledgeQuestion {
  id: string
  type: KnowledgeQuestionType
  question: string
  options?: { id: string; text: string }[]
  correctAnswer: string
  explanation: string
  lessonHref?: string
  chartScenarioId?: string
}

export interface ChartReadingExercise {
  id: string
  chartScenarioId: string
  title: string
  instruction: string
  scoringWeights: {
    trend?: number
    support?: number
    resistance?: number
    breakout?: number
    retest?: number
  }
}

export interface TradeSetupOption {
  id: string
  chartScenarioId: string
  label: string
  quality: "take" | "avoid" | "neutral"
  trendAlignment: number
  riskReward: number
  entryQuality: number
  marketStructure: number
  explanation: string
}

export interface TradeSelectionScenario {
  id: string
  title: string
  prompt: string
  setups: TradeSetupOption[]
  bestTakeId: string
  bestAvoidId: string
}

export type RiskCalcMode = "manual" | "calculator" | "guided"

export interface RiskScenario {
  id: string
  mode: RiskCalcMode
  prompt: string
  accountSize: number
  riskPercent?: number
  stopPips?: number
  drawdownPercent?: number
  correctAnswer: string | number
  tolerance?: number
  options?: { id: string; text: string }[]
  correctOptionId?: string
  explanation: string
}

export interface PsychologyScenario {
  id: string
  situation: string
  options: { id: string; text: string; score: number }[]
  bestOptionId: string
  explanation: string
  traits: string[]
}

export interface JournalTradeEntry {
  id: string
  date: string
  setup: string
  result: string
  notes: string
  mistake?: string
}

export interface JournalAnalysisScenario {
  id: string
  title: string
  entries: JournalTradeEntry[]
  correctMistakes: string[]
  correctPatterns: string[]
  improvementAreas: string[]
  explanation: string
}

export interface StrategyMasteryQuestion {
  id: string
  strategySlug: string
  question: string
  options: { id: string; text: string }[]
  correctAnswer: string
  explanation: string
}

export interface ReadinessPillarDefinition {
  id: ReadinessPillarId
  title: string
  description: string
  icon: string
  estimatedMinutes: number
  requiresStrategyCompletion?: boolean
}

export interface PillarScoreResult {
  pillarId: ReadinessPillarId
  score: number
  maxScore: number
  percent: number
  weaknesses: string[]
  coachingNote: string
}

export interface ReadinessAssessmentAttempt {
  id: string
  pillarScores: Record<ReadinessPillarId, number>
  overallScore: number
  traderLevel: TraderLevel
  weakestPillar: ReadinessPillarId
  strongestPillar: ReadinessPillarId
  detectedWeaknesses: string[]
  xpEarned: number
  completedAt: string
}

export interface StoredTraderReadinessState {
  pillarScores: Partial<Record<ReadinessPillarId, number>>
  assessmentAttempts: ReadinessAssessmentAttempt[]
  lastAssessmentAt: string | null
  readinessXP: number
  readinessStreak: number
  lastPillarCompletedAt: string | null
}

export interface TraderReadinessStats {
  overallScore: number
  traderLevel: TraderLevel
  traderLevelLabel: string
  pillarScores: Record<ReadinessPillarId, number>
  weakestPillar: ReadinessPillarId | null
  strongestPillar: ReadinessPillarId | null
  weakestPillarLabel: string | null
  strongestPillarLabel: string | null
  detectedWeaknesses: string[]
  recommendedFocus: string
  recommendedHref: string
  estimatedTimeToImprove: string
  nextMilestone: string
  suggestedActions: string[]
  assessmentsCompleted: number
  readinessXP: number
  hasBaseline: boolean
}

export function getInitialTraderReadinessState(): StoredTraderReadinessState {
  return {
    pillarScores: {},
    assessmentAttempts: [],
    lastAssessmentAt: null,
    readinessXP: 0,
    readinessStreak: 0,
    lastPillarCompletedAt: null,
  }
}
