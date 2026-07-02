export type CompetencePillar =
  | "market-knowledge"
  | "chart-recognition"
  | "trade-selection"
  | "risk-management"
  | "psychology"
  | "consistency"
  | "execution"

export type LiveTradingPhase =
  | "education"
  | "simulated"
  | "live_prep"
  | "go_live"
  | "live_active"

export type LessonProgressStatus = "not_started" | "in_progress" | "completed"

export interface CompetenceScores {
  knowledgeScore: number
  chartScore: number
  tradeSelectionScore: number
  riskScore: number
  psychologyScore: number
  consistencyScore: number
  executionScore: number
  overallScore: number
  weakestArea: CompetencePillar | null
  recommendedNextModule: string
}

export interface BehavioralEventInput {
  eventType: string
  pillar: CompetencePillar
  entityId: string
  score?: number
  metadata?: Record<string, unknown>
}

export interface LivePhaseState {
  currentPhase: LiveTradingPhase
  simulatedUnlockedAt: string | null
  livePrepUnlockedAt: string | null
  goLiveUnlockedAt: string | null
  riskQuizPassed: boolean
  losingStreakScenarioPassed: boolean
  strategyClarityPassed: boolean
  journalCompletionRate: number
  emotionalViolations: number
  tradesInPhase: number
}

export interface PhaseGateResult {
  phase: LiveTradingPhase
  unlocked: boolean
  requirements: { label: string; met: boolean; detail?: string }[]
  blockers: string[]
}

export interface ResetArchiveResult {
  archived: boolean
  archiveId?: string
  preservedBehavioralEvents: number
}

export const PILLAR_LABELS: Record<CompetencePillar, string> = {
  "market-knowledge": "Market Knowledge",
  "chart-recognition": "Chart Recognition",
  "trade-selection": "Trade Selection",
  "risk-management": "Risk Management",
  psychology: "Psychology",
  consistency: "Consistency",
  execution: "Strategy Execution",
}

export const PHASE_LABELS: Record<LiveTradingPhase, string> = {
  education: "Education",
  simulated: "Simulated Trading",
  live_prep: "Live Preparation",
  go_live: "Go Live Gate",
  live_active: "Live Trading",
}
