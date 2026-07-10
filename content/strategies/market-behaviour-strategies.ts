import { buildStrategy, chartEx } from "./strategy-builder"

/** Market Behaviour Academy playbooks — taught through deliberate practice. */

export const intradayReversalStrategy = buildStrategy({
  id: "intraday-reversal",
  slug: "intraday-reversal",
  title: "Intraday Reversal",
  category: "Market Behaviour",
  difficulty: "intermediate",
  summary:
    "Structure-first reversal on 15M–1H: trend weakens, BOS prints, retest confirms, execute with session context.",
  bestMarketCondition: "Clear prior trend with exhaustion, liquidity sweep, and London or NY session overlap.",
  timeframes: ["15M", "1H"],
  whenToUse:
    "Four-point trend breaks, LH/LL (or HH/HL) confirms, HTF agrees, and price retests the break zone.",
  whenToAvoid:
    "Mid-range chop, unconfirmed single swing breaks, or macro (DXY) directly contradicting the pair.",
  setupStepExplanations: [
    "Read daily and 4H bias — reversals against HTF flow need exceptional structure.",
    "Mark the four latest swings — has the sequence broken?",
    "Identify exhaustion: deep pullbacks, weak impulses, fading momentum.",
    "Wait for BOS — close beyond the prior HL (uptrend) or LH (downtrend).",
    "Entry on retest of the broken structure or order block — not on the break candle.",
    "Stop beyond the invalidation swing — the level that proves you wrong.",
    "Target prior liquidity or next structural level — minimum 1:2 RR.",
    "Skip if behaviour is unclear, fakeout risk high, or session is dead.",
    "Journal: behaviour label, grade (A–D), and what you'd repeat.",
  ],
  entryLogic: "Retest of broken structure after confirmed LH/LL or HH/HL sequence.",
  stopLossLogic: "Beyond the swing that invalidates the reversal thesis.",
  takeProfitLogic: "Liquidity pool or next HTF level; partial at 1R if uncertain.",
  invalidationRules: [
    "Structure reclaims — e.g. new HH after bearish thesis.",
    "No follow-through within 3–5 candles after entry.",
    "DXY or correlated pair flips against the trade.",
  ],
  commonMistakes: [
    "Calling reversal on the first LL without LH confirmation.",
    "Entering mid-impulse instead of on retest.",
    "Ignoring session timing and news windows.",
  ],
  chartExamples: [
    chartEx(
      "intraday-reversal",
      "bos-retest",
      "uptrend-reversal",
      "clean",
      "BOS + retest entry",
      "Structure breaks, price retests — that's the professional entry window."
    ),
  ],
  practiceExercises: [],
  relatedStrategySlugs: ["false-reversal-filter", "eod-reversal-behaviour"],
  featured: true,
})

export const eodReversalBehaviourStrategy = buildStrategy({
  id: "eod-reversal-behaviour",
  slug: "eod-reversal-behaviour",
  title: "EOD Reversal",
  category: "Market Behaviour",
  difficulty: "advanced",
  summary:
    "End-of-day reversal on the daily chart: full workflow from daily bias through exhaustion to execution at the close.",
  bestMarketCondition:
    "Mature daily trend showing exhaustion, liquidity sweep, and daily close confirming the turn.",
  timeframes: ["1D", "4H"],
  whenToUse:
    "Daily four-point sequence breaks, 4H agrees, DXY aligned, and daily close confirms the reversal.",
  whenToAvoid: "Mid-week chop, conflicting HTF trends, or before major news without edge.",
  setupStepExplanations: [
    "Daily trend and bias — are we in premium, discount, or mid?",
    "Market phase: impulse vs pullback vs exhaustion.",
    "Four-point structure on daily — has it broken?",
    "Liquidity sweep check — stops taken before the real move?",
    "Daily + 4H agreement — both timeframes must align.",
    "DXY and correlation check.",
    "Execute on or after confirming daily close — not intraday noise.",
    "Stop beyond the daily invalidation level.",
    "Journal the full workflow checklist every time.",
  ],
  entryLogic: "After confirming daily close in reversal direction with HTF confluence.",
  stopLossLogic: "Beyond the daily swing that invalidates the reversal.",
  takeProfitLogic: "Prior daily liquidity or measured move; trail if trend extends.",
  invalidationRules: [
    "Daily close back through the break level.",
    "4H structure reclaims against the thesis.",
    "Exhaustion thesis fails — trend resumes with clean continuation.",
  ],
  commonMistakes: [
    "Scalping EOD setups on 5M charts.",
    "Skipping the DXY and correlation step.",
    "Entering before the daily close confirms.",
  ],
  chartExamples: [
    chartEx(
      "eod-reversal-behaviour",
      "daily-exhaustion",
      "uptrend-reversal",
      "clean",
      "Daily exhaustion → reversal",
      "The daily workflow catches turns intraday traders miss."
    ),
  ],
  practiceExercises: [],
  relatedStrategySlugs: ["intraday-reversal", "false-reversal-filter"],
  featured: true,
})

export const trendContinuationBehaviourStrategy = buildStrategy({
  id: "trend-continuation-behaviour",
  slug: "trend-continuation-behaviour",
  title: "Trend Continuation",
  category: "Market Behaviour",
  difficulty: "intermediate",
  summary:
    "Trade pullbacks within intact structure — HH/HL or LH/LL sequence holds, momentum returns.",
  bestMarketCondition: "Strong trend with shallow pullbacks and clean four-point structure.",
  timeframes: ["15M", "1H", "4H"],
  whenToUse: "Pullback to structure or dynamic zone with HL/LH holding and momentum resuming.",
  whenToAvoid: "Deep pullbacks breaking structure, exhaustion signs, or HTF disagreement.",
  setupStepExplanations: [
    "Confirm trend with four agreeing swing points.",
    "Label behaviour: pullback, not reversal.",
    "Wait for pullback to complete — don't buy mid-fall.",
    "Entry as momentum resumes (break of pullback high/low).",
    "Stop below the HL (uptrend) or above the LH (downtrend).",
    "Target next liquidity or structural extension.",
    "Skip if structure breaks during the pullback.",
    "Grade setup quality before sizing.",
    "Review: did you confuse pullback with reversal?",
  ],
  entryLogic: "Resume entry after shallow pullback in intact trend structure.",
  stopLossLogic: "Beyond the pullback extreme that would break structure.",
  takeProfitLogic: "Prior swing high/low or liquidity pool in trend direction.",
  invalidationRules: ["HL or LH breaks.", "Momentum fails to resume within expected window."],
  commonMistakes: [
    "Entering before pullback completes.",
    "Confusing first LL warning with continuation.",
  ],
  chartExamples: [
    chartEx(
      "trend-continuation-behaviour",
      "pullback-resume",
      "uptrend",
      "clean",
      "Shallow pullback → continuation",
      "Structure intact — this is continuation behaviour."
    ),
  ],
  practiceExercises: [],
  relatedStrategySlugs: ["continuation-confirmation", "intraday-reversal"],
})

export const falseReversalFilterStrategy = buildStrategy({
  id: "false-reversal-filter",
  slug: "false-reversal-filter",
  title: "False Reversal Filter",
  category: "Market Behaviour",
  difficulty: "intermediate",
  summary:
    "Filter traps: one swing break, no follow-through, no HTF agreement — stand aside or fade the fade.",
  bestMarketCondition: "Choppy transition zones where beginners call every dip a reversal.",
  timeframes: ["15M", "1H"],
  whenToUse:
    "You see a potential reversal but lack LH/LL confirmation, liquidity, or HTF confluence.",
  whenToAvoid: "Full A+ reversal with all confirmations — don't filter good setups.",
  setupStepExplanations: [
    "Identify the warning swing — LL or HH alone.",
    "Ask: did the opposite swing confirm (LH after LL)?",
    "Check HTF — is the break meaningful or noise?",
    "Look for liquidity sweep — was it a stop hunt?",
    "If confirmations missing → label false reversal risk.",
    "Decision: wait, or trade continuation if structure reclaims.",
    "Never full size on unconfirmed breaks.",
    "Journal every false call — build pattern memory.",
    "Drill in Reversal Academy replay until automatic.",
  ],
  entryLogic: "No entry on unconfirmed breaks — wait or trade continuation reclaim.",
  stopLossLogic: "N/A until full confirmation sequence prints.",
  takeProfitLogic: "If trading reclaim, target prior range boundary.",
  invalidationRules: ["Full confirmation sequence prints — thesis upgrades to real reversal."],
  commonMistakes: [
    "Shorting the first LL in a strong uptrend.",
    "Ignoring that one candle ≠ structure change.",
  ],
  chartExamples: [
    chartEx(
      "false-reversal-filter",
      "fakeout",
      "uptrend",
      "clean",
      "False break — structure holds",
      "One break, no follow-through — the filter saves you."
    ),
  ],
  practiceExercises: [],
  relatedStrategySlugs: ["intraday-reversal", "trend-continuation-behaviour"],
})

export const continuationConfirmationStrategy = buildStrategy({
  id: "continuation-confirmation",
  slug: "continuation-confirmation",
  title: "Continuation Confirmation",
  category: "Market Behaviour",
  difficulty: "beginner",
  summary:
    "Confirm continuation before entry: structure intact, momentum returns, session supports direction.",
  bestMarketCondition: "Established trend with obvious HH/HL or LH/LL and shallow pullback.",
  timeframes: ["15M", "1H"],
  whenToUse: "After pullback completes and price breaks the pullback extreme in trend direction.",
  whenToAvoid: "Late trend, deep pullback, or overlapping swings (range).",
  setupStepExplanations: [
    "Read behaviour: continuation, not reversal.",
    "Verify four-point structure still agrees.",
    "Pullback quality: shallow and orderly beats deep and messy.",
    "Momentum check: are impulse candles returning?",
    "Session check: London/NY for FX, not dead hours.",
    "Entry on break of pullback structure.",
    "Stop beyond invalidation swing.",
    "Target with minimum 1:2 RR.",
    "If any step fails → downgrade to wait.",
  ],
  entryLogic: "Break of pullback high (uptrend) or low (downtrend) with structure intact.",
  stopLossLogic: "Beyond the swing that would break the HL/LH sequence.",
  takeProfitLogic: "Next structural liquidity in trend direction.",
  invalidationRules: ["Structure breaks during setup.", "Momentum fails to follow through."],
  commonMistakes: ["Chasing mid-impulse.", "Skipping pullback quality assessment."],
  chartExamples: [
    chartEx(
      "continuation-confirmation",
      "confirm",
      "uptrend",
      "clean",
      "Pullback complete → break confirms",
      "Confirmation is the green light — not the first green candle."
    ),
  ],
  practiceExercises: [],
  relatedStrategySlugs: ["trend-continuation-behaviour", "false-reversal-filter"],
})
