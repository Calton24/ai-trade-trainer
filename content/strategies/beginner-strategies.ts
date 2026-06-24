import { buildStrategy, chartEx, exercise } from "./strategy-builder"

export const supportBounceStrategy = buildStrategy({
  id: "support-bounce",
  slug: "support-bounce",
  title: "Support Bounce",
  category: "Price Action",
  difficulty: "beginner",
  summary: "Price reaches a support zone and shows signs of rejection.",
  bestMarketCondition: "Defined uptrend or range with visible support tests.",
  timeframes: ["15M", "1H"],
  whenToUse: "Price approaches a tested support zone with slowing momentum.",
  whenToAvoid: "Support in a strong downtrend or after multiple failed bounces.",
  setupStepExplanations: [
    "Context shows buyers previously defended this area.",
    "Mark the support zone from prior swing lows.",
    "Price reaches the zone again.",
    "Look for rejection wicks or bullish engulfing at support.",
    "Entry near confirmation candle close or zone midpoint.",
    "Stop below the support zone invalidation.",
    "Target prior swing high or range midpoint.",
    "Skip if support is untested, broken, or confirmation is weak.",
    "Journal reaction quality and whether you waited for confirmation.",
  ],
  entryLogic: "After bullish rejection candle or hold at support with higher low.",
  stopLossLogic: "Below the support zone where buyers failed to defend.",
  takeProfitLogic: "Prior resistance, range high, or measured bounce.",
  invalidationRules: [
    "Clean close below support zone.",
    "Lower highs into support in a downtrend.",
  ],
  commonMistakes: [
    "Buying before price reaches the zone.",
    "Using a stop too tight inside the zone.",
    "Ignoring broader trend context.",
  ],
  chartExamples: [
    chartEx(
      "support-bounce",
      "clean",
      "demo-support",
      "clean",
      "Clean support bounce",
      "Price tests support and rejects with a bullish reaction."
    ),
    chartEx(
      "support-bounce",
      "break",
      "demo-fakeout",
      "failed",
      "Support break invalidation",
      "Support fails to hold — bounce idea is wrong."
    ),
    chartEx(
      "support-bounce",
      "weak",
      "demo-trend-range",
      "skip",
      "Weak support / poor confirmation",
      "No clear rejection — better to wait or skip."
    ),
  ],
  practiceExercises: [
    exercise(
      "support-bounce",
      "mark-support",
      "Identify and mark support",
      "task-identify-support",
      "Mark the support zone and where confirmation would appear.",
      "trade",
      "Support is a zone — mark where buyers previously stepped in."
    ),
  ],
  flashcardDeckSlug: "support-resistance",
  relatedStrategySlugs: ["break-retest", "resistance-rejection"],
  featured: true,
})

export const resistanceRejectionStrategy = buildStrategy({
  id: "resistance-rejection",
  slug: "resistance-rejection",
  title: "Resistance Rejection",
  category: "Price Action",
  difficulty: "beginner",
  summary: "Price reaches resistance and fails to break higher.",
  bestMarketCondition: "Range or pullback into overhead supply.",
  timeframes: ["15M", "1H"],
  whenToUse: "Price stalls at resistance with rejection candles.",
  whenToAvoid: "Strong breakout momentum through resistance.",
  setupStepExplanations: [
    "Overhead supply or prior swing high defines resistance.",
    "Mark the resistance zone from prior rejections.",
    "Price rallies into the zone.",
    "Look for upper wicks or bearish engulfing at resistance.",
    "Entry after rejection confirmation.",
    "Stop above the resistance zone.",
    "Target support or range low.",
    "Skip if breakout is clean with volume follow-through.",
    "Journal whether rejection was clear or you anticipated too early.",
  ],
  entryLogic: "After bearish rejection at resistance with lower high structure.",
  stopLossLogic: "Above resistance where breakout would invalidate.",
  takeProfitLogic: "Range low, prior support, or measured move down.",
  invalidationRules: ["Close above resistance with follow-through."],
  commonMistakes: [
    "Shorting before price reaches resistance.",
    "Ignoring bullish trend continuation.",
  ],
  chartExamples: [
    chartEx(
      "resistance-rejection",
      "clean",
      "demo-resistance",
      "clean",
      "Clean resistance rejection",
      "Price fails at resistance and rolls over."
    ),
    chartEx(
      "resistance-rejection",
      "breakout",
      "demo-breakout",
      "failed",
      "Failed rejection — breakout",
      "Resistance breaks — rejection idea invalidated."
    ),
    chartEx(
      "resistance-rejection",
      "weak",
      "demo-trend-range",
      "skip",
      "Unclear rejection",
      "No clean signal — skip rather than force a short."
    ),
  ],
  practiceExercises: [
    exercise(
      "resistance-rejection",
      "mark-resistance",
      "Mark resistance rejection",
      "task-identify-resistance",
      "Mark resistance and where rejection would confirm.",
      "trade",
      "Wait for price to reach the zone before calling rejection."
    ),
  ],
  flashcardDeckSlug: "support-resistance",
  relatedStrategySlugs: ["support-bounce", "break-retest"],
  featured: true,
})

export const trendPullbackStrategy = buildStrategy({
  id: "trend-pullback",
  slug: "trend-pullback",
  title: "Trend Pullback",
  category: "Trend Following",
  difficulty: "beginner",
  summary: "Price pulls back inside an existing trend before continuing.",
  bestMarketCondition: "Clear higher highs/higher lows or lower highs/lower lows.",
  timeframes: ["15M", "1H", "4H"],
  whenToUse: "Established trend with shallow pullback to structure.",
  whenToAvoid: "Trend exhaustion, deep pullbacks breaking structure.",
  setupStepExplanations: [
    "Identify trend direction from swing structure.",
    "Mark trend line or prior swing level for pullback.",
    "Price pulls back counter-trend without breaking structure.",
    "Look for continuation signal in trend direction.",
    "Entry on continuation after pullback completes.",
    "Stop beyond pullback low/high that breaks structure.",
    "Target prior swing extension or trend measured move.",
    "Skip if pullback depth breaks trend structure.",
    "Journal pullback depth and whether you waited for continuation.",
  ],
  entryLogic: "Continuation candle after pullback to trend support/resistance.",
  stopLossLogic: "Beyond swing that would break trend structure.",
  takeProfitLogic: "Prior high/low extension or next liquidity level.",
  invalidationRules: ["Pullback breaks prior swing — trend may be shifting."],
  commonMistakes: [
    "Trading pullbacks in a range as if trending.",
    "Entering before continuation confirms.",
  ],
  chartExamples: [
    chartEx(
      "trend-pullback",
      "clean",
      "demo-trend-range",
      "clean",
      "Clean trend pullback",
      "Pullback in uptrend holds structure and continues."
    ),
    chartEx(
      "trend-pullback",
      "break",
      "demo-fakeout",
      "failed",
      "Structure break",
      "Pullback too deep — trend idea weakened."
    ),
    chartEx(
      "trend-pullback",
      "late",
      "demo-chasing-late-entry",
      "skip",
      "Late continuation entry",
      "Move already extended after pullback resolved."
    ),
  ],
  practiceExercises: [
    exercise(
      "trend-pullback",
      "spot-trend",
      "Spot trend and pullback",
      "task-spot-trend",
      "Classify trend and mark pullback entry zone.",
      "trade",
      "Confirm swing structure before marking the pullback entry."
    ),
  ],
  relatedStrategySlugs: ["moving-average-trend", "bull-flag"],
})
