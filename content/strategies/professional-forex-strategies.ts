import { buildStrategy, chartEx, exercise } from "./strategy-builder"

/**
 * Professional Forex playbooks from the Professional Forex Workflow track
 * (Stages 13–17). Every playbook follows the same five-stage framework:
 * Market Context → Direction → Confirmation → Execution → Management & Review.
 *
 * TODO: The chart engine renders structural candles only (no indicator
 * overlays yet). EMA/Stochastic/Bollinger behaviour is taught via equivalent
 * structural scenarios — swap these for indicator-overlay scenarios once the
 * chart engine supports EMA/oscillator rendering.
 */

export const eodContinuationStrategy = buildStrategy({
  id: "eod-continuation",
  slug: "eod-continuation",
  title: "EOD Continuation",
  category: "Professional Forex",
  difficulty: "advanced",
  summary:
    "End-of-day continuation on the daily chart: a confirmed trend pulls back to the EMA 20/50 zone, then resumes. One decision per day, made at the daily close.",
  bestMarketCondition:
    "A clean daily trend confirmed by four swing points, with EMA 20/50/200 stacked in trend order.",
  timeframes: ["1D"],
  whenToUse:
    "Daily trend confirmed, price completing an orderly pullback into the rising (or falling) EMA 20/50 area, and the daily close showing the trend resuming.",
  whenToAvoid:
    "Choppy or ranging markets — flat, intertwined EMAs mean there is no trend to continue and this playbook is switched off. Also avoid when DXY or sentiment contradict the pair.",
  setupStepExplanations: [
    "Run the full context check first: daily direction, DXY alignment, sentiment. This playbook only activates when all three agree.",
    "Confirm the trend with four swing points (HH/HL/HH/HL or LL/LH/LL/LH) and the EMA 20/50/200 stacked in order on the daily chart.",
    "Wait for a Phase 2 pullback — ideally shallow and orderly (think 3-bar) — reaching the EMA 20/50 zone or prior structure.",
    "Confirmation is a daily close resuming the trend direction out of the pullback zone. No close, no trade.",
    "Theoretical entry is at or after that daily close, in the trend direction.",
    "Stop goes beyond the pullback low/high — the level that proves the continuation failed.",
    "Target the prior daily high/low or the next structural level; hold only while the trend structure stays intact.",
    "Skip if the pullback broke the immediate low/high, if EMAs flattened, or if DXY turned against the pair.",
    "Journal the decision either way — including the context scores that led to it.",
  ],
  setupStepTips: [
    "One look per day at the daily close keeps this playbook calm by design.",
    "Four points confirm a market; two points are a guess.",
    "The pullback is where you prepare — never where you enter.",
  ],
  entryLogic:
    "Enter on the daily close that resumes the trend out of the EMA 20/50 pullback zone.",
  stopLossLogic:
    "Beyond the pullback extreme — if the pullback becomes a structure break, the idea is invalid.",
  takeProfitLogic:
    "Prior daily swing high/low or next structural level; trail behind new swing points if the trend extends.",
  invalidationRules: [
    "Daily close back through the EMA 20/50 zone against the trend.",
    "The immediate low (uptrend) or immediate high (downtrend) breaks.",
    "EMAs flatten and intertwine — the trend regime has ended.",
  ],
  commonMistakes: [
    "Entering mid-pullback instead of waiting for the resuming daily close.",
    "Running the playbook in a range because the last trend was profitable.",
    "Ignoring DXY contradiction because the chart 'looks perfect'.",
  ],
  chartExamples: [
    chartEx(
      "eod-continuation",
      "clean",
      "demo-phase1-phase2",
      "clean",
      "Phase 1 → Phase 2 → continuation",
      "A strong trend leg, an orderly pullback into the zone, then resumption — the exact EOD continuation anatomy."
    ),
    chartEx(
      "eod-continuation",
      "pullback-zone",
      "demo-pullback-support",
      "clean",
      "Pullback into the dynamic zone",
      "Price returns to the zone where buyers previously stepped in — on a live chart the rising EMA 20/50 sits here."
    ),
    chartEx(
      "eod-continuation",
      "no-trend",
      "demo-trend-range",
      "skip",
      "No trend, no continuation",
      "Ranging market: level highs and lows, flat EMAs. This playbook is switched off — skip."
    ),
  ],
  practiceExercises: [
    exercise(
      "eod-continuation",
      "resume",
      "Trade the continuation",
      "task-pullback-continuation",
      "The trend has pulled back into the zone. Place entry, stop below the zone, and target beyond the prior high.",
      "trade",
      "Size the stop from the pullback extreme, not from a number you like."
    ),
    exercise(
      "eod-continuation",
      "skip-range",
      "Trade or skip — ranging market",
      "demo-trend-range",
      "Would the EOD Continuation playbook apply here? Decide trade or skip and explain.",
      "skip",
      "Flat structure means there is no Phase 1 to rejoin — skipping is the playbook working."
    ),
  ],
  flashcardDeckSlug: "professional-forex",
  relatedStrategySlugs: ["momentum-bounce", "trend-pullback", "moving-average-trend"],
  featured: true,
})

export const eodReversalStrategy = buildStrategy({
  id: "eod-reversal",
  slug: "eod-reversal",
  title: "EOD Reversal",
  category: "Professional Forex",
  difficulty: "advanced",
  summary:
    "End-of-day reversal detection on the daily chart: a mature trend shows exhaustion at a significant level, fast EMAs (5/10) cross, and the stochastic turns from an extreme.",
  bestMarketCondition:
    "An extended, mature daily trend arriving at a significant weekly/daily level with visible exhaustion.",
  timeframes: ["1D"],
  whenToUse:
    "When exhaustion signs stack up: shrinking candles into the level, rejection wicks, EMA 5 crossing EMA 10 against the old trend, stochastic at an extreme and turning.",
  whenToAvoid:
    "Fresh or healthy trends, no significant level nearby, or exhaustion without structural confirmation. Reversal trades need STRONGER confirmation than continuations — suspicion is never enough.",
  setupStepExplanations: [
    "Context check as always — but for reversals, also ask whether sentiment is shifting (e.g. risk-off starting to fade).",
    "The trend must be mature and extended into a significant HTF level — weekly zones carry the most weight.",
    "Setup trigger: exhaustion evidence — shrinking bodies, failed pushes, long rejection wicks at the extreme.",
    "Confirmation is twofold: EMA 5/10 cross plus stochastic turning from an extreme, AND the immediate high/low breaking. Indicators warn; structure confirms.",
    "Theoretical entry follows the structural break, on the daily close.",
    "Stop beyond the trend's extreme — the high/low the reversal is calling the top/bottom of.",
    "First target is the nearest opposing structure; reversals often travel to the trend's last acceleration point.",
    "Skip whenever any confirmation element is missing. Most reversal watchlist candidates never become trades.",
    "Journal reversal attempts carefully — win rate is lower, so honest review matters even more.",
  ],
  setupStepTips: [
    "Trends can stay overbought for a long time — extremes alone mean nothing.",
    "The weekly level does the heavy lifting; without it this is just a counter-trend guess.",
    "Advanced playbook: master continuations before attempting reversals.",
  ],
  entryLogic:
    "Enter after the immediate high/low breaks with EMA 5/10 and stochastic already warning — on the daily close, never on the wick.",
  stopLossLogic:
    "Beyond the extreme of the old trend. If price takes that level, there was no reversal.",
  takeProfitLogic:
    "Nearest opposing structure first; scale or trail if the new direction builds its own four-point structure.",
  invalidationRules: [
    "Price closes back beyond the exhaustion extreme.",
    "The 'reversal' fails to build a new immediate high/low in its direction.",
    "Exhaustion resolves into consolidation and the old trend resumes.",
  ],
  commonMistakes: [
    "Shorting 'because it went up too much' — extension is not exhaustion.",
    "Entering on the indicator warning without the structural break.",
    "Refusing to accept invalidation because the reversal thesis felt clever.",
  ],
  chartExamples: [
    chartEx(
      "eod-reversal",
      "rejection",
      "demo-resistance",
      "clean",
      "Exhaustion at a defended level",
      "Repeated failures at the same ceiling — the raw material of a reversal watchlist candidate."
    ),
    chartEx(
      "eod-reversal",
      "fakeout",
      "demo-fakeout",
      "failed",
      "Trap beyond the level",
      "A push beyond the level that snaps back — reversal traders wait for the close, not the poke."
    ),
    chartEx(
      "eod-reversal",
      "healthy-trend",
      "demo-phase1-phase2",
      "skip",
      "Healthy trend — no reversal",
      "Orderly pullbacks in a confirmed trend are Phase 2, not exhaustion. Skip the reversal idea."
    ),
  ],
  practiceExercises: [
    exercise(
      "eod-reversal",
      "skip-healthy",
      "Trade or skip — pullback vs reversal",
      "demo-phase1-phase2",
      "This trend is pulling back. Is it an EOD Reversal candidate? Decide trade or skip.",
      "skip",
      "A shallow Phase 2 in a confirmed trend is continuation material — assume pullback until structure breaks."
    ),
    exercise(
      "eod-reversal",
      "structure-break",
      "Mark the failed break",
      "demo-fakeout",
      "Study the failed push beyond the level. Would you have waited for the close? Decide trade or skip as a reversal entry.",
      "skip",
      "Without a confirmed close and structural break, the reversal has not started — patience is the edge."
    ),
  ],
  flashcardDeckSlug: "professional-forex",
  relatedStrategySlugs: ["advanced-reversal-swing", "reversal", "eod-continuation"],
})

export const momentumBounceStrategy = buildStrategy({
  id: "momentum-bounce",
  slug: "momentum-bounce",
  title: "Momentum Bounce",
  category: "Professional Forex",
  difficulty: "advanced",
  summary:
    "Multi-timeframe continuation: daily trend sets the bias, 4H confirms, and the pullback into the EMA 20/50 momentum zone provides the bounce entry on 4H/30M.",
  bestMarketCondition:
    "A strong, momentum-driven trend where daily and 4H agree and pullbacks stay shallow.",
  timeframes: ["1D", "4H", "30M"],
  whenToUse:
    "Trend confirmed on the daily, 4H in agreement, price pulling back into the rising/falling EMA 20/50 zone with momentum intact.",
  whenToAvoid:
    "Timeframe disagreement (daily vs 4H), deep pullbacks that threaten structure, or dead sessions with no momentum to bounce.",
  setupStepExplanations: [
    "Context check: direction, DXY, sentiment. Momentum trades need the market's tailwind — never fight the day's flow.",
    "Daily sets the bias; the 4H must agree. Disagreement anywhere in the chain means no trade.",
    "Setup trigger: a 3-bar-style pullback on the 4H into the EMA 20/50 zone while the daily trend holds.",
    "Confirmation: a rejection or engulfing reaction at the zone on the 4H or 30M — momentum visibly returning.",
    "Theoretical entry at the bounce reaction on the execution timeframe (30M for precision, 4H for calmer management).",
    "Stop below/above the bounce zone — beyond where the pullback would become structural damage.",
    "Target the prior swing extreme first; momentum legs often extend, so a partial-plus-trail plan fits.",
    "Skip when the pullback is deep, slow, and overlapping — that is fading momentum, not a bounce zone.",
    "Journal which timeframe you executed on and whether it changed your discipline.",
  ],
  setupStepTips: [
    "The 30M is for the trigger only — bias always lives upstairs.",
    "Shallow and fast pullbacks are the healthiest bounce candidates.",
    "One pair, one bounce, one decision — don't chase every wobble.",
  ],
  entryLogic:
    "Enter on the bounce reaction out of the EMA 20/50 zone on the execution timeframe, in the higher-timeframe trend direction.",
  stopLossLogic:
    "Beyond the bounce zone extreme; if the zone truly fails, the momentum thesis is wrong.",
  takeProfitLogic:
    "Prior swing extreme, then trail behind execution-timeframe swings while momentum persists.",
  invalidationRules: [
    "4H closes through the EMA zone against the trend.",
    "Daily and 4H fall out of agreement mid-trade.",
    "The bounce stalls into overlapping candles instead of resuming.",
  ],
  commonMistakes: [
    "Using the 30M chart to justify a trade the daily never supported.",
    "Buying the first touch of the zone without a visible reaction.",
    "Re-entering repeatedly after a failed bounce — one invalidation means stand down.",
  ],
  chartExamples: [
    chartEx(
      "momentum-bounce",
      "bounce",
      "demo-pullback-support",
      "clean",
      "The momentum bounce zone",
      "Pullback into the dynamic support area and a decisive reaction out of it — the playbook's core picture."
    ),
    chartEx(
      "momentum-bounce",
      "flag",
      "demo-bull-flag",
      "clean",
      "Flag variant",
      "A tight flag after a strong pole is the same idea: momentum pausing before continuation."
    ),
    chartEx(
      "momentum-bounce",
      "late",
      "demo-chasing-late-entry",
      "skip",
      "Extended — no bounce left",
      "Price far from the zone with the move already stretched: chasing here is the classic mistake."
    ),
  ],
  practiceExercises: [
    exercise(
      "momentum-bounce",
      "trade-bounce",
      "Trade the bounce",
      "task-pullback-continuation",
      "Price has pulled back into the momentum zone. Place entry, stop beyond the zone, and a target at the prior extreme.",
      "trade",
      "The reaction out of the zone is the trigger — the zone touch alone is not."
    ),
    exercise(
      "momentum-bounce",
      "skip-chase",
      "Trade or skip — extended move",
      "demo-chasing-late-entry",
      "Momentum is up but price is far from any zone. Trade or skip?",
      "skip",
      "No zone, no bounce, no trade — wait for price to come back to your area."
    ),
  ],
  flashcardDeckSlug: "professional-forex",
  relatedStrategySlugs: ["eod-continuation", "bull-flag", "trend-pullback"],
  featured: true,
})

export const advancedReversalSwingStrategy = buildStrategy({
  id: "advanced-reversal-swing",
  slug: "advanced-reversal-swing",
  title: "Advanced Reversal Swing",
  category: "Professional Forex",
  difficulty: "advanced",
  summary:
    "A patient daily-chart swing strategy that positions for full trend reversals using EMA 5/10 crosses, stochastic extremes, and confirmed structure breaks — then holds for the new trend to develop.",
  bestMarketCondition:
    "A long, mature trend terminating at a major weekly level with multi-session exhaustion.",
  timeframes: ["1D"],
  whenToUse:
    "Only when the full evidence stack is present: mature trend, major level, exhaustion, EMA 5/10 cross, stochastic reversal from an extreme, AND a broken immediate high/low.",
  whenToAvoid:
    "This is an advanced playbook — not for beginners. Avoid entirely until you are consistent with continuation trading, and avoid in any trend that hasn't shown structural damage.",
  setupStepExplanations: [
    "Context: reversals often coincide with sentiment regime changes — check whether the macro mood that fuelled the trend is fading.",
    "Identify the major weekly/daily level the trend is dying into. No significant level, no swing reversal.",
    "Trigger: multi-session exhaustion — repeated failed pushes, shrinking ranges, rejection wicks clustering at the extreme.",
    "Confirmation: EMA 5/10 crossed against the old trend, stochastic turned from its extreme, and the immediate structure broken on a daily close.",
    "Theoretical entry after confirmation — often on the first orderly pullback of the NEW direction (its first Phase 2).",
    "Stop beyond the old trend's extreme. This is the widest stop in the track — size down accordingly.",
    "Targets are staged: last acceleration point first, then the major structure across the range. Swings take weeks — patience is the position.",
    "Skip if any layer of evidence is missing, or if you cannot emotionally hold a position for weeks. Both are valid skips.",
    "Review monthly as well as weekly — swing trades live on a slower clock than your daily routine.",
  ],
  setupStepTips: [
    "The entry on the new trend's first pullback is calmer than knife-catching the turn itself.",
    "Wide stop = smaller size. Risk stays ~1% no matter how grand the thesis.",
    "Expect to skip most candidates — genuine trend reversals are rare events.",
  ],
  entryLogic:
    "After full confirmation, enter on the new direction's first orderly pullback — the reversal's own Phase 2.",
  stopLossLogic:
    "Beyond the old trend's terminal extreme; sized down so the wide stop still risks ~1% or less.",
  takeProfitLogic:
    "Staged targets: last acceleration zone, then major opposing structure. Trail behind the new trend's swing points.",
  invalidationRules: [
    "Daily close back beyond the terminal extreme.",
    "The new direction fails to print its own higher low / lower high.",
    "Exhaustion resolves sideways for weeks — thesis stale, capital freed.",
  ],
  commonMistakes: [
    "Attempting this playbook before mastering continuations.",
    "Full-size positions despite the wide stop.",
    "Marrying the reversal thesis after structure disproves it.",
  ],
  chartExamples: [
    chartEx(
      "advanced-reversal-swing",
      "ceiling",
      "demo-resistance",
      "clean",
      "The terminal level",
      "A repeatedly defended ceiling after a long advance — where swing reversals are born."
    ),
    chartEx(
      "advanced-reversal-swing",
      "trap",
      "demo-fakeout",
      "failed",
      "The trap at the top",
      "The final push that fails — late buyers trapped, the first structural crack of the reversal."
    ),
    chartEx(
      "advanced-reversal-swing",
      "continuation-risk",
      "demo-break-retest",
      "skip",
      "When the 'top' breaks properly",
      "If the level breaks and retests cleanly, the trend was continuing — the reversal thesis dies here."
    ),
  ],
  practiceExercises: [
    exercise(
      "advanced-reversal-swing",
      "evidence-check",
      "Trade or skip — evidence stack",
      "demo-resistance",
      "Price is rejecting a major level after a long advance, but structure hasn't broken yet. Trade or skip?",
      "skip",
      "Rejections are the watchlist stage. Without the structural break, the swing reversal has not begun."
    ),
    exercise(
      "advanced-reversal-swing",
      "avoid-trap",
      "Trade or skip — the failed break",
      "demo-fakeout",
      "A push beyond the level just snapped back. As a reversal swing entry, trade or skip right now?",
      "skip",
      "One trap candle is a clue, not confirmation — demand the daily close and the broken immediate low."
    ),
  ],
  flashcardDeckSlug: "professional-forex",
  relatedStrategySlugs: ["eod-reversal", "reversal", "eod-continuation"],
})

export const bollyBreakoutBandStrategy = buildStrategy({
  id: "bolly-breakout-band",
  slug: "bolly-breakout-band",
  title: "Bolly Breakout Band",
  category: "Professional Forex",
  difficulty: "advanced",
  summary:
    "Volatility expansion breakout: Bollinger Bands squeeze during compression, then a decisive close outside the range rides the expansion — on 1H for the setup and 5M for the trigger.",
  bestMarketCondition:
    "A tight, quiet range after a volatile period — bands visibly narrowing, structure coiling.",
  timeframes: ["1H", "5M"],
  whenToUse:
    "When compression is obvious on the 1H (narrowing bands, shrinking ranges) and a decisive candle CLOSES outside the range with expansion following.",
  whenToAvoid:
    "Low-quality breaks: wick-only pokes, breaks against the daily bias, or breaks seconds before high-impact news. False breakouts are this playbook's enemy.",
  setupStepExplanations: [
    "Context still rules: a breakout WITH the daily bias has the market's weight behind it; counter-bias breaks are skip candidates.",
    "Mark the compression range on the 1H — the boundaries the market keeps respecting while the bands squeeze.",
    "Setup trigger: the squeeze reaching an extreme — bands at their narrowest in days, price coiling mid-range.",
    "Confirmation: a decisive 1H close OUTSIDE the boundary with the bands starting to widen. The close is the evidence; the poke is the trap.",
    "Theoretical entry on the confirmed close, or on the 5M retest of the broken boundary for a tighter stop.",
    "Stop back inside the range beyond the broken boundary — if price re-enters convincingly, the breakout failed.",
    "Target a measured move (the range's height projected from the break) or the next HTF structure.",
    "Skip wick-only breaks, counter-bias breaks, and anything within reach of imminent red-folder news.",
    "Journal every breakout AND every fakeout you avoided — skip quality is the stat that makes this playbook profitable.",
  ],
  setupStepTips: [
    "The squeeze is the setup; the expansion is the trade.",
    "The 5M retest entry trades comfort for occasionally missing the move — pick one approach and journal it.",
    "Expansion should be visible immediately — a breakout that crawls is usually failing.",
  ],
  entryLogic:
    "Enter on the decisive close outside the compression range, or on the 5M retest of the broken boundary.",
  stopLossLogic:
    "Inside the range beyond the broken boundary — a convincing re-entry into the range invalidates the expansion thesis.",
  takeProfitLogic:
    "Measured move of the range height, or the next higher-timeframe structure; take partials as expansion delivers.",
  invalidationRules: [
    "Price closes back inside the range after the break.",
    "The break happens on a wick with no closing confirmation.",
    "Bands fail to widen after the break — no expansion arrived.",
  ],
  commonMistakes: [
    "Buying the first band-touch inside the squeeze — touches mean nothing during compression.",
    "Chasing a break that already travelled the measured move.",
    "Trading breakouts into major news releases and calling the whipsaw bad luck.",
  ],
  chartExamples: [
    chartEx(
      "bolly-breakout-band",
      "clean",
      "demo-breakout",
      "clean",
      "The confirmed expansion",
      "Compression, then a decisive close beyond the boundary with follow-through — the playbook's ideal picture."
    ),
    chartEx(
      "bolly-breakout-band",
      "fakeout",
      "demo-fakeout",
      "failed",
      "The false breakout",
      "A poke beyond the boundary that snaps back inside — the trap this playbook is built to avoid."
    ),
    chartEx(
      "bolly-breakout-band",
      "retest",
      "demo-break-retest",
      "clean",
      "The retest entry",
      "The broken boundary holding as new support on the retest — the tighter-stop entry variant."
    ),
  ],
  practiceExercises: [
    exercise(
      "bolly-breakout-band",
      "mark-break",
      "Mark the breakout",
      "task-mark-breakout",
      "Draw the compression boundary, then mark the candle that decisively closes beyond it.",
      "trade",
      "Only the close counts — a wick through the boundary is not a breakout."
    ),
    exercise(
      "bolly-breakout-band",
      "skip-fakeout",
      "Trade or skip — the poke",
      "demo-fakeout",
      "Price just wicked above the range and closed back inside. Trade the breakout or skip?",
      "skip",
      "This is the trap. No closing confirmation means no expansion thesis — skip and wait."
    ),
  ],
  flashcardDeckSlug: "professional-forex",
  relatedStrategySlugs: ["opening-range-breakout", "break-retest", "momentum-bounce"],
})

export const PROFESSIONAL_FOREX_STRATEGIES = [
  eodContinuationStrategy,
  eodReversalStrategy,
  momentumBounceStrategy,
  advancedReversalSwingStrategy,
  bollyBreakoutBandStrategy,
]
