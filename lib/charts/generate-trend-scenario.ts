import { getChartScenario } from "@/content/chart-scenarios"
import type { ChartScenario } from "@/lib/charts/types"
import type { TrendSpotterScenario } from "@/lib/trend-spotter/types"

/** Maps Trend Spotter scenario types to existing Chart Lab synthetic scenarios. */
export type TrendScenarioKind =
  | "clean-uptrend"
  | "clean-downtrend"
  | "weak-uptrend"
  | "weak-downtrend"
  | "sideways-range"
  | "choppy-range"
  | "pullback-uptrend"
  | "pullback-downtrend"
  | "possible-bullish-reversal"
  | "possible-bearish-reversal"
  | "fake-reversal"
  | "trend-exhaustion"
  | "messy-no-trade"
  | "htf-uptrend-ltf-pullback"
  | "htf-downtrend-ltf-correction"

const KIND_TO_CHART_ID: Record<TrendScenarioKind, string> = {
  "clean-uptrend": "task-spot-trend",
  "clean-downtrend": "task-mark-swing-low",
  "weak-uptrend": "demo-swing-high-low",
  "weak-downtrend": "task-icc-bearish",
  "sideways-range": "demo-trend-range",
  "choppy-range": "demo-chasing-late-entry",
  "pullback-uptrend": "demo-break-retest",
  "pullback-downtrend": "demo-icc-correction",
  "possible-bullish-reversal": "demo-support",
  "possible-bearish-reversal": "demo-fakeout",
  "fake-reversal": "demo-fakeout",
  "trend-exhaustion": "demo-bullish-bearish",
  "messy-no-trade": "demo-chasing-late-entry",
  "htf-uptrend-ltf-pullback": "demo-icc-correction",
  "htf-downtrend-ltf-correction": "demo-icc-indication",
}

export function getChartScenarioForTrendKind(
  kind: TrendScenarioKind
): ChartScenario | undefined {
  return getChartScenario(KIND_TO_CHART_ID[kind])
}

export function getChartScenarioForTrendSpotter(
  scenario: TrendSpotterScenario
): ChartScenario | undefined {
  return getChartScenario(scenario.chartScenarioId)
}
