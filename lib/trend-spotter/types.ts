import type { Difficulty } from "@/lib/types"

export type TrendClassification = "uptrend" | "downtrend" | "range" | "messy"
export type TrendBias = "bullish" | "bearish" | "neutral"
export type TrendTradeDecision = "trade" | "skip"

export interface TrendSpotterModule {
  id: string
  slug: string
  title: string
  description: string
  order: number
  lessons: TrendSpotterLesson[]
}

export interface TrendSpotterQuizQuestion {
  id: string
  question: string
  options: { id: string; text: string }[]
  correctAnswer: string
  explanation: string
}

export interface TrendSpotterLesson {
  id: string
  slug: string
  moduleId: string
  title: string
  summary: string
  difficulty: Difficulty
  estimatedMinutes: number
  xpReward: number
  explanation: string
  whyMatters: string
  commonMistake: string
  chartDemoId?: string
  chartPracticeId?: string
  quizQuestions: TrendSpotterQuizQuestion[]
  relatedExerciseId?: string
}

export interface TrendSpotterScenario {
  id: string
  slug: string
  title: string
  description: string
  chartScenarioId: string
  classification: TrendClassification
  bias: TrendBias
  tradeDecision: TrendTradeDecision
  explanation: string
  improvementTip: string
  difficulty: Difficulty
  moduleSlug?: string
}

export interface TrendExerciseAttempt {
  id: string
  exerciseId: string
  classification: TrendClassification | null
  bias: TrendBias | null
  tradeDecision: TrendTradeDecision | null
  reasoning: string
  chartScore: number
  totalScore: number
  completedAt: string
}

export interface TrendChallengeAttempt {
  id: string
  score: number
  total: number
  missedIds: string[]
  xpEarned: number
  completedAt: string
}

export interface StoredTrendSpotterState {
  completedLessonIds: string[]
  exerciseAttempts: TrendExerciseAttempt[]
  challengeAttempts: TrendChallengeAttempt[]
  trendSpotterXP: number
  stats: Record<
    TrendClassification,
    { correct: number; total: number }
  >
}

export interface TrendSpotterStats {
  lessonsCompleted: number
  totalLessons: number
  exercisesCompleted: number
  challengesCompleted: number
  classificationAccuracy: number
  weakestType: TrendClassification | null
  strongestType: TrendClassification | null
  trendSpotterXP: number
  nextLessonSlug: string | null
  nextLessonTitle: string | null
}

export function getInitialTrendSpotterState(): StoredTrendSpotterState {
  return {
    completedLessonIds: [],
    exerciseAttempts: [],
    challengeAttempts: [],
    trendSpotterXP: 0,
    stats: {
      uptrend: { correct: 0, total: 0 },
      downtrend: { correct: 0, total: 0 },
      range: { correct: 0, total: 0 },
      messy: { correct: 0, total: 0 },
    },
  }
}

export interface TrendExerciseScore {
  score: number
  passed: boolean
  classificationCorrect: boolean
  biasCorrect: boolean
  tradeCorrect: boolean
  chartScore: number
  correct: string[]
  missed: string[]
  tip: string
  summary: string
}
