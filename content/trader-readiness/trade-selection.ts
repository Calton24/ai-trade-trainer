import type { TradeSelectionScenario } from "@/lib/trader-readiness/types"

export const TRADE_SELECTION_SCENARIOS: TradeSelectionScenario[] = [
  {
    id: "ts-1",
    title: "Morning setups",
    prompt:
      "Three setups appeared this morning. Which would you take, which would you avoid, and why?",
    setups: [
      {
        id: "setup-a",
        chartScenarioId: "task-spot-trend",
        label: "Setup A — Pullback to support in uptrend",
        quality: "take",
        trendAlignment: 90,
        riskReward: 85,
        entryQuality: 80,
        marketStructure: 85,
        explanation:
          "Clean pullback to prior resistance-turned-support in a clear uptrend. Good R:R with stop below structure.",
      },
      {
        id: "setup-b",
        chartScenarioId: "task-mark-swing-high",
        label: "Setup B — Breakout in choppy range",
        quality: "avoid",
        trendAlignment: 30,
        riskReward: 40,
        entryQuality: 35,
        marketStructure: 25,
        explanation:
          "Range-bound chop with no clear trend. Breakouts in ranges often fail — low probability setup.",
      },
      {
        id: "setup-c",
        chartScenarioId: "task-break-retest",
        label: "Setup C — Break and retest",
        quality: "take",
        trendAlignment: 75,
        riskReward: 80,
        entryQuality: 85,
        marketStructure: 80,
        explanation:
          "Valid break and retest with confirmation candle. Structure supports continuation.",
      },
    ],
    bestTakeId: "setup-a",
    bestAvoidId: "setup-b",
  },
]

export function getTradeSelectionScenario(
  id?: string
): TradeSelectionScenario {
  return (
    TRADE_SELECTION_SCENARIOS.find((s) => s.id === id) ??
    TRADE_SELECTION_SCENARIOS[0]
  )
}
