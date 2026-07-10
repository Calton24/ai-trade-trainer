import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "risk-management"
const MODULE_ID = "rm-m3"

/** Module 3 — Stop Loss Placement: logical stops at invalidation, structure, and ATR. */
export const stopLossModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "Stop Loss Placement",
  description:
    "Stops belong where the trade idea is proven wrong — behind structure, beyond the noise.",
  order: 3,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "rm-m3-logical-stops",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "logical-stops",
      title: "Logical Stops & Invalidation",
      description: "The stop marks where your idea is wrong — not how much you'd like to lose.",
      lessonType: "reading",
      difficulty: "intermediate",
      order: 1,
      xpReward: 45,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Stops Answer One Question" },
        {
          id: "def1",
          type: "definition",
          content:
            "The price level at which your trade idea is objectively wrong. For a support bounce: below the support zone. For a breakout: back inside the broken range. The stop belongs at invalidation — nowhere else.",
          metadata: { term: "Invalidation point" },
        },
        {
          id: "p1",
          type: "paragraph",
          content:
            "A stop placed at 'the amount I'm comfortable losing' is an emotional stop — the market doesn't know or care about your comfort. A logical stop sits where the chart says the idea failed. If that distance is too expensive for your risk limit, the answer is a smaller position or no trade — never a tighter, arbitrary stop.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "You buy a support bounce at 1.0850 with the zone bottom at 1.0835. Logical stop: ~1.0830 (below the zone plus a small buffer). Placing it at 1.0845 instead 'to risk less' means normal wiggle inside the zone stops you out — and then the bounce happens without you.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Stopped out at a logical level = the idea was wrong (good — small loss). Stopped out inside the noise = the STOP was wrong (bad — unnecessary loss).",
          metadata: { variant: "key-idea" },
        },
        {
          id: "callout2",
          type: "callout",
          content:
            "Moving a stop further away once price approaches it converts a small planned loss into an unplanned disaster. The stop moves only ONE direction: toward profit.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Stop = invalidation point + small buffer. If the logical stop makes the position too expensive, reduce size or skip — never shrink the stop.",
        },
      ],
    },
    {
      id: "rm-m3-structure-stops",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "stops-behind-structure",
      title: "Stops Behind Structure",
      description: "Swing highs, swing lows, and zones — where stops actually belong.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 2,
      xpReward: 55,
      prerequisites: ["rm-m3-logical-stops"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Structure Is Your Shield" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "The market defends structure: swing lows in uptrends, swing highs in downtrends, and the far side of supply/demand zones. Placing your stop just beyond the relevant structure means price must BREAK the structure — genuinely invalidating your idea — to take you out.",
        },
        {
          id: "checklist1",
          type: "checklist",
          content: "Structure stop placement rules:",
          metadata: {
            items: [
              "Long at support → stop below the zone's far edge, not inside it",
              "Long in an uptrend → stop below the most recent higher low",
              "Short at resistance → stop above the zone's far edge",
              "Short in a downtrend → stop above the most recent lower high",
              "Always add a small buffer — levels get wicked by a few pips routinely",
            ],
          },
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "decision-scenarios",
            prompt: "Pick the correct stop placement for each trade.",
            options: [
              "Below the recent higher low",
              "Above the recent lower high",
              "A fixed 10 pips from entry",
            ],
            scenarios: [
              {
                situation:
                  "You buy an uptrend pullback at the trendline. Where does the stop belong?",
                correct: "Below the recent higher low",
                coaching:
                  "If the higher low breaks, the uptrend structure is broken — the idea is genuinely invalid.",
              },
              {
                situation:
                  "You short a lower-high rejection in a downtrend. Where does the stop belong?",
                correct: "Above the recent lower high",
                coaching:
                  "A break above the lower high would end the downtrend sequence — that's the invalidation.",
              },
              {
                situation:
                  "Your platform defaults to 10-pip stops and you're tempted to keep it. What's the problem?",
                correct: "A fixed 10 pips from entry",
                coaching:
                  "Fixed distances ignore the chart. Sometimes 10 pips is inside pure noise; sometimes it's needlessly far. Structure decides, not defaults.",
              },
            ],
          },
        },
        {
          id: "chart1",
          type: "chart-demo",
          content: "Notice how the pullback zone holds — a stop below the zone survives the retest; a stop inside it dies before the move.",
          scenarioId: "demo-pullback-support",
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Stops live just beyond the structure that defines your trade: higher lows for longs, lower highs for shorts, zone edges for level trades.",
        },
      ],
    },
    {
      id: "rm-m3-atr",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "volatility-and-atr",
      title: "Volatility & ATR",
      description: "Give the trade room to breathe — size stops to current volatility.",
      lessonType: "reading",
      difficulty: "intermediate",
      order: 3,
      xpReward: 45,
      prerequisites: ["rm-m3-structure-stops"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Market's Breathing Room" },
        {
          id: "def1",
          type: "definition",
          content:
            "Average True Range — a measure of how far price typically moves per candle over a lookback period (commonly 14). It quantifies current volatility in pips.",
          metadata: { term: "ATR" },
        },
        {
          id: "p1",
          type: "paragraph",
          content:
            "A stop that ignores volatility fights the market's natural rhythm. If EUR/USD's hourly ATR is 15 pips, a 10-pip stop sits INSIDE normal candle movement — you'll be stopped by noise, not by being wrong. Many professionals sanity-check stops against ATR: a common guide is at least 1× ATR of the entry timeframe, adjusted to sit behind structure.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "Quiet summer market: hourly ATR 8 pips → a 12-pip structural stop is fine. News-heavy week: ATR 25 pips → the same 12-pip stop is a donation. Same pair, same setup — volatility changed the correct stop, and the formula changed the correct size.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Volatility expands and contracts constantly. The stop that worked last month may be inside the noise this month — check ATR when markets feel 'different'.",
          metadata: { variant: "tip" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "ATR measures the market's normal noise. Keep stops outside it — behind structure AND beyond typical candle range — and let position size absorb the difference.",
        },
      ],
    },
    {
      id: "rm-m3-drill",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "stop-placement-drill",
      title: "Stop Placement Drill",
      description: "Place entry, stop, and target on a live chart — the system grades you.",
      lessonType: "chart-drill",
      difficulty: "intermediate",
      order: 4,
      xpReward: 60,
      prerequisites: ["rm-m3-atr"],
      estimatedMinutes: 0,
      drillId: "rm-entry-stop-target",
      contentBlocks: [
        {
          id: "p1",
          type: "paragraph",
          content:
            "Apply everything: find the invalidation, put the stop behind structure with a buffer, and set a target that justifies the risk.",
        },
        {
          id: "chart1",
          type: "chart-lab",
          content: "Place your entry, stop loss, and take profit.",
          scenarioId: "task-risk-reward",
        },
      ],
    },
    {
      id: "rm-m3-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "stop-loss-check",
      title: "Stop Loss Check",
      description: "Test invalidation, structure stops, and ATR.",
      lessonType: "quiz",
      difficulty: "intermediate",
      order: 5,
      xpReward: 50,
      prerequisites: ["rm-m3-drill"],
      estimatedMinutes: 0,
      quizId: "stop-loss-check",
      contentBlocks: [],
    },
  ],
}
