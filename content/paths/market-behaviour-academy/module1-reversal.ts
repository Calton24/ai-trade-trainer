import type { CourseModule } from "@/lib/course/types"
import type { SwingPoint } from "@/lib/course/widgets"

const PATH_ID = "market-behaviour-academy"
const MODULE_ID = "mba-reversal"

const BULLISH: SwingPoint[] = [
  { x: 8, y: 30, type: "low", label: "HL" },
  { x: 22, y: 50, type: "high", label: "HH" },
  { x: 36, y: 40, type: "low", label: "HL" },
  { x: 52, y: 66, type: "high", label: "HH" },
  { x: 68, y: 56, type: "low", label: "HL" },
  { x: 84, y: 82, type: "high", label: "HH" },
]

const EARLY_REVERSAL: SwingPoint[] = [
  { x: 8, y: 30, type: "low", label: "HL" },
  { x: 22, y: 52, type: "high", label: "HH" },
  { x: 38, y: 42, type: "low", label: "HL" },
  { x: 54, y: 64, type: "high", label: "HH" },
  { x: 72, y: 34, type: "low", label: "LL" },
]

export const reversalAcademyModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "Reversal Academy",
  description:
    "Master the highest-value skill in trading: telling pullbacks from real reversals — with replay, execution, and assessment.",
  order: 1,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "mba-what-is-reversal",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "what-is-a-reversal",
      title: "What Actually Is a Reversal?",
      description: "Trend → weakening → potential reversal → confirmed reversal → new trend.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 1,
      xpReward: 50,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        {

          id: "b1",
          type: "heading",
          content: "Reversals are a process — not one candle",
        },
        {

          id: "b2",
          type: "paragraph",
          content:
            "A reversal is never a single red candle. Professionals read a sequence: trend weakens, structure breaks, confirmation prints, then a new trend forms.",
        },
        {

          id: "b3",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "order-steps",
            prompt: "Put the reversal lifecycle in the correct order.",
            steps: [
              "Established trend",
              "Trend weakening",
              "Potential reversal (warning)",
              "Structure break",
              "Confirmed reversal",
              "New trend",
            ],
          },
        },
        {

          id: "b4",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "match-pairs",
            prompt: "Match each phase to what you should do.",
            pairs: [
              { left: "Healthy trend", right: "Trade continuation pullbacks" },
              { left: "First lower low in uptrend", right: "Warning — not confirmation" },
              { left: "LH + LL confirmed", right: "Reversal likely — plan execution" },
              { left: "Messy overlap", right: "No trade — wait" },
            ],
          },
        },
        {

          id: "b5",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "structure-replay",
            prompt: "Replay: classify the trend at the pause point.",
            scenarioKind: "uptrend-reversal",
            seed: "mba-rev-intro",
            pauseIndex: 36,
            task: "classify-trend",
            correctTrend: "Transition",
            explain:
              "Structure is shifting — the latest low broke the higher-low sequence. Transition, not yet a confirmed downtrend.",
          },
        },
      ],
    },
    {
      id: "mba-pullback-vs-reversal",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "pullback-vs-reversal",
      title: "Pullback vs Reversal",
      description: "Two charts look similar — one continues, one reverses.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 2,
      xpReward: 50,
      prerequisites: ["mba-what-is-reversal"],
      estimatedMinutes: 0,
      contentBlocks: [
        {

          id: "b6",
          type: "paragraph",
          content:
            "The most expensive mistake: calling every pullback a reversal. Structure tells you which is which.",
        },
        {

          id: "b7",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "structure-replay",
            prompt: "Chart A — pullback or reversal?",
            scenarioKind: "uptrend",
            seed: "mba-pullback-a",
            pauseIndex: 34,
            task: "predict-continuation",
            options: ["Healthy pullback", "Reversal", "Continuation", "No trade"],
            correct: "Healthy pullback",
            explain: "HH/HL intact — this is a pullback within an uptrend, not a reversal.",
          },
        },
        {

          id: "b8",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "structure-replay",
            prompt: "Chart B — same question, different outcome.",
            scenarioKind: "uptrend-reversal",
            seed: "mba-pullback-b",
            pauseIndex: 36,
            task: "predict-continuation",
            options: ["Healthy pullback", "Reversal", "Continuation", "No trade"],
            correct: "Reversal",
            explain: "The higher-low sequence broke — structure changed. This is reversal territory.",
          },
        },
        {

          id: "b9",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "decision-scenarios",
            prompt: "Which would you trade?",
            options: ["Trade", "Wait", "Skip"],
            scenarios: [
              {
                situation: "Uptrend, HL holds, shallow pullback to structure",
                correct: "Trade",
                coaching: "Continuation setup — structure intact.",
              },
              {
                situation: "Uptrend prints first LL after HH/HL sequence",
                correct: "Wait",
                coaching: "Warning only — need LH/LL confirmation before reversing.",
              },
              {
                situation: "Range with overlapping swings",
                correct: "Skip",
                coaching: "No directional edge.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "mba-four-point-rule",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "four-point-rule",
      title: "The Four Point Rule",
      description: "HH → HL → HH → HL confirms trend. Break the sequence to spot reversal.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 3,
      xpReward: 50,
      prerequisites: ["mba-pullback-vs-reversal"],
      estimatedMinutes: 0,
      contentBlocks: [
        {

          id: "b10",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "swing-labeler",
            prompt: "Label each swing on this uptrend. Watch what happens at the end.",
            points: EARLY_REVERSAL,
            trend: "Transition",
            trendExplain:
              "Four points were bullish until the final LL — that's your reversal warning.",
          },
        },
        {

          id: "b11",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "continuation-predictor",
            prompt: "After one LL in an uptrend — reversal confirmed?",
            points: EARLY_REVERSAL,
            options: ["Yes — reverse now", "Not yet — need LH", "Continuation", "No trade"],
            correct: "Not yet — need LH",
            explain:
              "One lower low is a warning. Professionals wait for a lower high to confirm bearish structure.",
          },
        },
      ],
    },
    {
      id: "mba-structure-break",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "structure-break",
      title: "Structure Break",
      description: "Has structure actually broken? Click the break candle.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 4,
      xpReward: 50,
      prerequisites: ["mba-four-point-rule"],
      estimatedMinutes: 0,
      contentBlocks: [
        {

          id: "b12",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "structure-replay",
            prompt: "Where did structure break? Replay then answer.",
            scenarioKind: "uptrend-reversal",
            seed: "mba-bos-01",
            pauseIndex: 38,
            task: "predict-continuation",
            options: ["No break", "Maybe", "Yes — BOS", "Need more info"],
            correct: "Yes — BOS",
            explain:
              "Break of Structure (BOS): price closed below the prior higher low — bullish structure failed.",
          },
        },
      ],
    },
    {
      id: "mba-continuation-trap",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "continuation-trap",
      title: "Don't Catch Falling Knives",
      description: "Why beginners buy every dip — and lose.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 5,
      xpReward: 50,
      prerequisites: ["mba-structure-break"],
      estimatedMinutes: 0,
      contentBlocks: [
        {

          id: "b13",
          type: "callout",
          content:
            "Professionals don't buy because price is cheap. They buy because structure changed.",
        },
        {

          id: "b14",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "decision-scenarios",
            prompt: "Price is dropping fast. What do you do?",
            options: ["BUY", "SELL", "WAIT", "SKIP"],
            scenarios: [
              {
                situation: "Candle 1: sharp drop — looks cheap",
                correct: "WAIT",
                coaching: "No structure change yet — catching a falling knife.",
              },
              {
                situation: "Candle 2: another drop — surely a bounce?",
                correct: "WAIT",
                coaching: "Still no HL — downtrend intact.",
              },
              {
                situation: "Candle 3: small green candle — reversal?",
                correct: "WAIT",
                coaching: "One green candle ≠ reversal. Need LH/LL sequence break.",
              },
              {
                situation: "Structure finally prints LH + LL — now?",
                correct: "SELL",
                coaching: "Now structure agrees with the direction.",
              },
            ],
          },
        },
        {

          id: "b15",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "structure-replay",
            prompt: "Replay the full trap — watch what happens if you bought early.",
            scenarioKind: "downtrend",
            seed: "mba-knife-01",
            pauseIndex: 30,
            task: "predict-continuation",
            options: ["BUY the dip", "SELL continuation", "WAIT", "SKIP"],
            correct: "SELL continuation",
            explain: "Structure never changed to bullish — every early buy was a loss.",
          },
        },
      ],
    },
    {
      id: "mba-reversal-quality",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "reversal-quality",
      title: "Reversal Quality",
      description: "Not every reversal deserves a trade. Grade every setup A+ to D.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 6,
      xpReward: 50,
      prerequisites: ["mba-continuation-trap"],
      estimatedMinutes: 0,
      contentBlocks: [
        {

          id: "b16",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "sort-buckets",
            prompt: "Sort each setup into the correct quality grade.",
            buckets: ["A+ Institutional", "B Tradeable", "D Skip"],
            items: [
              {
                label: "Clean BOS + retest + HTF level + DXY agrees",
                bucket: "A+ Institutional",
                explain: "Full confluence — institutional quality.",
              },
              {
                label: "Structure break with decent RR, no HTF conflict",
                bucket: "B Tradeable",
                explain: "Tradeable with proper risk.",
              },
              {
                label: "Tiny break against strong daily trend, no confirmation",
                bucket: "D Skip",
                explain: "Counter-trend noise — professionals pass.",
              },
              {
                label: "Liquidity sweep + BOS + London session timing",
                bucket: "A+ Institutional",
                explain: "Session + liquidity + structure = A+.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "mba-institutional",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "institutional-confirmation",
      title: "Institutional Confirmation",
      description: "Daily bias, 4H, DXY, sessions, liquidity — the professional checklist.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 7,
      xpReward: 50,
      prerequisites: ["mba-reversal-quality"],
      estimatedMinutes: 0,
      contentBlocks: [
        {

          id: "b17",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "daily-checklist",
            title: "Reversal Confirmation Checklist",
            items: [
              "Daily trend direction identified",
              "4H structure agrees with trade direction",
              "DXY / correlated pairs support the idea",
              "Liquidity sweep or clear BOS visible",
              "London or New York session active (if intraday)",
              "No high-impact news in next 30 minutes",
              "Minimum 1.5:1 risk-to-reward available",
              "Would skip if any box above is unchecked",
            ],
          },
        },
        {

          id: "b18",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "match-pairs",
            prompt: "Match confirmation tools to what they tell you.",
            pairs: [
              { left: "Daily bias", right: "Higher-timeframe direction filter" },
              { left: "DXY", right: "USD strength context for pairs" },
              { left: "Liquidity sweep", right: "Stops taken before real move" },
              { left: "BOS", right: "Structure officially changed" },
            ],
          },
        },
      ],
    },
    {
      id: "mba-execution-bridge",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "reversal-execution-lab",
      title: "Execution Lab — Reversal Pack",
      description: "Trade reversal scenarios. No reading — execute, replay, review.",
      lessonType: "reading",
      difficulty: "intermediate",
      order: 8,
      xpReward: 30,
      prerequisites: ["mba-institutional"],
      estimatedMinutes: 0,
      contentBlocks: [
        {

          id: "b19",
          type: "heading",
          content: "Time to trade",
        },
        {

          id: "b20",
          type: "paragraph",
          content:
            "Open Execution Lab in Academy Mode. Work through the Reversal Academy scenario pack — 20 curated setups including EOD reversals, false signals, and no-trade charts.",
        },
        {

          id: "b21",
          type: "callout",
          content: "Start with EURUSD scenarios, then challenge yourself with Gold and EOD setups.",
        },
      ],
    },
    {
      id: "mba-reversal-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "reversal-assessment",
      title: "Reversal Academy Assessment",
      description: "20 scenarios. 85% to pass. Prove you can read behaviour.",
      lessonType: "quiz",
      difficulty: "intermediate",
      order: 9,
      xpReward: 150,
      quizId: "reversal-academy-assessment",
      prerequisites: ["mba-execution-bridge"],
      estimatedMinutes: 0,
      contentBlocks: [],
    },
  ],
}
