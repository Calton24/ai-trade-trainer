import type { ChartPoint } from "@/lib/charts/types"
import type { StrategyChoice } from "@/lib/execution-lab/types"

export type GuidedStepId =
  | "market"
  | "timeframe"
  | "trend"
  | "swing-highs"
  | "swing-lows"
  | "behaviour"
  | "evidence"
  | "zones"
  | "strategy"
  | "execution"
  | "outcome"

export type TrendAnswer = "uptrend" | "downtrend" | "range" | "transition"

export type BehaviourAnswer =
  | "trend"
  | "continuation"
  | "pullback"
  | "exhaustion"
  | "reversal"
  | "range"
  | "no-trade"

export type EvidenceTag =
  | "hh-hl-intact"
  | "lh-ll-break"
  | "momentum-weakening"
  | "liquidity-sweep"
  | "htf-agreement"
  | "session-active"
  | "structure-break"
  | "overlap-swings"

/** @deprecated Use BehaviourAnswer */
export type StructureAnswer = "continuation" | "reversal" | "range" | "no-trade"

export interface GuidedStep {
  id: GuidedStepId
  title: string
  prompt: string
  skillLabel: string
  hints: string[]
  revealAnswer: string
}

export interface GuidedStepMetrics {
  hintsUsed: number
  revealUsed: boolean
  attempts: number
  timeMs: number
}

export interface GuidedSessionState {
  stepIndex: number
  completedSteps: GuidedStepId[]
  stepMetrics: Partial<Record<GuidedStepId, GuidedStepMetrics>>
  sessionStartedAt: number
  stepStartedAt: number
  marketAnswer: string | null
  timeframeAnswer: string | null
  trendAnswer: TrendAnswer | null
  behaviourAnswer: BehaviourAnswer | null
  evidenceAnswers: EvidenceTag[]
  strategyAnswer: StrategyChoice | null
  markedSwingHighs: ChartPoint[]
  markedSwingLows: ChartPoint[]
  markedZones: ChartPoint[]
  hintLevel: number
  revealed: boolean
}

export interface GuidedStepResult {
  correct: boolean
  feedback: string
  mentorLine: string
}

export interface GuidedCompletionSummary {
  executionScore: number
  hintsUsed: number
  revealUsed: boolean
  durationMinutes: number
  greatDecisions: string[]
  mistakes: string[]
  recommendations: { label: string; href: string }[]
}
