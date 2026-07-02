import { generateScenario } from "@/lib/charts/generate-scenario"
import type { ChartScenario } from "@/lib/charts/types"
import type { TrendClassification } from "@/lib/trend-spotter/types"
import type { SimulatorScenario } from "@/lib/simulator/types"

function toChartScenario(
  id: string,
  title: string,
  symbol: string,
  kind: Parameters<typeof generateScenario>[0]["kind"],
  seed: string
): ChartScenario {
  const generated = generateScenario({ kind, seed, length: 48 })
  return {
    id,
    title,
    description: generated.defaultTask,
    symbol,
    timeframe: "15M",
    concept:
      kind === "uptrend" || kind === "downtrend"
        ? "trend"
        : kind === "break-retest"
          ? "break-retest"
          : kind === "breakout"
            ? "breakout"
            : "support",
    candles: generated.candles,
    annotations: generated.annotations,
    expectedAnswer: generated.expectedAnswer,
    task: generated.defaultTask,
    tools: generated.tools,
    hints: ["Use the replay controls to study price action before deciding."],
    explanation: "Practice identifying structure before committing capital.",
    difficulty: "beginner",
    estimatedMinutes: 5,
  }
}

const KIND_TO_TREND: Record<string, TrendClassification> = {
  uptrend: "uptrend",
  downtrend: "downtrend",
  ranging: "range",
  "support-bounce": "uptrend",
  "resistance-rejection": "downtrend",
  breakout: "uptrend",
  fakeout: "messy",
  "break-retest": "uptrend",
}

function buildChartReading(seed: string): SimulatorScenario {
  const kind = seed.endsWith("1") ? "uptrend" : seed.endsWith("2") ? "downtrend" : "ranging"
  const chart = toChartScenario(`sim-cr-${seed}`, "Trend Reading", "SIM/USD", kind, seed)
  return {
    id: `sim-cr-${seed}`,
    stageId: "chart-reading",
    title: "What is the trend?",
    symbol: "SIM/USD",
    timeframe: "15M",
    seed,
    chart,
    correctTrend: KIND_TO_TREND[kind] ?? "uptrend",
    replayStartIndex: chart.candles.length - 1,
    replayEndIndex: chart.candles.length - 1,
  }
}

function buildSupportResistance(seed: string): SimulatorScenario {
  const kind = seed.endsWith("3") ? "break-retest" : "support-bounce"
  const chart = toChartScenario(`sim-sr-${seed}`, "Level Marking", "SIM/USD", kind, seed)
  return {
    id: `sim-sr-${seed}`,
    stageId: "support-resistance",
    title: "Mark support, resistance, breakout & retest",
    symbol: "SIM/USD",
    timeframe: "15M",
    seed,
    chart,
    replayStartIndex: Math.floor(chart.candles.length * 0.6),
    replayEndIndex: chart.candles.length - 1,
  }
}

function buildTradeSelection(seed: string): SimulatorScenario {
  const options = [
    toChartScenario(`sim-ts-a-${seed}`, "Setup A", "SIM/USD", "fakeout", `${seed}-a`),
    toChartScenario(`sim-ts-b-${seed}`, "Setup B", "SIM/USD", "break-retest", `${seed}-b`),
    toChartScenario(`sim-ts-c-${seed}`, "Setup C", "SIM/USD", "ranging", `${seed}-c`),
  ]
  return {
    id: `sim-ts-${seed}`,
    stageId: "trade-selection",
    title: "Which trade would you take?",
    symbol: "SIM/USD",
    timeframe: "15M",
    seed,
    chart: options[1],
    options,
    bestOptionIndex: 1,
    replayStartIndex: options[1].candles.length - 1,
    replayEndIndex: options[1].candles.length - 1,
  }
}

function buildTradePlanning(seed: string): SimulatorScenario {
  const chart = toChartScenario(`sim-tp-${seed}`, "Plan the Trade", "SIM/USD", "break-retest", seed)
  const entryCandle = chart.candles[Math.floor(chart.candles.length * 0.75)]
  const idealEntry = entryCandle.close
  const idealStop = idealEntry * 0.985
  const idealTarget = idealEntry * 1.03
  return {
    id: `sim-tp-${seed}`,
    stageId: "trade-planning",
    title: "Define your entry, stop, target & RR",
    symbol: "SIM/USD",
    timeframe: "15M",
    seed,
    chart,
    idealEntry,
    idealStop,
    idealTarget,
    replayStartIndex: Math.floor(chart.candles.length * 0.65),
    replayEndIndex: chart.candles.length - 1,
  }
}

function buildTradeManagement(seed: string): SimulatorScenario {
  const chart = toChartScenario(`sim-tm-${seed}`, "Manage the Trade", "SIM/USD", "uptrend", seed)
  const entryIdx = Math.floor(chart.candles.length * 0.55)
  const midIdx = Math.floor(chart.candles.length * 0.72)
  const lateIdx = Math.floor(chart.candles.length * 0.88)
  return {
    id: `sim-tm-${seed}`,
    stageId: "trade-management",
    title: "Manage your open position",
    symbol: "SIM/USD",
    timeframe: "15M",
    seed,
    chart,
    replayStartIndex: entryIdx,
    replayEndIndex: chart.candles.length - 1,
    decisionPoints: [
      {
        candleIndex: midIdx,
        correctDecision: "hold",
        context: "Price pulls back to support but structure remains bullish.",
      },
      {
        candleIndex: lateIdx,
        correctDecision: "close",
        context: "Momentum stalls at resistance — protect profits.",
      },
    ],
  }
}

const SEEDS = ["alpha", "bravo", "charlie", "delta", "echo"]

export const SIMULATOR_SCENARIOS: SimulatorScenario[] = [
  ...SEEDS.map(buildChartReading),
  ...SEEDS.map(buildSupportResistance),
  ...SEEDS.map(buildTradeSelection),
  ...SEEDS.map(buildTradePlanning),
  ...SEEDS.map(buildTradeManagement),
]

export function getScenariosForStage(stageId: string): SimulatorScenario[] {
  return SIMULATOR_SCENARIOS.filter((s) => s.stageId === stageId)
}

export function getSimulatorScenario(id: string): SimulatorScenario | undefined {
  return SIMULATOR_SCENARIOS.find((s) => s.id === id)
}

export function pickScenarioForStage(
  stageId: string,
  completedIds: string[]
): SimulatorScenario | undefined {
  const pool = getScenariosForStage(stageId).filter((s) => !completedIds.includes(s.id))
  if (pool.length === 0) {
    return getScenariosForStage(stageId)[0]
  }
  return pool[Math.floor(Math.random() * pool.length)]
}
