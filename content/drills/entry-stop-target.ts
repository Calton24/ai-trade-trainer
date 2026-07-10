import type { ChartDrill } from "@/lib/course/types"

/** Risk Management Mastery — stop placement drill (Module 3). */
export const entryStopTargetDrill: ChartDrill = {
  id: "rm-entry-stop-target",
  pathId: "risk-management",
  lessonId: "rm-m3-drill",
  title: "Entry, Stop & Target Placement",
  drillType: "entry-stop-target",
  legacyDrillType: "entry_stop_target",
  instructions:
    "Plan the full trade: place your entry at the setup, your stop loss behind the invalidation structure with a small buffer, and a take profit that offers at least 2:1 reward-to-risk.",
  chartScenario: {
    pair: "EUR/USD",
    timeframe: "1H",
    description:
      "A trending chart with a completed pullback — plan the continuation trade with correct risk placement.",
  },
  expectedAnswer:
    "Entry at the pullback zone, stop below the zone/recent higher low with buffer, target at or beyond the prior high for 2:1 or better.",
  scoringRubric: [
    "Stop sits beyond structure, not inside the noise",
    "Stop marks genuine invalidation of the trade idea",
    "Target reflects a realistic level the market can reach",
    "Reward-to-risk is at least 2:1",
  ],
  feedbackTemplates: {
    strong:
      "Well planned — your stop is behind structure and the target justifies the risk. This is a professional trade plan.",
    weak:
      "Check your stop: is it beyond the invalidation structure, or inside normal candle noise? And does the target offer at least twice the risk?",
    hint: "Find the level where the idea is objectively wrong — the stop goes just beyond it. Then ask if the realistic target pays at least 2:1.",
  },
  xpReward: 60,
}
