import type { ExecutionMode, TradeDirection } from "@/lib/execution-lab/types"
import type { MistakeCode } from "./mistake-codes"
import type { ScenarioHealthLabel } from "./health-config"

export type AttemptStatus = "started" | "completed" | "abandoned"

export type DbDecision = "buy" | "sell" | "wait" | "no_trade"

export interface ExecutionScenarioAttemptRow {
  id: string
  user_id: string
  scenario_id: string
  pack_id: string | null
  mode: ExecutionMode
  started_at: string
  completed_at: string | null
  duration_seconds: number | null
  status: AttemptStatus
  decision: DbDecision | null
  expected_decision: DbDecision | null
  decision_correct: boolean | null
  strategy_selected: string | null
  expected_strategy: string | null
  strategy_correct: boolean | null
  execution_score: number | null
  market_reading_score: number | null
  structure_score: number | null
  entry_score: number | null
  stop_score: number | null
  target_score: number | null
  risk_score: number | null
  management_score: number | null
  patience_score: number | null
  confidence: number | null
  confidence_correctness_gap: number | null
  hints_used: number
  reveal_used: boolean
  rule_violations: { type: string; message: string }[]
  mistake_codes: MistakeCode[]
  created_at: string
  updated_at: string
}

export interface AttemptStartResponse {
  attemptId: string
  startedAt: string
}

export interface AttemptCompletePayload {
  attemptId: string
  direction: TradeDirection
  strategy: string | null
  entry: number
  stop: number
  target: number
  lots: number
  accountSize: number
  riskPercent: number
  confidence: number
  hintsUsed: number
  revealUsed: boolean
  ruleViolations?: { type: string; message: string }[]
  managementScore?: number
  outcome?: "win" | "loss" | "skipped" | "open" | "breakeven" | "manual" | null
}

export interface AttemptCompleteResponse {
  attemptId: string
  executionScore: number
  decisionCorrect: boolean
  strategyCorrect: boolean
  mistakeCodes: MistakeCode[]
  alreadyCompleted?: boolean
}

export interface LearnerAnalyticsOverview {
  scenariosCompleted: number
  scenariosStarted: number
  completionRate: number
  averageExecutionScore: number
  averageDurationSeconds: number
  noTradeAccuracy: number
  strategySelectionAccuracy: number
  confidenceCalibration: number
  hintsPerCompleted: number
  revealRate: number
}

export interface PackAnalyticsSummary {
  packId: string
  packTitle: string
  attempts: number
  completed: number
  completionRate: number
  averageScore: number
  strongestSkill: string | null
  weakestSkill: string | null
  recentTrend: number
}

export interface RecentAttemptSummary {
  id: string
  scenarioId: string
  scenarioTitle: string
  packId: string | null
  mode: ExecutionMode
  executionScore: number | null
  decision: string | null
  decisionCorrect: boolean | null
  hintsUsed: number
  durationSeconds: number | null
  completedAt: string | null
  status: AttemptStatus
}

export interface LearnerAnalyticsResponse {
  overview: LearnerAnalyticsOverview
  byPack: PackAnalyticsSummary[]
  recentAttempts: RecentAttemptSummary[]
  coachingRecommendations: CoachingRecommendation[]
}

export interface CoachingRecommendation {
  label: string
  reason: string
  href: string
  priority: number
}

export interface ScenarioAdminMetrics {
  scenarioId: string
  title: string
  packId: string | null
  difficulty: string
  symbol: string
  modeBreakdown: Record<string, number>
  totalStarts: number
  completions: number
  abandonments: number
  abandonmentRate: number
  averageExecutionScore: number
  medianExecutionScore: number
  averageHintsUsed: number
  revealRate: number
  averageCompletionTimeSeconds: number
  decisionCorrectnessRate: number
  strategyCorrectnessRate: number
  noTradeSelectionRate: number
  averageConfidenceGap: number
  topMistake: string | null
  topViolation: string | null
  healthLabel: ScenarioHealthLabel
  qualityScore: number | null
}

export interface AdminAnalyticsResponse {
  scenarios: ScenarioAdminMetrics[]
  filters: {
    packs: string[]
    difficulties: string[]
    modes: string[]
  }
}

export function toDbDecision(direction: TradeDirection): DbDecision {
  if (direction === "no-trade") return "no_trade"
  return direction
}

export function fromDbDecision(decision: DbDecision | null): string {
  if (!decision) return "—"
  if (decision === "no_trade") return "no-trade"
  return decision
}
