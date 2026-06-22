import type { ChartDrill } from "@/lib/course/types"

export const spotTheTrendDrill: ChartDrill = {
  id: "spot-the-trend",
  pathId: "trading-foundations",
  lessonId: "tf-m3-drill-trend",
  title: "Spot the Trend",
  drillType: "spot-trend",
  legacyDrillType: "spot_trend",
  instructions:
    "Look at the replay chart and mark the current trend direction based on swing structure. Is price making higher highs and higher lows, lower highs and lower lows, or moving sideways?",
  chartScenario: {
    pair: "BTC/USDT",
    timeframe: "15m",
    description:
      "Simulated replay chart showing recent swing highs and lows for trend practice.",
  },
  expectedAnswer:
    "Mark the trend line or direction that matches the dominant swing structure on the chart.",
  scoringRubric: [
    "Identifies whether structure is uptrend, downtrend, or range",
    "Uses recent swing points rather than a single candle",
    "Does not confuse a small pullback with a full trend reversal",
  ],
  feedbackTemplates: {
    strong:
      "Good work reading structure. You looked at swings instead of reacting to one candle.",
    weak:
      "Trend is about the pattern of highs and lows over several swings — zoom out mentally before marking.",
    hint: "Ask: are highs getting higher? Are lows getting higher? That helps spot an uptrend.",
  },
  xpReward: 60,
}
