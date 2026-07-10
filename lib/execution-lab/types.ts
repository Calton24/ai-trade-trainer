import type { ChartScenario } from "@/lib/charts/types"
import type { MarketReadingLevel } from "@/lib/skills/types"

export type ExecutionMode = "guided" | "practice" | "arcade"

export type TradeDirection = "buy" | "sell" | "wait" | "no-trade"

export type OrderMode = "market" | "pending"

export type PendingOrderType =
  | "buy-limit"
  | "sell-limit"
  | "buy-stop"
  | "sell-stop"

export type StrategyChoice =
  | "continuation"
  | "reversal"
  | "break-retest"
  | "liquidity-sweep"
  | "range"
  | "no-trade"

export type ExecutionCategory =
  | "trend"
  | "continuation"
  | "reversal"
  | "range"
  | "breakout"
  | "fakeout"
  | "break-retest"
  | "support"
  | "resistance"
  | "liquidity"

export interface ExecutionScenario {
  id: string
  title: string
  description: string
  symbol: string
  timeframe: string
  category: ExecutionCategory
  difficulty: MarketReadingLevel
  chart: ChartScenario
  /** Candle index where replay pauses for the trade decision */
  pauseIndex: number
  replayEndIndex: number
  correctTrend: "uptrend" | "downtrend" | "range"
  bestStrategy: StrategyChoice
  strategyOptions: StrategyChoice[]
  idealDirection: TradeDirection
  idealEntry: number
  idealStop: number
  idealTarget: number
  pipSize: number
  /** Pip value per standard lot in account currency */
  pipValuePerLot: number
  defaultAccount: number
  hints: string[]
  /** Market behaviour tag for coaching and trade review */
  behaviour?: string
  subcategory?: string
  tags?: string[]
  journalPrompt?: string
  reversalGrade?: "A+" | "A" | "B" | "C" | "D"
}

export interface ExecutionTradePlan {
  direction: TradeDirection
  strategy: StrategyChoice | null
  orderMode: OrderMode
  pendingType: PendingOrderType
  entry: number
  stop: number
  target: number
  lots: number
  accountSize: number
  riskPercent: number
  confidence: number
}

export interface ExecutionFeedbackItem {
  ok: boolean
  message: string
}

export interface ExecutionValidation {
  score: number
  passed: boolean
  feedback: ExecutionFeedbackItem[]
}

export interface StoredExecutionAttempt {
  id: string
  scenarioId: string
  mode: ExecutionMode
  direction: TradeDirection
  strategy: StrategyChoice | null
  entry: number
  stop: number
  target: number
  lots: number
  riskPercent: number
  accountSize: number
  confidence: number
  executionScore: number
  outcome: "win" | "loss" | "skipped" | "open"
  pips: number
  rr: number
  completedAt: string
}

export interface ExecutionLabStats {
  attempts: number
  averageScore: number
  winRate: number
  averageRR: number
  noTradeAccuracy: number
}

export const ACCOUNT_PRESETS = [
  { label: "£500", value: 500 },
  { label: "£1,000", value: 1000 },
  { label: "£5,000", value: 5000 },
  { label: "£10,000", value: 10000 },
  { label: "£50,000", value: 50000 },
  { label: "Prop Firm", value: 100000 },
] as const
