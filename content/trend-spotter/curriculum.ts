import { buildTrendLesson } from "@/content/trend-spotter/lesson-builder"
import type { TrendSpotterLesson, TrendSpotterModule } from "@/lib/trend-spotter/types"

const M1 = "ts-mod-trend-basics"
const M2 = "ts-mod-market-structure"
const M3 = "ts-mod-trend-quality"
const M4 = "ts-mod-reversal-continuation"
const M5 = "ts-mod-trade-or-skip"

const module1Lessons: TrendSpotterLesson[] = [
  buildTrendLesson({
    slug: "what-is-a-trend",
    moduleId: M1,
    title: "What is a Trend?",
    summary: "A trend is the dominant direction price moves over time.",
    explanation:
      "An uptrend means buyers are in control — price makes higher highs and higher lows. A downtrend means sellers dominate with lower highs and lower lows. Spotting trend is step one before any entry plan.",
    whyMatters: "Trading against the dominant trend is how beginners fight the market.",
    commonMistake: "Calling every green candle an uptrend without checking swing structure.",
    chartDemoId: "demo-trend-range",
    relatedExerciseId: "ts-clean-uptrend",
    quizQuestions: [{
      question: "An uptrend is defined by:",
      options: [
        { id: "a", text: "Higher highs and higher lows" },
        { id: "b", text: "Only green candles" },
        { id: "c", text: "One strong day" },
        { id: "d", text: "High volume only" },
      ],
      correctAnswer: "a",
      explanation: "Structure — not color — defines trend.",
    }],
  }),
  buildTrendLesson({
    slug: "uptrend-vs-downtrend",
    moduleId: M1,
    title: "Uptrend vs Downtrend",
    summary: "Learn to tell bullish structure from bearish structure at a glance.",
    explanation:
      "Uptrends show rising swing lows; downtrends show falling swing highs. Compare the most recent swings — not just the last few candles.",
    whyMatters: "Your bias should follow structure, not hope.",
    commonMistake: "Ignoring the last swing break that flipped the trend.",
    chartDemoId: "demo-swing-high-low",
    chartPracticeId: "task-spot-trend",
    relatedExerciseId: "ts-clean-downtrend",
    quizQuestions: [{
      question: "In a downtrend, rallies typically:",
      options: [
        { id: "a", text: "Fail below prior swing highs" },
        { id: "b", text: "Always make new highs" },
        { id: "c", text: "Ignore structure" },
        { id: "d", text: "Guarantee profit" },
      ],
      correctAnswer: "a",
      explanation: "Lower highs confirm sellers in control.",
    }],
  }),
  buildTrendLesson({
    slug: "trend-vs-range",
    moduleId: M1,
    title: "Trend vs Range",
    summary: "Not every chart is trending — many are stuck in a box.",
    explanation:
      "A range has a clear ceiling and floor without sustained new highs or lows. Trend strategies fail in ranges; range strategies fail in strong trends.",
    whyMatters: "Using the wrong playbook for the environment causes random entries.",
    commonMistake: "Forcing trend trades inside a sideways box.",
    chartDemoId: "demo-trend-range",
    relatedExerciseId: "ts-sideways-range",
    quizQuestions: [{
      question: "A ranging market:",
      options: [
        { id: "a", text: "Oscillates between support and resistance" },
        { id: "b", text: "Always trends up" },
        { id: "c", text: "Has no boundaries" },
        { id: "d", text: "Is always tradable" },
      ],
      correctAnswer: "a",
      explanation: "Ranges have defined bounds.",
    }],
  }),
  buildTrendLesson({
    slug: "why-beginners-misread-trends",
    moduleId: M1,
    title: "Why Beginners Misread Trends",
    summary: "Common traps that make charts look trending when they are not.",
    explanation:
      "Beginners zoom too tight, chase one strong candle, or ignore higher-timeframe context. They also confuse pullbacks with reversals and ranges with breakouts.",
    whyMatters: "Misreading trend leads to wrong-side entries and oversized losses.",
    commonMistake: "Zooming to a 1-minute chart and seeing 'trend' in noise.",
    chartDemoId: "demo-chasing-late-entry",
    relatedExerciseId: "ts-choppy-range",
    quizQuestions: [{
      question: "A common misread is:",
      options: [
        { id: "a", text: "Calling noise a trend on a tiny zoom" },
        { id: "b", text: "Marking swing highs and lows" },
        { id: "c", text: "Waiting for confirmation" },
        { id: "d", text: "Skipping messy charts" },
      ],
      correctAnswer: "a",
      explanation: "Context and structure beat single candles.",
    }],
  }),
]

const module2Lessons: TrendSpotterLesson[] = [
  buildTrendLesson({
    slug: "higher-highs-higher-lows",
    moduleId: M2,
    title: "Higher Highs and Higher Lows",
    summary: "The building blocks of bullish market structure.",
    explanation:
      "Each peak should exceed the prior peak (HH) and each valley should exceed the prior valley (HL). When HL breaks, the uptrend is in question.",
    whyMatters: "HH/HL is the simplest objective uptrend test.",
    commonMistake: "Counting HH without verifying the lows are also rising.",
    chartDemoId: "demo-swing-high-low",
    chartPracticeId: "task-mark-swing-high",
    quizQuestions: [{
      question: "An uptrend requires:",
      options: [
        { id: "a", text: "Higher highs AND higher lows" },
        { id: "b", text: "Only higher highs" },
        { id: "c", text: "Flat lows" },
        { id: "d", text: "Random swings" },
      ],
      correctAnswer: "a",
      explanation: "Both sides of structure must rise.",
    }],
  }),
  buildTrendLesson({
    slug: "lower-highs-lower-lows",
    moduleId: M2,
    title: "Lower Highs and Lower Lows",
    summary: "Bearish structure in two simple rules.",
    explanation:
      "Downtrends show lower highs (LH) and lower lows (LL). Rallies are selling opportunities until structure breaks.",
    whyMatters: "Recognizing LH/LL keeps you from buying falling knives.",
    commonMistake: "Buying dips in a clear LH/LL sequence.",
    chartPracticeId: "task-mark-swing-low",
    relatedExerciseId: "ts-clean-downtrend",
    quizQuestions: [{
      question: "Lower highs in a downtrend mean:",
      options: [
        { id: "a", text: "Rallies fail below prior peaks" },
        { id: "b", text: "Buyers are strong" },
        { id: "c", text: "Trend is up" },
        { id: "d", text: "Ignore structure" },
      ],
      correctAnswer: "a",
      explanation: "Failed rallies confirm bearish control.",
    }],
  }),
  buildTrendLesson({
    slug: "swing-highs-and-lows",
    moduleId: M2,
    title: "Swing Highs and Swing Lows",
    summary: "Mark the turning points that define structure.",
    explanation:
      "A swing high is a local peak with lower highs on both sides. A swing low is a valley with higher lows on both sides. These are your map.",
    whyMatters: "You cannot read trend without marking swings.",
    commonMistake: "Marking every tiny wick instead of meaningful turns.",
    chartDemoId: "demo-swing-high-low",
    chartPracticeId: "task-mark-swing-high",
    quizQuestions: [{
      question: "A swing high has:",
      options: [
        { id: "a", text: "Lower highs on both sides" },
        { id: "b", text: "Higher highs on both sides" },
        { id: "c", text: "No wicks" },
        { id: "d", text: "Guaranteed reversal" },
      ],
      correctAnswer: "a",
      explanation: "Swings are local extremes.",
    }],
  }),
  buildTrendLesson({
    slug: "structure-breaks",
    moduleId: M2,
    title: "Structure Breaks",
    summary: "When the trend thesis is invalidated.",
    explanation:
      "In an uptrend, breaking the last higher low shifts bias. In a downtrend, breaking the last lower high can signal a reversal attempt.",
    whyMatters: "Structure breaks tell you the trend may be over.",
    commonMistake: "Holding bullish bias after the last HL is broken.",
    chartPracticeId: "task-mark-breakout",
    relatedExerciseId: "ts-structure-break",
    quizQuestions: [{
      question: "An uptrend is threatened when:",
      options: [
        { id: "a", text: "Price breaks the last higher low" },
        { id: "b", text: "One red candle appears" },
        { id: "c", text: "Volume is low" },
        { id: "d", text: "News is quiet" },
      ],
      correctAnswer: "a",
      explanation: "Lost HL breaks bullish structure.",
    }],
  }),
]

const module3Lessons: TrendSpotterLesson[] = [
  buildTrendLesson({
    slug: "clean-vs-choppy-trend",
    moduleId: M3,
    title: "Clean Trend vs Choppy Trend",
    summary: "Direction alone is not enough — quality matters.",
    explanation:
      "Clean trends have orderly pullbacks and clear swings. Choppy trends overlap and whipsaw — low confidence even if direction is technically correct.",
    whyMatters: "Choppy trends destroy risk/reward with false signals.",
    commonMistake: "Trading weak structure because 'it's still an uptrend'.",
    relatedExerciseId: "ts-weak-uptrend",
    quizQuestions: [{
      question: "A choppy uptrend is often best:",
      options: [
        { id: "a", text: "Skipped until structure cleans up" },
        { id: "b", text: "Traded with max size" },
        { id: "c", text: "Ignored for structure" },
        { id: "d", text: "Always bullish" },
      ],
      correctAnswer: "a",
      explanation: "Quality filters bad environments.",
    }],
  }),
  buildTrendLesson({
    slug: "trend-strength",
    moduleId: M3,
    title: "Trend Strength",
    summary: "How aggressively price moves in one direction.",
    explanation:
      "Strong trends have shallow pullbacks and consistent HH/HL or LH/LL. Weak trends stall and overlap — momentum is fading.",
    whyMatters: "Strength tells you whether pullbacks are buyable or traps.",
    commonMistake: "Equating one spike with a strong trend day.",
    chartDemoId: "demo-bullish-bearish",
    quizQuestions: [{
      question: "Trend strength is shown by:",
      options: [
        { id: "a", text: "Orderly swings and follow-through" },
        { id: "b", text: "One lucky candle" },
        { id: "c", text: "Ignoring lows" },
        { id: "d", text: "Maximum leverage" },
      ],
      correctAnswer: "a",
      explanation: "Consistency beats single moves.",
    }],
  }),
  buildTrendLesson({
    slug: "pullbacks-inside-trends",
    moduleId: M3,
    title: "Pullbacks Inside Trends",
    summary: "Temporary dips are normal — not every red candle is a reversal.",
    explanation:
      "In uptrends, pullbacks retrace to support or prior breakout. They offer lower-risk entries if the trend resumes.",
    whyMatters: "Confusing pullbacks with reversals causes panic exits and missed continuations.",
    commonMistake: "Exiting longs on every small dip in a healthy uptrend.",
    chartDemoId: "demo-break-retest",
    relatedExerciseId: "ts-pullback-uptrend",
    quizQuestions: [{
      question: "A pullback in an uptrend is:",
      options: [
        { id: "a", text: "A temporary dip within rising structure" },
        { id: "b", text: "Always a reversal" },
        { id: "c", text: "A reason to remove stops" },
        { id: "d", text: "Random noise only" },
      ],
      correctAnswer: "a",
      explanation: "Context from HH/HL defines pullbacks.",
    }],
  }),
  buildTrendLesson({
    slug: "when-trend-too-extended",
    moduleId: M3,
    title: "When a Trend Is Too Extended",
    summary: "Late entries chase exhaustion.",
    explanation:
      "After a long run without meaningful pullback, risk/reward worsens. Extended trends often pause, range, or snap back.",
    whyMatters: "Chasing extended moves is a top beginner loss pattern.",
    commonMistake: "Buying the top because 'the trend is strong'.",
    relatedExerciseId: "ts-exhaustion",
    quizQuestions: [{
      question: "An extended trend often:",
      options: [
        { id: "a", text: "Pauses or mean-reverts" },
        { id: "b", text: "Runs forever safely" },
        { id: "c", text: "Needs no stops" },
        { id: "d", text: "Removes all risk" },
      ],
      correctAnswer: "a",
      explanation: "Nothing moves in a straight line forever.",
    }],
  }),
]

const module4Lessons: TrendSpotterLesson[] = [
  buildTrendLesson({
    slug: "continuation-after-pullback",
    moduleId: M4,
    title: "Continuation After Pullback",
    summary: "Trend resumes when buyers or sellers return.",
    explanation:
      "After a controlled pullback, a break back in trend direction with volume often signals continuation — not reversal.",
    whyMatters: "Continuation setups align with dominant flow.",
    commonMistake: "Shorting every pullback in a strong uptrend.",
    chartDemoId: "demo-icc-continuation",
    relatedExerciseId: "ts-continuation-pullback",
    quizQuestions: [{
      question: "Continuation means:",
      options: [
        { id: "a", text: "Trend resumes after a pause" },
        { id: "b", text: "Trend always ends" },
        { id: "c", text: "Ignore structure" },
        { id: "d", text: "Only trade reversals" },
      ],
      correctAnswer: "a",
      explanation: "Pullback then resume is continuation.",
    }],
  }),
  buildTrendLesson({
    slug: "early-reversal-warnings",
    moduleId: M4,
    title: "Early Reversal Warning Signs",
    summary: "Clues that trend may be ending.",
    explanation:
      "Warnings include failed new highs/lows, shrinking momentum, structure breaks, and failed breakouts. One warning is not proof — look for confluence.",
    whyMatters: "Early recognition protects profits and avoids late entries.",
    commonMistake: "Calling reversal on one candle without structure break.",
    chartDemoId: "demo-fakeout",
    relatedExerciseId: "ts-possible-reversal",
    quizQuestions: [{
      question: "A reversal warning includes:",
      options: [
        { id: "a", text: "Failed breakout / structure break" },
        { id: "b", text: "One small wick" },
        { id: "c", text: "Low volume once" },
        { id: "d", text: "Any red candle" },
      ],
      correctAnswer: "a",
      explanation: "Structure failure matters more than color.",
    }],
  }),
  buildTrendLesson({
    slug: "fake-reversals",
    moduleId: M4,
    title: "Fake Reversals",
    summary: "When price looks like it reversed but traps you.",
    explanation:
      "Fake reversals break structure briefly then snap back. They often occur at range edges or after shallow pullbacks.",
    whyMatters: "Fake reversals punish traders who jump early.",
    commonMistake: "Flipping bias on the first counter-trend candle.",
    chartDemoId: "demo-fakeout",
    quizQuestions: [{
      question: "A fake reversal often:",
      options: [
        { id: "a", text: "Fails quickly and rejoins the prior trend" },
        { id: "b", text: "Guarantees a new trend" },
        { id: "c", text: "Needs no confirmation" },
        { id: "d", text: "Removes risk" },
      ],
      correctAnswer: "a",
      explanation: "Wait for follow-through before flipping bias.",
    }],
  }),
  buildTrendLesson({
    slug: "when-to-wait",
    moduleId: M4,
    title: "When To Wait",
    summary: "No edge is better than a forced trade.",
    explanation:
      "Wait when structure is messy, bias is unclear, or confirmation is missing. Patience is a skill — not inactivity.",
    whyMatters: "Professionals skip more charts than they trade.",
    commonMistake: "Trading because you 'need action'.",
    relatedExerciseId: "ts-choppy-range",
    quizQuestions: [{
      question: "You should wait when:",
      options: [
        { id: "a", text: "Structure is unclear or choppy" },
        { id: "b", text: "You feel bored" },
        { id: "c", text: "You lost yesterday" },
        { id: "d", text: "Volume is high" },
      ],
      correctAnswer: "a",
      explanation: "Clarity beats activity.",
    }],
  }),
]

const module5Lessons: TrendSpotterLesson[] = [
  buildTrendLesson({
    slug: "messy-charts",
    moduleId: M5,
    title: "Messy Charts",
    summary: "When price action has no readable story.",
    explanation:
      "Messy charts overlap, whipsaw, and lack clean swings. They are low-quality training grounds for impulsive entries.",
    whyMatters: "Skipping messy charts protects capital and focus.",
    commonMistake: "Forcing trades on charts you cannot explain in one sentence.",
    relatedExerciseId: "ts-choppy-range",
    quizQuestions: [{
      question: "A messy chart is best:",
      options: [
        { id: "a", text: "Skipped" },
        { id: "b", text: "Traded larger" },
        { id: "c", text: "Ignored for risk" },
        { id: "d", text: "Always trending" },
      ],
      correctAnswer: "a",
      explanation: "No clarity = no trade.",
    }],
  }),
  buildTrendLesson({
    slug: "ranging-markets",
    moduleId: M5,
    title: "Ranging Markets",
    summary: "Trade the box boundaries — or wait for the break.",
    explanation:
      "In ranges, fade extremes or wait for a confirmed breakout. Trend-following in the middle of the box often loses.",
    whyMatters: "Range logic differs from trend logic.",
    commonMistake: "Using breakout rules in the middle of a range.",
    chartDemoId: "demo-trend-range",
    relatedExerciseId: "ts-sideways-range",
    quizQuestions: [{
      question: "In a range, mid-box entries are often:",
      options: [
        { id: "a", text: "Low quality without edge" },
        { id: "b", text: "Always best" },
        { id: "c", text: "Guaranteed wins" },
        { id: "d", text: "Required daily" },
      ],
      correctAnswer: "a",
      explanation: "Edges or breakouts — not random mid-range clicks.",
    }],
  }),
  buildTrendLesson({
    slug: "low-confidence-conditions",
    moduleId: M5,
    title: "Low Confidence Conditions",
    summary: "If you cannot explain the chart, do not trade it.",
    explanation:
      "Low confidence comes from mixed signals: weak trend, conflicting timeframes, or post-spike chop.",
    whyMatters: "Confidence rating is a risk filter beginners skip.",
    commonMistake: "Trading despite gut feeling of uncertainty.",
    quizQuestions: [{
      question: "Low confidence means:",
      options: [
        { id: "a", text: "Reduce size or skip" },
        { id: "b", text: "Double size" },
        { id: "c", text: "Remove stops" },
        { id: "d", text: "Ignore rules" },
      ],
      correctAnswer: "a",
      explanation: "Uncertainty is information.",
    }],
  }),
  buildTrendLesson({
    slug: "building-a-trend-bias",
    moduleId: M5,
    title: "Building a Trend Bias",
    summary: "Summarize structure into bullish, bearish, or neutral.",
    explanation:
      "After marking swings, state your bias in one line: 'Higher lows intact — bullish bias' or 'Range between X and Y — neutral'.",
    whyMatters: "A written bias prevents impulsive clicks.",
    commonMistake: "Entering without stating bias and invalidation.",
    chartPracticeId: "task-spot-trend",
    quizQuestions: [{
      question: "A trend bias should be based on:",
      options: [
        { id: "a", text: "Swing structure you can mark" },
        { id: "b", text: "Social media hype" },
        { id: "c", text: "Yesterday's P&L" },
        { id: "d", text: "Random guess" },
      ],
      correctAnswer: "a",
      explanation: "Structure first.",
    }],
  }),
]

export const TREND_SPOTTER_MODULES: TrendSpotterModule[] = [
  { id: M1, slug: "trend-basics", title: "Trend Basics", description: "Read direction before planning trades.", order: 1, lessons: module1Lessons },
  { id: M2, slug: "market-structure", title: "Market Structure", description: "Swings, HH/HL, LH/LL, and breaks.", order: 2, lessons: module2Lessons },
  { id: M3, slug: "trend-quality", title: "Trend Quality", description: "Clean vs choppy, strength, and pullbacks.", order: 3, lessons: module3Lessons },
  { id: M4, slug: "reversal-continuation", title: "Reversal or Continuation", description: "Know when trend pauses vs flips.", order: 4, lessons: module4Lessons },
  { id: M5, slug: "trade-or-skip", title: "Trade or Skip", description: "Messy charts, ranges, and building bias.", order: 5, lessons: module5Lessons },
]

export const ALL_TREND_LESSONS = TREND_SPOTTER_MODULES.flatMap((m) => m.lessons)
