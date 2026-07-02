import type { ChartScenario, ScenarioCandle, UserMarker } from "@/lib/charts/types"
import type { TrendClassification } from "@/lib/trend-spotter/types"

export type SimulatorStageId =
  | "chart-reading"
  | "support-resistance"
  | "trade-selection"
  | "trade-planning"
  | "trade-management"

export type ReplaySpeed = 1 | 2 | 5

export type TradeManagementDecision = "hold" | "close" | "move-stop"

export type TradeOutcome = "win" | "loss" | "breakeven" | "open"

export interface SimulatorStageMeta {
  id: SimulatorStageId
  order: number
  title: string
  description: string
  xpReward: number
  estimatedMinutes: number
}

export interface SimulatorScenario {
  id: string
  stageId: SimulatorStageId
  title: string
  symbol: string
  timeframe: string
  seed: string
  chart: ChartScenario
  /** Stage 1: correct trend */
  correctTrend?: TrendClassification
  /** Stage 3: which option (0-2) is the best trade */
  bestOptionIndex?: number
  /** Stage 3: alternative mini scenarios */
  options?: ChartScenario[]
  /** Stage 4: ideal plan */
  idealEntry?: number
  idealStop?: number
  idealTarget?: number
  /** Stage 5: decision points during replay */
  decisionPoints?: {
    candleIndex: number
    correctDecision: TradeManagementDecision
    context: string
  }[]
  replayStartIndex?: number
  replayEndIndex?: number
}

export interface SimulatorTradePlan {
  entry: number
  stop: number
  target: number
  riskReward: number
}

export interface SimulatorSessionAttempt {
  id: string
  scenarioId: string
  stageId: SimulatorStageId
  score: number
  passed: boolean
  xpEarned: number
  /** Stage 1 */
  trendAnswer?: TrendClassification
  /** Stage 2 */
  markers?: UserMarker[]
  /** Stage 3 */
  selectedOption?: number
  /** Stage 4 */
  plan?: SimulatorTradePlan
  /** Stage 5 */
  managementDecisions?: { index: number; decision: TradeManagementDecision; correct: boolean }[]
  /** Trade journal fields */
  thesis?: string
  observation?: string
  improvement?: string
  outcome?: TradeOutcome
  completedAt: string
}

export interface StoredSimulatorState {
  completedStageIds: SimulatorStageId[]
  unlockedStageIds: SimulatorStageId[]
  attempts: SimulatorSessionAttempt[]
  simulatorXP: number
  chartsReviewed: number
  tradesJournaled: number
}

export interface SimulatorStats {
  sessionsCompleted: number
  stagesCompleted: number
  totalStages: number
  averageScore: number
  winRate: number
  averageRR: number
  bestSetup: string | null
  worstSetup: string | null
  mostCommonMistake: string | null
  psychologyScore: number
  riskScore: number
  chartsReviewed: number
  tradesJournaled: number
  currentStageId: SimulatorStageId | null
  nextStageId: SimulatorStageId | null
}

export function getInitialSimulatorState(): StoredSimulatorState {
  return {
    completedStageIds: [],
    unlockedStageIds: ["chart-reading"],
    attempts: [],
    simulatorXP: 0,
    chartsReviewed: 0,
    tradesJournaled: 0,
  }
}
