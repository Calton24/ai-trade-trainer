import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "professional-forex"
const MODULE_ID = "pf-m6"

/**
 * Professional Daily Workflow — the interactive operating system module.
 * Students physically run the morning / pre-entry / post-trade checklists
 * and finish with a full simulated trading day capstone.
 */
export const dailyWorkflowModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "The Professional Daily Workflow",
  description:
    "Run the operating system hands-on: morning checklist, pre-entry checklist, post-trade review — then a full simulated trading day.",
  order: 6,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "pf-m6-morning-checklist",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "the-morning-checklist",
      title: "The Morning Checklist",
      description: "Calendar, DXY, strength, direction, phase, session, watchlist — every morning.",
      lessonType: "interactive",
      difficulty: "advanced",
      order: 1,
      xpReward: 60,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Boot the System" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "The morning checklist is the physical act of running Stages 13–16 before any chart tempts you. Professionals complete every item, in order, before considering a single entry. Run it now — ticking each item as if this were your live morning.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "daily-checklist",
            title: "Morning checklist — complete every step",
            items: [
              "Check the economic calendar for today's high-impact events",
              "Read DXY — is the dollar strengthening or weakening?",
              "Scan currency strength — which currencies are strongest and weakest?",
              "Confirm higher-timeframe direction on candidate pairs",
              "Identify the market phase — Phase 1 impulse or Phase 2 pullback?",
              "Confirm the session — is your market's liquidity window open?",
              "Build the watchlist — 4–5 pairs maximum, scored and filtered",
            ],
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Order matters: calendar first (can today even be traded?), context second, watchlist last. Entries are never on this list — they come only after the system is booted.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Seven steps, every morning, before any entry thought. The checklist is Stages 13–16 turned into muscle memory.",
        },
      ],
    },
    {
      id: "pf-m6-pre-entry",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "the-pre-entry-checklist",
      title: "The Pre-Entry Checklist",
      description: "Trend, pullback, structure, risk, entry, stop, target — before every order.",
      lessonType: "interactive",
      difficulty: "advanced",
      order: 2,
      xpReward: 60,
      prerequisites: ["pf-m6-morning-checklist"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Last Gate Before Risk" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "A setup that survived the morning filter must still pass the pre-entry gate. This is the decision engine in checklist form — any unticked item means no trade, no matter how good the chart looks.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "daily-checklist",
            title: "Pre-entry checklist — all seven or no trade",
            items: [
              "Trend confirmed — four agreeing swing points on the trading timeframe",
              "Pullback complete — price reached the zone and is resuming",
              "Structure clean — no messy overlapping chop around the entry",
              "Risk calculated — 1% maximum, position size from the formula",
              "Entry level precise — at the zone, not chasing above it",
              "Stop placed at invalidation — behind structure with a buffer",
              "Target realistic — a level the market actually reaches, 2:1 or better",
            ],
          },
        },
        {
          id: "w2",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "decision-scenarios",
            prompt: "Apply the gate. One item fails — what's the verdict?",
            options: ["Take the trade anyway", "Skip or wait"],
            scenarios: [
              {
                situation:
                  "Six of seven items pass, but the position size needed to fit the structural stop exceeds 1% risk.",
                correct: "Skip or wait",
                coaching:
                  "One failed item = no trade. The gate has no 'mostly passed' output — that's what makes it a gate.",
              },
              {
                situation:
                  "Everything passes except price hasn't quite reached the zone — it's 15 pips above.",
                correct: "Skip or wait",
                coaching:
                  "This is a WAIT: the setup may complete. Chasing 15 pips early converts an A+ entry into a mediocre one with a worse stop.",
              },
              {
                situation: "All seven items pass cleanly.",
                correct: "Take the trade anyway",
                coaching:
                  "When the gate opens, execution should be immediate and mechanical. Hesitating on fully qualified setups is fear, not prudence.",
              },
            ],
          },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Seven items, binary gate. All pass → execute without hesitation. Any fail → skip or wait without exception.",
        },
      ],
    },
    {
      id: "pf-m6-post-trade",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "the-post-trade-review",
      title: "The Post-Trade Review",
      description: "Screenshot, journal, grade, emotional review — closing the loop.",
      lessonType: "interactive",
      difficulty: "advanced",
      order: 3,
      xpReward: 60,
      prerequisites: ["pf-m6-pre-entry"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Close the Loop" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "The trade isn't over when the position closes — it's over when it's reviewed. The post-trade routine converts each trade (and each skip) into training data. Five minutes, every time, win or lose.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "daily-checklist",
            title: "Post-trade checklist",
            items: [
              "Screenshot the chart at entry and at exit",
              "Journal the trade — setup, risk math, and reasoning",
              "Record the emotional state before, during, and after",
              "Note any rule broken — or pressure resisted",
              "Grade the decision A / B / C — independent of the outcome",
              "Log skipped setups from today with their reasons",
            ],
          },
        },
        {
          id: "w2",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "journal-review",
            prompt: "Grade these post-trade entries the way you'd grade your own.",
            entries: [
              {
                summary:
                  "Won +2R on the USD/JPY continuation. Entered at the zone per plan, but I moved my target closer at +1.5R out of nervousness, then it ran to +3R without me.",
                options: ["A-grade", "B-grade — emotional exit", "C-grade"],
                correct: "B-grade — emotional exit",
                explain:
                  "Entry and risk were perfect; the exit was fear overriding the plan. Profitable, but the journal must record the leak or it will grow.",
              },
              {
                summary:
                  "Lost −1R on EUR/USD. Every checklist item passed, stop was at invalidation, size was exact. Felt calm; logged and moved on.",
                options: ["A-grade", "B-grade", "C-grade — it lost"],
                correct: "A-grade",
                explain:
                  "Perfect process, calm execution, honest logging. Outcome was variance. This is exactly what professional losing looks like.",
              },
              {
                summary:
                  "No trades today. Two setups came close but each failed one gate item. Logged both skips with reasons and closed the platform on time.",
                options: ["A-grade", "C-grade — zero pips", "Not gradeable"],
                correct: "A-grade",
                explain:
                  "A zero-trade day with disciplined skips and complete logging is an A-grade professional day. The pip count is irrelevant.",
              },
            ],
          },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Screenshot, journal, emotion, grade — every trade and every skip. The review loop is where screen time becomes skill.",
        },
      ],
    },
    {
      id: "pf-m6-capstone",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "capstone-a-full-trading-day",
      title: "Capstone: A Full Trading Day",
      description: "Run the complete operating system through one simulated day.",
      lessonType: "interactive",
      difficulty: "advanced",
      order: 4,
      xpReward: 90,
      prerequisites: ["pf-m6-post-trade"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Simulated Trading Day" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "It's 07:30 UTC, Tuesday. DXY has been falling for four days. The calendar shows US CPI at 13:30 and nothing else red. Run the whole day — morning system, watchlist, decision engine, trade management, and review.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "order-steps",
            prompt: "07:30 — boot the operating system. Order the morning correctly.",
            steps: [
              "Economic calendar: note CPI at 13:30, plan the no-trade buffer",
              "DXY: confirm the four-day downtrend is intact",
              "Currency strength: EUR and GBP strongest, USD weakest",
              "HTF direction: daily and 4H agree on candidate pairs",
              "Build watchlist: EUR/USD and GBP/USD qualify; correlation noted",
              "Wait for a pre-entry gate to open — or for the day to offer nothing",
            ],
          },
        },
        {
          id: "w2",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "watchlist-builder",
            prompt: "08:00 — DXY falling, CPI at 13:30. Build the watchlist.",
            maxPicks: 2,
            pairs: [
              {
                pair: "EUR/USD",
                trend: "up",
                withDxy: true,
                cleanStructure: true,
                newsRisk: false,
                goodPick: true,
                explain:
                  "Uptrend, weak dollar agrees, clean structure, morning is clear before CPI — the primary candidate.",
              },
              {
                pair: "USD/JPY",
                trend: "down",
                withDxy: true,
                cleanStructure: true,
                newsRisk: false,
                goodPick: true,
                explain:
                  "Falling dollar pushes USD/JPY down — clean downtrend that diversifies away from the EUR/GBP correlation cluster.",
              },
              {
                pair: "GBP/USD",
                trend: "up",
                withDxy: true,
                cleanStructure: false,
                newsRisk: false,
                goodPick: false,
                explain:
                  "Context agrees but the chart is choppy around a month of congestion — structure fails the gate.",
              },
              {
                pair: "EUR/GBP",
                trend: "range",
                withDxy: false,
                cleanStructure: false,
                newsRisk: false,
                goodPick: false,
                explain: "No dollar edge, no trend — nothing to trade.",
              },
            ],
          },
        },
        {
          id: "w3",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "decision-scenarios",
            prompt: "The day unfolds. Run the decision engine.",
            scenarios: [
              {
                situation:
                  "09:40 — EUR/USD completes its pullback into the zone with a rejection candle. All seven pre-entry items pass. Stop 22 pips, size calculated at 1%.",
                correct: "Trade",
                coaching:
                  "Gate open → execute. Entry at the zone, stop behind it, 2:1 target below the CPI window. Mechanical.",
              },
              {
                situation:
                  "12:50 — Your EUR/USD long is +1.4R. CPI lands in 40 minutes. Your plan said 'flat or protected by 13:00'.",
                correct: "Trade",
                coaching:
                  "Follow the plan: take profit or move the stop to lock gains before the release. 'Trade' here means acting on the pre-made plan — letting CPI gamble your +1.4R is the violation.",
              },
              {
                situation:
                  "13:35 — CPI surprised hot. USD/JPY spiked 70 pips with 8-pip spreads. Your watchlist says USD/JPY is a candidate and the move 'looks strong'.",
                correct: "Skip",
                coaching:
                  "Post-news chaos: spreads wide, structure meaningless. The watchlist qualified the PAIR, not this moment. Let it settle.",
              },
              {
                situation:
                  "15:30 — Market has settled. USD/JPY resumed its downtrend and is pulling back toward a clean zone, but hasn't reached it. You're +1.4R on the day.",
                correct: "Wait",
                coaching:
                  "Qualified idea, incomplete location. Set the alert. If it fills the zone with confirmation before your session ends — gate check. If not, the day ends +1.4R with an A grade.",
              },
            ],
          },
        },
        {
          id: "w4",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "daily-checklist",
            title: "16:30 — close the day",
            items: [
              "Screenshot the EUR/USD entry and exit",
              "Journal the trade with risk math and reasoning",
              "Log the USD/JPY skip (post-news chaos) and the wait (zone unfilled)",
              "Record emotional notes — any pull to trade the CPI spike?",
              "Grade the day's decisions A/B/C",
              "Shut the platform — the day is complete",
            ],
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "You just ran the entire academy in one day: context (13), positioning (14), selection (15), watchlist (16), operating system (17), and the workflow (this module). This loop, repeated for months, is the whole job.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "safety1",
          type: "safety-note",
          content:
            "Educational simulator only. Not financial advice. Simulated days simplify reality — live markets add slippage, requotes, and emotional weight that only careful, small-size practice can train.",
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Morning boot → watchlist → gate → execute → manage around news → review. One day, the full system. Repeat until it's boring — boring is the goal.",
        },
      ],
    },
  ],
}
