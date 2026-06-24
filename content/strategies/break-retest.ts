import { buildStrategy, chartEx, exercise } from "./strategy-builder"

export const breakRetestStrategy = buildStrategy({
  id: "break-retest",
  slug: "break-retest",
  title: "Break & Retest",
  category: "Price Action",
  difficulty: "beginner",
  summary:
    "Price breaks a key level, returns to test it, then continues in the break direction.",
  bestMarketCondition: "Clear prior range or level with room to the next target.",
  timeframes: ["15M", "1H", "4H"],
  whenToUse:
    "After a decisive break of support or resistance with a clean retest and rejection.",
  whenToAvoid:
    "Choppy ranges, late entries after the move already extended, or unclear retests.",
  setupStepExplanations: [
    "Market breaks a clear support or resistance level with momentum.",
    "Mark the broken level as a zone — not a single line.",
    "Wait for price to return to the level after the break.",
    "Look for rejection wicks or continuation candles at the retest.",
    "Theoretical entry sits near the retest confirmation area.",
    "Stop goes beyond the retest zone where the idea is invalidated.",
    "Target is the next logical level or liquidity area.",
    "Skip if price already moved too far, risk/reward is poor, or retest is unclear.",
    "Journal whether you waited for confirmation or entered early.",
  ],
  setupStepTips: [
    "Break should close beyond the level, not just wick through.",
    "Zones absorb noise better than exact prices.",
    "Patience at the retest separates clean setups from chasing.",
  ],
  entryLogic:
    "Enter after retest confirmation — rejection candle or continuation in break direction.",
  stopLossLogic:
    "Beyond the retest zone on the wrong side of the broken level.",
  takeProfitLogic:
    "Next swing high/low, measured move, or prior liquidity pool.",
  invalidationRules: [
    "Price closes back through the broken level on the wrong side.",
    "Retest holds too long without confirmation.",
    "Break was a single wick with no follow-through.",
  ],
  commonMistakes: [
    "Entering on the initial break without waiting for retest.",
    "Placing stop inside the retest zone.",
    "Chasing after price already reached the target area.",
  ],
  chartExamples: [
    chartEx(
      "break-retest",
      "clean-bull",
      "demo-break-retest",
      "clean",
      "Clean bullish break and retest",
      "Break above resistance, pullback to the level, then continuation higher."
    ),
    chartEx(
      "break-retest",
      "failed",
      "demo-fakeout",
      "failed",
      "Failed retest / fakeout",
      "Break fails and price closes back inside the range — idea invalidated."
    ),
    chartEx(
      "break-retest",
      "late",
      "demo-chasing-late-entry",
      "skip",
      "Late / chasing entry",
      "Move already extended — poor risk/reward even if direction was right."
    ),
  ],
  practiceExercises: [
    exercise(
      "break-retest",
      "mark-retest",
      "Mark the break and retest zone",
      "task-break-retest",
      "Mark the broken level, retest area, entry, stop, and target.",
      "trade",
      "Wait for price to return to the broken level before marking entry."
    ),
    exercise(
      "break-retest",
      "skip-late",
      "Decide trade or skip — extended move",
      "demo-chasing-late-entry",
      "Would you take this break & retest, or skip? Explain why.",
      "skip",
      "If confirmation is late and reward is small, skipping is the disciplined choice."
    ),
  ],
  flashcardDeckSlug: "break-retest",
  relatedStrategySlugs: ["support-bounce", "resistance-rejection", "trend-pullback"],
  featured: true,
})
