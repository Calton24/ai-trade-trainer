import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "professional-forex"
const MODULE_ID = "pf-m2"

/** Stage 14 — Positioning & Timeframe Agreement. Price must be in the right place before execution. */
export const positioningModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "Positioning & Timeframe Agreement",
  description:
    "Direction alone is not enough — price must be positioned correctly, with higher timeframes in agreement, before any entry.",
  order: 2,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "pf-m2-positioning-first",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "positioning-before-execution",
      title: "Positioning Comes Before Execution",
      description: "A good-looking candle in the wrong place is not a trade.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 1,
      xpReward: 55,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Positioning Comes Before Execution" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Stage 13 answered 'which direction?'. This stage answers the next professional question: 'is price in the right place?'. A bullish engulfing candle means one thing at a daily support level in an uptrend — and something completely different in the middle of nowhere.",
        },
        {
          id: "def-positioning",
          type: "definition",
          content:
            "Where price currently sits relative to structure — support/resistance, trend phase, and moving averages. Correct positioning means price is at a location where your setup historically has an edge.",
          metadata: { term: "Positioning" },
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "Never enter just because a candle looks good. Candles are triggers, not reasons. Location is the reason.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "ex1",
          type: "example",
          content:
            "EURUSD daily bias is bullish and DXY agrees. But price has already rallied for six sessions and sits far above the last higher low, pressing into a weekly resistance zone. Context is right — positioning is wrong. The professional waits for a pullback or skips.",
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "Confusing 'the market is bullish' with 'I should buy right now'. Bias tells you the direction to look; positioning tells you whether now is the moment.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Context first, positioning second, execution last. Price must be at a location with edge — not merely moving in your direction.",
        },
      ],
    },
    {
      id: "pf-m2-htf-agreement",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "higher-timeframe-agreement",
      title: "Higher Timeframe Agreement",
      description: "Daily sets bias, 4H confirms, 1H executes.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 2,
      xpReward: 60,
      prerequisites: ["pf-m2-positioning-first"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Higher Timeframe Agreement" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Professionals use timeframes as a chain of command. The daily chart decides bias. The 4-hour chart must agree with it. And the 1-hour chart? It exists for one job only: timing the execution. It never gets a vote on direction.",
        },
        {
          id: "def-htf",
          type: "definition",
          content:
            "When the daily and 4H charts show the same structural direction. Trades taken with higher-timeframe agreement move with the market's dominant flow instead of against it.",
          metadata: { term: "Higher timeframe (HTF) agreement" },
        },
        {
          id: "check1",
          type: "checklist",
          content: "The timeframe chain of command:",
          metadata: {
            items: [
              "Daily — sets the bias (bullish / bearish / neutral)",
              "4H — must agree with the daily before any trade is considered",
              "1H — execution only: entries, stops, and triggers",
              "Never use the 1H to decide macro direction",
            ],
          },
        },
        {
          id: "ex1",
          type: "example",
          content:
            "Daily GBPUSD: bearish structure, lower highs and lower lows. 4H: also bearish, currently pulling back up toward a broken support. Agreement confirmed — now, and only now, you drop to the 1H to look for a short trigger at that zone.",
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "The classic beginner trap: the 1H looks strongly bullish, so you buy — into a daily downtrend. You just bought a pullback in a falling market. The 1H is a magnifying glass, not a compass.",
          metadata: { variant: "mistake" },
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "If the daily and 4H disagree, there is no trade on that pair today. Disagreement is not a puzzle to solve — it is a skip signal.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Daily decides, 4H confirms, 1H executes. When the chain of command disagrees, professionals stand down.",
        },
      ],
    },
    {
      id: "pf-m2-phase1-phase2",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "phase-1-vs-phase-2",
      title: "Phase 1 vs Phase 2",
      description: "Trade the trend leg, never the pullback.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 3,
      xpReward: 60,
      prerequisites: ["pf-m2-htf-agreement"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Phase 1 vs Phase 2" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Every trend breathes in two phases. Phase 1 is the real move — the impulsive leg in the trend direction. Phase 2 is the pullback — the corrective leg against it. Professionals trade Phase 1 continuations. They never trade Phase 2.",
        },
        {
          id: "def-phase1",
          type: "definition",
          content:
            "The impulsive leg moving WITH the trend direction — strong candles, decisive progress. This is the direction professionals trade.",
          metadata: { term: "Phase 1" },
        },
        {
          id: "def-phase2",
          type: "definition",
          content:
            "The corrective pullback AGAINST the trend — slower, choppier, overlapping candles. Phase 2 is where you prepare, not where you trade.",
          metadata: { term: "Phase 2" },
        },
        {
          id: "demo-phases",
          type: "chart-demo",
          scenarioId: "demo-phase1-phase2",
          content:
            "The strong push up is Phase 1. The slower drift back into the zone is Phase 2. The entry comes when Phase 1 resumes out of the zone — never during the drift itself.",
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "This should feel familiar — it is the same anatomy as the ICC pattern you learned earlier (indication = Phase 1, correction = Phase 2, continuation = the next Phase 1). What's new is the professional rule attached to it: the pullback is information, not opportunity. You use Phase 2 to plan where Phase 1 will resume.",
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "Never trade Phase 2. Trying to catch the pullback means fighting the trend for a few pips with poor odds. Wait for Phase 1 to resume — that is the continuation entry.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "Seeing three red candles in an uptrend and shorting 'the reversal'. Most pullbacks look like reversals while they're happening. Assume Phase 2 until daily structure actually breaks.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Phase 1 is the trend leg — trade it. Phase 2 is the pullback — study it, plan from it, never trade it.",
        },
      ],
    },
    {
      id: "pf-m2-four-point-trend",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "four-point-trend-confirmation",
      title: "Four-Point Trend Confirmation",
      description: "Confirm a trend with four swing points before trusting it.",
      lessonType: "interactive",
      difficulty: "advanced",
      order: 4,
      xpReward: 65,
      prerequisites: ["pf-m2-phase1-phase2"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Four-Point Trend Confirmation" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "How do you know a trend is real and not two lucky candles? Professionals demand four swing points: for an uptrend, higher high → higher low → higher high → higher low. Four points means the market has committed to a direction twice in a row.",
        },
        {
          id: "def-four-point",
          type: "definition",
          content:
            "A trend is only confirmed once four consecutive swing points agree: HH/HL/HH/HL for an uptrend, or LL/LH/LL/LH for a downtrend. Fewer points is a guess, not a trend.",
          metadata: { term: "Four-point trend confirmation" },
        },
        {
          id: "def-immediate",
          type: "definition",
          content:
            "The most recent swing high and swing low on the chart. The immediate low holding above the prior low keeps an uptrend alive; the immediate high breaking below signals trouble.",
          metadata: { term: "Immediate high / immediate low" },
        },
        {
          id: "lab-four-point",
          type: "chart-lab",
          scenarioId: "task-four-point-trend",
          content:
            "Confirm this trend yourself: mark the most recent higher low — the fourth point that keeps the uptrend structure intact.",
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "Track the immediate high and immediate low at all times. They are the trend's heartbeat — when the immediate low breaks in an uptrend, the four-point structure is broken and your bias must be re-examined.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "Calling a trend after one higher high. Two points draw a line; four points confirm a market. Patience here filters out most false trends.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Demand four agreeing swing points before trusting a trend, and monitor the immediate high and low to know the moment that structure breaks.",
        },
      ],
    },
    {
      id: "pf-m2-pullback-ema",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "pullbacks-and-ema-positioning",
      title: "Pullbacks & EMA Positioning",
      description: "The 3-bar pullback and moving averages as dynamic support.",
      lessonType: "interactive",
      difficulty: "advanced",
      order: 5,
      xpReward: 65,
      prerequisites: ["pf-m2-four-point-trend"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Pullbacks & EMA Positioning" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "You know pullbacks are Phase 2. Now let's get specific about what a healthy one looks like. A classic professional reference is the 3-bar pullback: roughly three corrective candles drifting back before the trend resumes. Deeper, longer pullbacks start to threaten the structure itself.",
        },
        {
          id: "def-3bar",
          type: "definition",
          content:
            "A shallow correction of about three candles against the trend. Short and orderly pullbacks show the trend is strong; buyers (or sellers) return quickly.",
          metadata: { term: "3-bar pullback" },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Professionals also watch WHERE pullbacks end: frequently at a moving average. Exponential moving averages (EMAs) — commonly the 20, 50, and 200 — act as dynamic support in uptrends and dynamic resistance in downtrends. Price pulling back to a rising EMA 20 and bouncing is one of the most repeated patterns in trending markets.",
        },
        {
          id: "def-ema",
          type: "definition",
          content:
            "A moving average that weights recent prices more heavily. The EMA 20 tracks the short-term trend, the EMA 50 the medium-term, and the EMA 200 the long-term. Trending markets often pull back to these lines and continue.",
          metadata: { term: "EMA (Exponential Moving Average)" },
        },
        {
          id: "demo-pullback",
          type: "chart-demo",
          scenarioId: "demo-pullback-support",
          content:
            "Price pulls back to a zone where buyers previously stepped in, then continues. In a live chart, a rising EMA 20/50 often sits exactly in this zone — the bounce is the same behaviour with a dynamic level instead of a fixed one.",
        },
        {
          id: "lab-pullback",
          type: "chart-lab",
          scenarioId: "task-pullback-continuation",
          content:
            "Practice the execution: after the pullback ends, place an entry with a stop below the bounce zone and a target beyond the prior high.",
        },
        {
          id: "callout-tip",
          type: "callout",
          content:
            "Our practice charts currently show structure without indicator overlays, so EMA behaviour is taught through equivalent structural zones. On your own platform, add EMA 20/50/200 to a trending daily chart and watch how often pullbacks respect them.",
          metadata: { variant: "tip" },
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "The EMA bounce is execution context, not a signal by itself. It only matters when Stage 13's context and this stage's structure already agree.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Healthy pullbacks are shallow (think 3 bars) and often end at moving averages. EMA positioning tells you where a Phase 1 continuation is likely to launch.",
        },
      ],
    },
    {
      id: "pf-m2-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "positioning-check",
      title: "Positioning Check",
      description: "Test timeframe agreement, phases, and trend confirmation.",
      lessonType: "quiz",
      difficulty: "advanced",
      order: 6,
      xpReward: 50,
      prerequisites: ["pf-m2-pullback-ema"],
      estimatedMinutes: 0,
      quizId: "positioning-check",
      contentBlocks: [],
    },
  ],
}
