import { generateScenario } from "@/lib/charts/generate-scenario"
import type { ChartScenario } from "@/lib/charts/types"

import type { ExecutionScenario, StrategyChoice } from "@/lib/execution-lab/types"

import { REVERSAL_EXECUTION_SCENARIOS } from "./reversal-scenarios"

interface ScenarioMeta {
  id: string
  title: string
  description: string
  symbol: string
  kind: Parameters<typeof generateScenario>[0]["kind"]
  seed: string
  category: ExecutionScenario["category"]
  difficulty: ExecutionScenario["difficulty"]
  correctTrend: ExecutionScenario["correctTrend"]
  bestStrategy: StrategyChoice
  strategyOptions: StrategyChoice[]
  idealDirection: ExecutionScenario["idealDirection"]
  pipSize: number
  pipValuePerLot: number
  defaultAccount: number
  pauseFraction?: number
  hints: string[]
  behaviour?: string
  subcategory?: string
  tags?: string[]
  journalPrompt?: string
  reversalGrade?: ExecutionScenario["reversalGrade"]
  timeframe?: string
}

export type { ScenarioMeta }

function buildChart(meta: ScenarioMeta): ChartScenario {
  const base = meta.symbol.includes("XAU") ? 2350 : meta.symbol.includes("JPY") ? 148.5 : 1.085
  const generated = generateScenario({
    kind: meta.kind,
    seed: meta.seed,
    base,
    length: 48,
  })
  return {
    id: meta.id,
    title: meta.title,
    description: meta.description,
    symbol: meta.symbol,
    timeframe: "15M",
    concept: meta.category === "break-retest" ? "break-retest" : "trend",
    candles: generated.candles,
    annotations: generated.annotations,
    hints: meta.hints,
    explanation: meta.description,
    difficulty: meta.difficulty === "Beginner" ? "beginner" : "intermediate",
    estimatedMinutes: 8,
  }
}

function deriveLevels(
  candles: ChartScenario["candles"],
  direction: "buy" | "sell" | "wait" | "no-trade",
  pauseIndex: number
) {
  const idx = Math.min(Math.max(pauseIndex, 0), candles.length - 1)
  const decision = candles[idx]
  const entry = decision.close
  const lookback = candles.slice(Math.max(0, idx - 10), idx + 1)

  if (direction === "wait" || direction === "no-trade") {
    const pad = entry * 0.002
    return {
      entry: Math.round(entry * 100000) / 100000,
      stop: Math.round((entry - pad) * 100000) / 100000,
      target: Math.round((entry + pad * 2) * 100000) / 100000,
      pauseIndex: idx,
    }
  }

  const swing =
    direction === "buy"
      ? Math.min(...lookback.map((c) => c.low))
      : Math.max(...lookback.map((c) => c.high))
  const stop =
    direction === "buy"
      ? swing - Math.abs(entry - swing) * 0.2
      : swing + Math.abs(swing - entry) * 0.2
  const risk = Math.abs(entry - stop)
  const target =
    direction === "buy" ? entry + risk * 2.2 : entry - risk * 2.2
  return {
    entry: Math.round(entry * 100000) / 100000,
    stop: Math.round(stop * 100000) / 100000,
    target: Math.round(target * 100000) / 100000,
    pauseIndex: idx,
  }
}

function build(meta: ScenarioMeta): ExecutionScenario {
  const chart = buildChart(meta)
  const pauseIndex =
    meta.pauseFraction !== undefined
      ? Math.floor(chart.candles.length * meta.pauseFraction)
      : chart.candles.length - 6
  const direction =
    meta.idealDirection === "sell"
      ? "sell"
      : meta.idealDirection === "buy"
        ? "buy"
        : meta.idealDirection
  const levels = deriveLevels(chart.candles, direction, pauseIndex)

  return {
    id: meta.id,
    title: meta.title,
    description: meta.description,
    symbol: meta.symbol,
    timeframe: meta.timeframe ?? "15M",
    category: meta.category,
    difficulty: meta.difficulty,
    chart,
    pauseIndex,
    replayEndIndex: chart.candles.length - 1,
    correctTrend: meta.correctTrend,
    bestStrategy: meta.bestStrategy,
    strategyOptions: meta.strategyOptions,
    idealDirection: meta.idealDirection,
    idealEntry: levels.entry,
    idealStop: levels.stop,
    idealTarget: levels.target,
    pipSize: meta.pipSize,
    pipValuePerLot: meta.pipValuePerLot,
    defaultAccount: meta.defaultAccount,
    hints: meta.hints,
    behaviour: meta.behaviour,
    subcategory: meta.subcategory,
    tags: meta.tags,
    journalPrompt: meta.journalPrompt,
    reversalGrade: meta.reversalGrade,
  }
}

export { build as buildExecutionScenario }

const META: ScenarioMeta[] = [
  {
    id: "exec-eurusd-continuation",
    title: "EURUSD Continuation",
    description: "Clean uptrend pulling back to structure. Continuation or no trade?",
    symbol: "EURUSD",
    kind: "uptrend",
    seed: "exec-eur-cont",
    category: "continuation",
    difficulty: "Beginner",
    correctTrend: "uptrend",
    bestStrategy: "continuation",
    strategyOptions: ["continuation", "reversal", "range", "no-trade"],
    idealDirection: "buy",
    pipSize: 0.0001,
    pipValuePerLot: 10,
    defaultAccount: 10000,
    pauseFraction: 0.72,
    hints: ["Look for HH/HL sequence", "Wait for pullback to complete"],
  },
  {
    id: "exec-gbpusd-reversal",
    title: "GBPUSD Early Reversal",
    description: "Downtrend printing its first higher high. Reversal or trap?",
    symbol: "GBPUSD",
    kind: "downtrend-reversal",
    seed: "exec-gbp-rev",
    category: "reversal",
    difficulty: "Intermediate",
    correctTrend: "uptrend",
    bestStrategy: "reversal",
    strategyOptions: ["reversal", "continuation", "break-retest", "no-trade"],
    idealDirection: "wait",
    pipSize: 0.0001,
    pipValuePerLot: 10,
    defaultAccount: 10000,
    pauseFraction: 0.75,
    hints: ["One broken swing is a warning, not confirmation", "Patience often wins"],
  },
  {
    id: "exec-xau-break-retest",
    title: "Gold Break & Retest",
    description: "XAUUSD breaks resistance and pulls back. Enter the retest?",
    symbol: "XAUUSD",
    kind: "break-retest",
    seed: "exec-xau-br",
    category: "break-retest",
    difficulty: "Intermediate",
    correctTrend: "uptrend",
    bestStrategy: "break-retest",
    strategyOptions: ["break-retest", "continuation", "liquidity-sweep", "no-trade"],
    idealDirection: "buy",
    pipSize: 0.01,
    pipValuePerLot: 1,
    defaultAccount: 10000,
    pauseFraction: 0.7,
    hints: ["Broken resistance becomes support", "Don't chase the initial breakout"],
  },
  {
    id: "exec-eurusd-range",
    title: "EURUSD Range — No Trade",
    description: "Messy overlapping highs and lows. Is there a trade here?",
    symbol: "EURUSD",
    kind: "ranging",
    seed: "exec-eur-range",
    category: "range",
    difficulty: "Beginner",
    correctTrend: "range",
    bestStrategy: "no-trade",
    strategyOptions: ["continuation", "reversal", "range", "no-trade"],
    idealDirection: "no-trade",
    pipSize: 0.0001,
    pipValuePerLot: 10,
    defaultAccount: 10000,
    pauseFraction: 0.68,
    hints: ["No trend = no edge", "Standing aside is a professional decision"],
  },
  {
    id: "exec-usdjpy-fakeout",
    title: "USDJPY Fakeout",
    description: "Breakout fails and reverses. Liquidity sweep or continuation?",
    symbol: "USDJPY",
    kind: "fakeout",
    seed: "exec-jpy-fake",
    category: "fakeout",
    difficulty: "Advanced",
    correctTrend: "downtrend",
    bestStrategy: "liquidity-sweep",
    strategyOptions: ["liquidity-sweep", "break-retest", "continuation", "no-trade"],
    idealDirection: "sell",
    pipSize: 0.01,
    pipValuePerLot: 9,
    defaultAccount: 10000,
    pauseFraction: 0.74,
    hints: ["Watch for false breaks above resistance", "Stops often sit above the sweep"],
  },
  {
    id: "exec-eurusd-support",
    title: "EURUSD Support Bounce",
    description: "Price rejects support in an uptrend. Buy the bounce?",
    symbol: "EURUSD",
    kind: "support-bounce",
    seed: "exec-eur-sup",
    category: "support",
    difficulty: "Beginner",
    correctTrend: "uptrend",
    bestStrategy: "continuation",
    strategyOptions: ["continuation", "break-retest", "reversal", "no-trade"],
    idealDirection: "buy",
    pipSize: 0.0001,
    pipValuePerLot: 10,
    defaultAccount: 5000,
    pauseFraction: 0.7,
    hints: ["Support in an uptrend = higher low zone", "Place stop below the swing low"],
  },
]

export const EXECUTION_SCENARIOS: ExecutionScenario[] = META.map(build)

export const ALL_EXECUTION_SCENARIOS: ExecutionScenario[] = [
  ...EXECUTION_SCENARIOS,
  ...REVERSAL_EXECUTION_SCENARIOS,
]

export function getExecutionScenario(id: string): ExecutionScenario | undefined {
  return ALL_EXECUTION_SCENARIOS.find((s) => s.id === id)
}

export function pickRandomScenario(
  excludeIds: string[] = []
): ExecutionScenario {
  const pool = ALL_EXECUTION_SCENARIOS.filter((s) => !excludeIds.includes(s.id))
  return pool[Math.floor(Math.random() * pool.length)] ?? ALL_EXECUTION_SCENARIOS[0]
}

export function getScenariosByCategory(
  category: ExecutionScenario["category"]
): ExecutionScenario[] {
  return ALL_EXECUTION_SCENARIOS.filter((s) => s.category === category)
}

export function getScenariosByBehaviour(behaviour: string): ExecutionScenario[] {
  return ALL_EXECUTION_SCENARIOS.filter((s) => s.behaviour === behaviour)
}
