import { buildStrategy, chartEx, exercise } from "./strategy-builder"

export const openingRangeBreakoutStrategy = buildStrategy({
  id: "opening-range-breakout",
  slug: "opening-range-breakout",
  title: "Opening Range Breakout",
  category: "Day Trading",
  difficulty: "beginner-intermediate",
  summary: "Price breaks the high or low of the opening range.",
  bestMarketCondition: "Active session open with defined first-hour range.",
  timeframes: ["5M", "15M"],
  whenToUse: "Clean opening range with decisive break and volume.",
  whenToAvoid: "Wide choppy ranges or low-volume midday breaks.",
  setupStepExplanations: [
    "Session opens and forms a defined high-low range.",
    "Mark opening range high and low.",
    "Price breaks above or below the range.",
    "Wait for hold beyond range or retest of broken boundary.",
    "Entry on break confirmation or retest of range edge.",
    "Stop inside the range on wrong side of break.",
    "Target measured range extension or next level.",
    "Skip if range is too wide or break lacks follow-through.",
    "Journal break timing and whether you chased the open.",
  ],
  entryLogic: "Break and hold beyond opening range with confirmation.",
  stopLossLogic: "Back inside opening range invalidates breakout.",
  takeProfitLogic: "Range height projected from break point.",
  invalidationRules: ["False break back into range."],
  commonMistakes: ["Trading every minor poke outside the range."],
  chartExamples: [
    chartEx(
      "opening-range-breakout",
      "clean",
      "demo-opening-range",
      "clean",
      "Clean opening range breakout",
      "Decisive break above opening range high."
    ),
    chartEx(
      "opening-range-breakout",
      "fake",
      "demo-fakeout",
      "failed",
      "False breakout",
      "Break fails and price returns inside range."
    ),
    chartEx(
      "opening-range-breakout",
      "late",
      "demo-chasing-late-entry",
      "skip",
      "Late chase after extension",
      "Break already extended — skip chasing."
    ),
  ],
  practiceExercises: [
    exercise(
      "opening-range-breakout",
      "mark-or",
      "Mark opening range break",
      "demo-opening-range",
      "Mark range boundaries and break point.",
      "trade",
      "Define the range before calling the breakout."
    ),
  ],
  relatedStrategySlugs: ["high-of-day-breakout", "vwap-bounce"],
})

export const vwapBounceStrategy = buildStrategy({
  id: "vwap-bounce",
  slug: "vwap-bounce",
  title: "VWAP Bounce",
  category: "Day Trading",
  difficulty: "intermediate",
  summary: "Price pulls into VWAP and reacts in the direction of trend.",
  bestMarketCondition: "Trending session with VWAP acting as dynamic support/resistance.",
  timeframes: ["5M", "15M"],
  whenToUse: "Trend day with pullback to VWAP holding.",
  whenToAvoid: "Range days where VWAP is crossed repeatedly.",
  setupStepExplanations: [
    "Session trend bias is established above or below VWAP.",
    "Mark VWAP line as dynamic level.",
    "Price pulls back to VWAP in trend direction.",
    "Look for hold and bounce off VWAP.",
    "Entry on bounce confirmation candle.",
    "Stop on wrong side of VWAP beyond pullback.",
    "Target prior session high/low or extension.",
    "Skip if VWAP is flat and price chops through it.",
    "Journal VWAP slope and bounce quality.",
  ],
  entryLogic: "Bounce from VWAP in direction of session trend.",
  stopLossLogic: "Close on wrong side of VWAP invalidates bounce.",
  takeProfitLogic: "Prior swing or session extreme.",
  invalidationRules: ["VWAP lost with follow-through against trend."],
  commonMistakes: ["Fading VWAP in a strong trend day."],
  chartExamples: [
    chartEx(
      "vwap-bounce",
      "clean",
      "demo-vwap-bounce",
      "clean",
      "Clean VWAP bounce",
      "Pullback to VWAP holds and continues trend."
    ),
    chartEx(
      "vwap-bounce",
      "reject",
      "demo-vwap-rejection",
      "failed",
      "VWAP rejection failure",
      "Price fails to hold VWAP — bounce idea wrong."
    ),
    chartEx(
      "vwap-bounce",
      "chop",
      "demo-trend-range",
      "skip",
      "Choppy VWAP — skip",
      "No trend bias — VWAP bounce low quality."
    ),
  ],
  practiceExercises: [
    exercise(
      "vwap-bounce",
      "mark-vwap",
      "Mark VWAP bounce setup",
      "demo-vwap-bounce",
      "Mark VWAP, pullback, and bounce confirmation.",
      "trade",
      "Confirm session trend before trading VWAP bounces."
    ),
  ],
  relatedStrategySlugs: ["trend-pullback", "opening-range-breakout"],
})

export const bullFlagStrategy = buildStrategy({
  id: "bull-flag",
  slug: "bull-flag",
  title: "Bull Flag",
  category: "Momentum",
  difficulty: "intermediate",
  summary: "Strong upward move, controlled pullback, then continuation.",
  bestMarketCondition: "Momentum session with sharp impulse leg up.",
  timeframes: ["5M", "15M"],
  whenToUse: "Flag forms shallow parallel channel after impulse.",
  whenToAvoid: "Deep flag breaking structure or low volume impulse.",
  setupStepExplanations: [
    "Strong bullish impulse leg establishes momentum.",
    "Mark flag upper and lower parallel boundaries.",
    "Controlled pullback against the impulse.",
    "Break above flag or hold at flag low with continuation.",
    "Entry on flag break or continuation from flag support.",
    "Stop below flag low invalidating pattern.",
    "Target impulse leg measured move projected up.",
    "Skip if flag is too deep or volume dies on break.",
    "Journal flag depth and break timing.",
  ],
  entryLogic: "Break above flag or bounce from flag low with volume.",
  stopLossLogic: "Below flag low — pattern failed.",
  takeProfitLogic: "Measured move equal to flagpole height.",
  invalidationRules: ["Flag breaks down instead of continuing up."],
  commonMistakes: ["Calling every small pause a bull flag."],
  chartExamples: [
    chartEx(
      "bull-flag",
      "clean",
      "demo-bull-flag",
      "clean",
      "Clean bull flag continuation",
      "Impulse, shallow flag, break higher."
    ),
    chartEx(
      "bull-flag",
      "fail",
      "demo-fakeout",
      "failed",
      "Failed bull flag",
      "Flag breaks down — continuation never comes."
    ),
    chartEx(
      "bull-flag",
      "late",
      "demo-chasing-late-entry",
      "skip",
      "Late flag break chase",
      "Break already extended — poor reward."
    ),
  ],
  practiceExercises: [
    exercise(
      "bull-flag",
      "mark-flag",
      "Mark bull flag pattern",
      "demo-bull-flag",
      "Mark flagpole, flag channel, and break point.",
      "trade",
      "Flag should be shallow — deep pullbacks weaken the pattern."
    ),
  ],
  relatedStrategySlugs: ["bear-flag", "high-of-day-breakout"],
})

export const bearFlagStrategy = buildStrategy({
  id: "bear-flag",
  slug: "bear-flag",
  title: "Bear Flag",
  category: "Momentum",
  difficulty: "intermediate",
  summary: "Strong downward move, controlled pullback, then continuation.",
  bestMarketCondition: "Bearish momentum session after impulse down.",
  timeframes: ["5M", "15M"],
  whenToUse: "Shallow upward flag after sharp drop.",
  whenToAvoid: "Reversal signs at flag highs.",
  setupStepExplanations: [
    "Strong bearish impulse leg down.",
    "Mark bear flag channel boundaries.",
    "Controlled bounce against the drop.",
    "Break below flag or rejection at flag resistance.",
    "Entry on flag breakdown.",
    "Stop above flag high.",
    "Target measured move down from flagpole.",
    "Skip if bounce reclaims prior structure.",
    "Journal flag symmetry and volume on break.",
  ],
  entryLogic: "Break below bear flag with continuation.",
  stopLossLogic: "Above flag high invalidates bear flag.",
  takeProfitLogic: "Flagpole height projected downward.",
  invalidationRules: ["Price breaks above flag and holds."],
  commonMistakes: ["Shorting into support below an extended drop."],
  chartExamples: [
    chartEx(
      "bear-flag",
      "clean",
      "demo-bull-flag",
      "clean",
      "Bear flag structure (inverted)",
      "Use the same flag mechanics on a bearish impulse — mirror the bull flag playbook."
    ),
    chartEx(
      "bear-flag",
      "fail",
      "demo-breakout",
      "failed",
      "Failed bear flag",
      "Breakout upward invalidates bear flag."
    ),
    chartEx(
      "bear-flag",
      "skip",
      "demo-trend-range",
      "skip",
      "No momentum — skip",
      "Without impulse leg, flag pattern is low quality."
    ),
  ],
  practiceExercises: [
    exercise(
      "bear-flag",
      "identify",
      "Identify bear flag breakdown",
      "demo-fakeout",
      "Mark impulse, flag, and breakdown area.",
      "skip",
      "If structure breaks upward, the bear flag is invalid — skip."
    ),
  ],
  relatedStrategySlugs: ["bull-flag", "reversal"],
})

export const reversalStrategy = buildStrategy({
  id: "reversal",
  slug: "reversal",
  title: "Reversal Setup",
  category: "Reversal",
  difficulty: "intermediate",
  summary: "Price shows exhaustion and begins shifting in the opposite direction.",
  bestMarketCondition: "Extended move into key level with divergence or climax.",
  timeframes: ["15M", "1H"],
  whenToUse: "Clear exhaustion at support/resistance after extended trend.",
  whenToAvoid: "Strong trend with no exhaustion signals.",
  setupStepExplanations: [
    "Prior trend extended into a key level.",
    "Mark reversal zone at support/resistance.",
    "Exhaustion — climactic volume or long wicks.",
    "Wait for structure shift — lower high or higher low.",
    "Entry after shift confirmation.",
    "Stop beyond exhaustion extreme.",
    "Target mean reversion or prior swing.",
    "Skip if trend continues with strength.",
    "Journal exhaustion signals you used.",
  ],
  entryLogic: "Structure break against prior trend after exhaustion.",
  stopLossLogic: "Beyond the exhaustion high/low.",
  takeProfitLogic: "Mid-range or prior swing level.",
  invalidationRules: ["Trend resumes with new extreme."],
  commonMistakes: ["Catching falling knives without confirmation."],
  chartExamples: [
    chartEx(
      "reversal",
      "clean",
      "demo-resistance",
      "clean",
      "Rejection reversal at resistance",
      "Exhaustion and roll from overhead supply."
    ),
    chartEx(
      "reversal",
      "fail",
      "demo-breakout",
      "failed",
      "Failed reversal",
      "Breakout continues — reversal wrong."
    ),
    chartEx(
      "reversal",
      "early",
      "demo-chasing-late-entry",
      "skip",
      "Premature reversal call",
      "No structure shift yet — skip."
    ),
  ],
  practiceExercises: [
    exercise(
      "reversal",
      "structure",
      "Mark reversal structure shift",
      "task-spot-trend",
      "Identify exhaustion and mark structure shift.",
      "skip",
      "Reversals need confirmation — don't anticipate without structure change."
    ),
  ],
  relatedStrategySlugs: ["resistance-rejection", "support-bounce"],
})

export const iccStrategy = buildStrategy({
  id: "icc",
  slug: "icc",
  title: "ICC Strategy",
  category: "Structure",
  difficulty: "intermediate",
  summary: "Indication, Correction, Continuation model for trend continuation.",
  bestMarketCondition: "Established trend with clear impulse-correction-continuation.",
  timeframes: ["15M", "1H"],
  whenToUse: "Trend shows indication leg, correction, then continuation break.",
  whenToAvoid: "Range-bound chop without clear legs.",
  setupStepExplanations: [
    "Trend context established with prior structure.",
    "Mark indication leg — strong move in trend direction.",
    "Correction pulls back without breaking structure.",
    "Continuation break resumes trend after correction.",
    "Entry on continuation break or retest.",
    "Stop beyond correction extreme.",
    "Target new trend extension or liquidity.",
    "Skip if correction is too deep or continuation never confirms.",
    "Journal each ICC phase you identified.",
  ],
  entryLogic: "Continuation break after correction completes.",
  stopLossLogic: "Beyond correction low/high breaking structure.",
  takeProfitLogic: "Extension equal to indication leg or next level.",
  invalidationRules: ["Correction breaks trend structure."],
  commonMistakes: [
    "Labeling every pullback as correction without indication.",
    "Entering before continuation confirms.",
  ],
  chartExamples: [
    chartEx(
      "icc",
      "bull",
      "demo-icc-bullish",
      "clean",
      "Clean bullish ICC",
      "Indication up, correction, continuation higher."
    ),
    chartEx(
      "icc",
      "phases",
      "demo-icc-continuation",
      "clean",
      "ICC continuation phase",
      "Focus on the continuation break after correction."
    ),
    chartEx(
      "icc",
      "invalid",
      "demo-fakeout",
      "failed",
      "Invalid ICC — no continuation",
      "Correction breaks down — continuation never confirms."
    ),
  ],
  practiceExercises: [
    exercise(
      "icc",
      "mark-icc",
      "Mark ICC phases",
      "task-icc-bullish",
      "Mark indication, correction, and continuation.",
      "trade",
      "Name each phase before marking entry."
    ),
    exercise(
      "icc",
      "bear",
      "Bearish ICC markup",
      "task-icc-bearish",
      "Mark bearish ICC structure.",
      "trade",
      "Correction should stay shallow relative to indication."
    ),
  ],
  flashcardDeckSlug: "icc",
  relatedStrategySlugs: ["trend-pullback", "bull-flag"],
})

export const movingAverageTrendStrategy = buildStrategy({
  id: "moving-average-trend",
  slug: "moving-average-trend",
  title: "Moving Average Trend Strategy",
  category: "Trend Following",
  difficulty: "intermediate",
  summary: "Price follows a moving average and continues with trend structure.",
  bestMarketCondition: "Trending market with price respecting a key MA.",
  timeframes: ["15M", "1H", "4H"],
  whenToUse: "Price pulls to MA and holds in trend direction.",
  whenToAvoid: "MA flat and price crossing repeatedly.",
  setupStepExplanations: [
    "Trend established with price above/below key MA.",
    "Mark moving average as dynamic support/resistance.",
    "Pullback touches MA without closing through.",
    "Bounce or continuation candle off MA.",
    "Entry on MA hold confirmation.",
    "Stop on wrong side of MA with structure break.",
    "Target prior swing extension.",
    "Skip if MA is flat or price whipsaws through it.",
    "Journal which MA period you used and why.",
  ],
  entryLogic: "Hold and bounce from MA in trend direction.",
  stopLossLogic: "Close beyond MA breaking short-term structure.",
  takeProfitLogic: "Prior high/low or trend channel edge.",
  invalidationRules: ["MA lost with follow-through against trend."],
  commonMistakes: ["Using MA alone without structure context."],
  chartExamples: [
    chartEx(
      "moving-average-trend",
      "clean",
      "demo-trend-range",
      "clean",
      "Trend respecting structure",
      "Pullback holds trend structure — MA concept applies similarly."
    ),
    chartEx(
      "moving-average-trend",
      "fail",
      "demo-fakeout",
      "failed",
      "MA lost",
      "Price breaks through dynamic support."
    ),
    chartEx(
      "moving-average-trend",
      "chop",
      "demo-trend-range",
      "skip",
      "Range — skip MA trend",
      "No trend — MA strategy low quality."
    ),
  ],
  practiceExercises: [
    exercise(
      "moving-average-trend",
      "trend",
      "Spot trend for MA playbook",
      "task-spot-trend",
      "Identify trend and mark MA pullback zone.",
      "trade",
      "Confirm trend before using MA as dynamic level."
    ),
  ],
  relatedStrategySlugs: ["trend-pullback", "vwap-bounce"],
})

export const highOfDayBreakoutStrategy = buildStrategy({
  id: "high-of-day-breakout",
  slug: "high-of-day-breakout",
  title: "High of Day Breakout",
  category: "Momentum",
  difficulty: "intermediate",
  summary: "Price breaks above the current day's high with momentum.",
  bestMarketCondition: "Trending session approaching prior high of day.",
  timeframes: ["5M", "15M"],
  whenToUse: "Clean break of HOD with volume and hold.",
  whenToAvoid: "Repeated failures at HOD or late-day low volume breaks.",
  setupStepExplanations: [
    "Session trend bullish approaching high of day.",
    "Mark current high of day level.",
    "Price consolidates below HOD.",
    "Break above HOD with momentum candle.",
    "Entry on break hold or retest of HOD.",
    "Stop below HOD or consolidation low.",
    "Target extension or next liquidity.",
    "Skip if multiple HOD rejections already occurred.",
    "Journal break volume and whether you chased.",
  ],
  entryLogic: "Break and hold above high of day.",
  stopLossLogic: "Back below HOD after false break.",
  takeProfitLogic: "Measured move or session extension target.",
  invalidationRules: ["False break back below HOD."],
  commonMistakes: ["Buying every touch of HOD without break confirmation."],
  chartExamples: [
    chartEx(
      "high-of-day-breakout",
      "clean",
      "demo-breakout",
      "clean",
      "Clean breakout momentum",
      "Decisive break with follow-through — analogous to HOD break."
    ),
    chartEx(
      "high-of-day-breakout",
      "fake",
      "demo-fakeout",
      "failed",
      "Failed HOD break",
      "Break fails — momentum idea wrong."
    ),
    chartEx(
      "high-of-day-breakout",
      "late",
      "demo-chasing-late-entry",
      "skip",
      "Late HOD chase",
      "Already extended — skip."
    ),
  ],
  practiceExercises: [
    exercise(
      "high-of-day-breakout",
      "mark-break",
      "Mark breakout level",
      "task-mark-breakout",
      "Mark breakout level, entry, stop, and target.",
      "trade",
      "Wait for hold above the level before entry."
    ),
  ],
  relatedStrategySlugs: ["opening-range-breakout", "bull-flag"],
})
