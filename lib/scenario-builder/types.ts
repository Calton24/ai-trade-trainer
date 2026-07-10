import type { ChartAnnotation, ScenarioCandle, Timeframe } from "@/lib/charts/types"
import type {
  ExecutionCategory,
  ExecutionScenario,
  StrategyChoice,
  TradeDirection,
} from "@/lib/execution-lab/types"
import type { MarketReadingLevel } from "@/lib/skills/types"

export type BuilderAnnotationTool =
  | "pointer"
  | "swing-high"
  | "swing-low"
  | "liquidity"
  | "support"
  | "resistance"
  | "entry"
  | "stop"
  | "target"
  | "decision"

export interface BuilderAnnotation {
  id: string
  tool: BuilderAnnotationTool
  index: number
  price: number
  label?: string
}

export interface ScenarioDraft {
  id: string
  title: string
  description: string
  symbol: string
  market: string
  timeframe: string
  difficulty: MarketReadingLevel
  category: ExecutionCategory
  behaviour: string
  subcategory: string
  tags: string[]
  session: string
  correctTrend: "uptrend" | "downtrend" | "range"
  idealDirection: TradeDirection
  bestStrategy: StrategyChoice
  strategyOptions: StrategyChoice[]
  noTradeValid: boolean
  idealEntry: number
  idealStop: number
  idealTarget: number
  pauseIndex: number
  pipSize: number
  pipValuePerLot: number
  defaultAccount: number
  hints: string[]
  commonMistakes: string[]
  journalPrompt: string
  reversalGrade?: "A+" | "A" | "B" | "C" | "D"
  candles: ScenarioCandle[]
  annotations: BuilderAnnotation[]
}

export const STRATEGY_OPTIONS: StrategyChoice[] = [
  "continuation",
  "reversal",
  "break-retest",
  "liquidity-sweep",
  "range",
  "no-trade",
]

export const CATEGORY_OPTIONS: ExecutionCategory[] = [
  "trend",
  "continuation",
  "reversal",
  "range",
  "breakout",
  "fakeout",
  "break-retest",
  "support",
  "resistance",
  "liquidity",
]

export const SYMBOL_PRESETS = [
  { symbol: "EURUSD", pipSize: 0.0001, pipValue: 10 },
  { symbol: "GBPUSD", pipSize: 0.0001, pipValue: 10 },
  { symbol: "USDJPY", pipSize: 0.01, pipValue: 9 },
  { symbol: "XAUUSD", pipSize: 0.01, pipValue: 9 },
  { symbol: "NAS100", pipSize: 1, pipValue: 1 },
] as const

export function createEmptyDraft(): ScenarioDraft {
  return {
    id: "custom-scenario-01",
    title: "New Scenario",
    description: "Describe the setup learners will face.",
    symbol: "EURUSD",
    market: "EURUSD",
    timeframe: "15M",
    difficulty: "Intermediate",
    category: "continuation",
    behaviour: "continuation",
    subcategory: "",
    tags: [],
    session: "London",
    correctTrend: "uptrend",
    idealDirection: "buy",
    bestStrategy: "continuation",
    strategyOptions: ["continuation", "reversal", "no-trade"],
    noTradeValid: true,
    idealEntry: 0,
    idealStop: 0,
    idealTarget: 0,
    pauseIndex: 0,
    pipSize: 0.0001,
    pipValuePerLot: 10,
    defaultAccount: 10000,
    hints: ["Hint 1 — look at structure", "Hint 2 — check the trend"],
    commonMistakes: ["Entering too early", "Ignoring higher timeframe"],
    journalPrompt: "What behaviour was the market showing?",
    candles: [],
    annotations: [],
  }
}

export function annotationsToChartAnnotations(
  annotations: BuilderAnnotation[]
): ChartAnnotation[] {
  return annotations.map((a) => {
    const base = { id: a.id, text: a.label }
    switch (a.tool) {
      case "swing-high":
        return { ...base, type: "swing-high" as const, index: a.index, price: a.price }
      case "swing-low":
        return { ...base, type: "swing-low" as const, index: a.index, price: a.price }
      case "support":
        return { ...base, type: "support" as const, index: a.index, price: a.price }
      case "resistance":
        return { ...base, type: "resistance" as const, index: a.index, price: a.price }
      case "liquidity":
        return { ...base, type: "label" as const, index: a.index, price: a.price, text: "Liquidity" }
      case "entry":
        return { ...base, type: "entry" as const, index: a.index, price: a.price }
      case "stop":
        return { ...base, type: "stop-loss" as const, index: a.index, price: a.price }
      case "target":
        return { ...base, type: "take-profit" as const, index: a.index, price: a.price }
      case "decision":
        return { ...base, type: "label" as const, index: a.index, price: a.price, text: "Decision" }
      default:
        return { ...base, type: "label" as const, index: a.index, price: a.price }
    }
  })
}

export function buildExecutionScenarioFromDraft(draft: ScenarioDraft): ExecutionScenario | null {
  if (draft.candles.length < 10) return null

  const pauseIndex = Math.min(
    Math.max(0, draft.pauseIndex),
    draft.candles.length - 1
  )

  const chart = {
    id: draft.id,
    title: draft.title,
    description: draft.description,
    symbol: draft.symbol,
    timeframe: (draft.timeframe.replace("M", "M") as Timeframe) || "15M",
    concept: draft.category === "break-retest" ? ("break-retest" as const) : ("trend" as const),
    candles: draft.candles,
    annotations: annotationsToChartAnnotations(draft.annotations),
    hints: draft.hints,
    explanation: draft.description,
    difficulty: draft.difficulty === "Beginner" ? ("beginner" as const) : ("intermediate" as const),
    estimatedMinutes: 8,
  }

  const entry = draft.idealEntry || draft.candles[pauseIndex]?.close || 0
  const stop = draft.idealStop || entry * 0.998
  const target = draft.idealTarget || entry * 1.004

  return {
    id: draft.id,
    title: draft.title,
    description: draft.description,
    symbol: draft.symbol,
    timeframe: draft.timeframe,
    category: draft.category,
    difficulty: draft.difficulty,
    chart,
    pauseIndex,
    replayEndIndex: draft.candles.length - 1,
    correctTrend: draft.correctTrend,
    bestStrategy: draft.bestStrategy,
    strategyOptions: draft.strategyOptions,
    idealDirection: draft.idealDirection,
    idealEntry: entry,
    idealStop: stop,
    idealTarget: target,
    pipSize: draft.pipSize,
    pipValuePerLot: draft.pipValuePerLot,
    defaultAccount: draft.defaultAccount,
    hints: draft.hints,
    behaviour: draft.behaviour,
    subcategory: draft.subcategory || undefined,
    tags: draft.tags.length > 0 ? draft.tags : undefined,
    journalPrompt: draft.journalPrompt || undefined,
    reversalGrade: draft.reversalGrade,
  }
}
