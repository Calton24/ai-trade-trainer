import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "forex-basics"
const MODULE_ID = "fxb-m4"

/** Module 4 — Economic News: impact tiers, key events, the calendar, and when NOT to trade. */
export const economicNewsModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "Economic News",
  description:
    "High-impact events, the economic calendar, and the professional skill of standing aside.",
  order: 4,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "fxb-m4-news-impact",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "news-impact-tiers",
      title: "News Impact Tiers",
      description: "High, medium, low — what each tier does to a chart.",
      lessonType: "interactive",
      difficulty: "beginner",
      order: 1,
      xpReward: 45,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Not All News Is Equal" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Economic calendars rate events by expected impact. High-impact events (red) can move a pair 50–150 pips in minutes and blow straight through stop losses. Medium (orange) events cause noticeable but usually contained moves. Low (yellow) events barely register. The tier tells you how carefully to treat the release window.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "sort-buckets",
            prompt: "Sort each event into its usual impact tier.",
            buckets: ["High impact", "Medium impact", "Low impact"],
            items: [
              {
                label: "FOMC interest rate decision",
                bucket: "High impact",
                explain: "The Fed sets the price of the world's reserve currency — maximum volatility.",
              },
              {
                label: "NFP (Non-Farm Payrolls)",
                bucket: "High impact",
                explain: "The monthly US jobs report — famous for violent whipsaws.",
              },
              {
                label: "CPI (inflation) release",
                bucket: "High impact",
                explain: "Inflation drives rate expectations — markets reprice instantly.",
              },
              {
                label: "Retail sales",
                bucket: "Medium impact",
                explain: "Meaningful data, usually a contained reaction.",
              },
              {
                label: "Consumer confidence survey",
                bucket: "Medium impact",
                explain: "Moves markets when it surprises, but rarely violently.",
              },
              {
                label: "Housing starts",
                bucket: "Low impact",
                explain: "Niche data — rarely moves majors on its own.",
              },
            ],
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "During high-impact news, spreads widen dramatically and price can 'gap' — jump levels without trading between them. Your stop loss can fill far worse than where you placed it.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Red events move markets violently: rate decisions, NFP, CPI. Check the tier of every event on your pairs before trading.",
        },
      ],
    },
    {
      id: "fxb-m4-key-events",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "the-big-four-events",
      title: "The Big Four Events",
      description: "FOMC, CPI, NFP, and interest rates — what they are and why they matter.",
      lessonType: "reading",
      difficulty: "beginner",
      order: 2,
      xpReward: 45,
      prerequisites: ["fxb-m4-news-impact"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Events Every Trader Tracks" },
        {
          id: "def1",
          type: "definition",
          content:
            "The Federal Reserve's rate-setting meeting (8 per year). The decision, statement, and press conference each can move every USD pair violently.",
          metadata: { term: "FOMC" },
        },
        {
          id: "def2",
          type: "definition",
          content:
            "Consumer Price Index — the main inflation gauge, released monthly. Hot inflation → markets expect higher rates → currency usually strengthens.",
          metadata: { term: "CPI" },
        },
        {
          id: "def3",
          type: "definition",
          content:
            "Non-Farm Payrolls — the monthly US jobs report, first Friday of the month at 13:30 UTC. One of the most volatile scheduled moments in forex.",
          metadata: { term: "NFP" },
        },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Interest rates are the thread connecting all of these. Higher rates make a currency more attractive to hold, attracting capital and strengthening it. That's why inflation data (CPI) and jobs data (NFP) matter — they shape what the central bank (FOMC) does next. News trading is really rate-expectation trading.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "US CPI comes in much hotter than forecast. Markets instantly price higher-for-longer Fed rates: DXY spikes up, EUR/USD drops 80 pips in five minutes, and USD/JPY jumps. One number repriced every dollar pair simultaneously.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "You don't need to predict the number. You need to know WHEN it lands so it can't ambush your open positions.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "FOMC sets rates; CPI and NFP shape rate expectations. All four are red-tier events that every USD trader tracks by default.",
        },
      ],
    },
    {
      id: "fxb-m4-calendar",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "using-the-economic-calendar",
      title: "Using the Economic Calendar",
      description: "The two-minute morning habit that prevents ambushes.",
      lessonType: "reading",
      difficulty: "beginner",
      order: 3,
      xpReward: 40,
      prerequisites: ["fxb-m4-key-events"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Check the Calendar Before the Charts" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Free calendars (like the one on investing.com) list every scheduled release with its time, impact tier, forecast, and previous reading. Professionals check it before opening a single chart: filter to high impact, look at today and tomorrow, and note the times for currencies you trade.",
        },
        {
          id: "checklist1",
          type: "checklist",
          content: "The morning calendar routine:",
          metadata: {
            items: [
              "Open the calendar and filter to high-impact events",
              "Note release times affecting your watchlist currencies",
              "Mark a no-trade buffer around each red event (e.g. 30 min before/after)",
              "Decide now: close, hold, or avoid positions through the release",
              "Re-check tomorrow's events before holding overnight",
            ],
          },
        },
        {
          id: "ex1",
          type: "example",
          content:
            "Your watchlist is EUR/USD and GBP/USD. The calendar shows UK CPI at 07:00 and US NFP at 13:30. Plan: no GBP trades before 07:30, and everything flat or protected by 13:00.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "The forecast matters more than the actual number: markets move on the SURPRISE — the gap between expectation and reality.",
          metadata: { variant: "tip" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Two minutes on the calendar each morning tells you when the market might turn violent. Plan trades around red events, never through them.",
        },
      ],
    },
    {
      id: "fxb-m4-when-not-to-trade",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "when-not-to-trade",
      title: "When NOT to Trade",
      description: "The calendar simulator — trade, wait, or skip around real event schedules.",
      lessonType: "interactive",
      difficulty: "beginner",
      order: 4,
      xpReward: 55,
      prerequisites: ["fxb-m4-calendar"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Standing Aside Is a Position" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "The most underrated forex skill is NOT trading: before red news, during dead sessions, on messy charts, or when your context is unclear. Every skipped bad trade is capital preserved for a good one. Practise the decision below — the exact reasoning professionals run daily.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "decision-scenarios",
            prompt: "It's your trading session. Trade, wait, or skip?",
            scenarios: [
              {
                situation:
                  "09:00 London. Clean EUR/USD uptrend, pullback to support complete. No red news until tomorrow.",
                correct: "Trade",
                coaching:
                  "Everything aligns: session, structure, and a clear calendar. This is what a green light looks like.",
              },
              {
                situation:
                  "13:15 — NFP releases in 15 minutes. GBP/USD has formed a beautiful breakout setup.",
                correct: "Wait",
                coaching:
                  "Never enter minutes before red news — the release will decide the move, not your setup. Re-evaluate after the dust settles.",
              },
              {
                situation:
                  "US CPI just printed far from forecast. Spreads on EUR/USD are 6 pips and candles are 30-pip whipsaws.",
                correct: "Skip",
                coaching:
                  "Post-news chaos with wide spreads is untradeable noise. Professionals let the market pick a direction first.",
              },
              {
                situation:
                  "22:30 — Sydney session. Your EUR/GBP chart is in a 10-pip range and drifting.",
                correct: "Skip",
                coaching:
                  "Dead session + European cross = no liquidity, no movement. There's nothing here to trade.",
              },
              {
                situation:
                  "10:30 London. USD/JPY setup looks decent, but FOMC is tonight and you can't monitor the position.",
                correct: "Skip",
                coaching:
                  "Holding an unmonitored position into FOMC is gambling. If you can't manage the risk window, don't open it.",
              },
            ],
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Score yourself on decision quality, not on trades taken. A day with zero trades and three correct skips is a GOOD trading day.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Skip before red news, in dead sessions, and in post-news chaos. 'No trade' is a complete, professional decision.",
        },
      ],
    },
    {
      id: "fxb-m4-capstone",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "capstone-plan-your-trading-day",
      title: "Capstone: Plan Your Trading Day",
      description: "Combine sessions, pairs, strength, and news into one complete morning plan.",
      lessonType: "interactive",
      difficulty: "beginner",
      order: 5,
      xpReward: 70,
      prerequisites: ["fxb-m4-when-not-to-trade"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Your First Complete Morning Plan" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Scenario: It's 07:45, London opens shortly. DXY has been falling for three days. The calendar shows US CPI at 13:30 and a low-impact eurozone survey at 10:00. Work through the plan a professional would build.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "order-steps",
            prompt: "Put the morning planning steps in the professional order.",
            steps: [
              "Check the economic calendar for today's red events",
              "Check DXY for the dollar's direction",
              "Scan your 5 pairs for trend and clean structure",
              "Build a watchlist of pairs that align with the dollar picture",
              "Set the no-trade window around US CPI at 13:30",
              "Wait for a setup on a watchlist pair — or skip the day",
            ],
          },
        },
        {
          id: "w2",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "watchlist-builder",
            prompt:
              "DXY is falling. CPI hits at 13:30. Build the morning watchlist.",
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
                  "Uptrend agreeing with weak dollar, clean chart, and the morning is clear before CPI — the best candidate.",
              },
              {
                pair: "AUD/USD",
                trend: "up",
                withDxy: true,
                cleanStructure: true,
                newsRisk: false,
                goodPick: true,
                explain:
                  "Also aligned and clean — a valid second pick with less correlation to EUR than GBP has.",
              },
              {
                pair: "USD/CHF",
                trend: "up",
                withDxy: false,
                cleanStructure: true,
                newsRisk: false,
                goodPick: false,
                explain:
                  "USD/CHF rising means dollar strength — that CONTRADICTS the falling DXY. Something is off; skip.",
              },
              {
                pair: "GBP/JPY",
                trend: "messy",
                withDxy: false,
                cleanStructure: false,
                newsRisk: false,
                goodPick: false,
                explain: "Messy chart, no dollar read — fails on structure alone.",
              },
            ],
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "This exact routine — calendar, DXY, scan, watchlist, execute or skip — is the seed of the full professional daily workflow you'll master at the end of the academy.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "safety1",
          type: "safety-note",
          content:
            "Educational simulator only. Not financial advice. Planning skills reduce mistakes; nothing guarantees profits.",
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Calendar → DXY → scan → watchlist → execute or skip. You've just run a professional morning in miniature.",
        },
      ],
    },
    {
      id: "fxb-m4-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "forex-basics-assessment",
      title: "Forex Basics Assessment",
      description: "The path milestone — fundamentals, sessions, pairs, and news together.",
      lessonType: "quiz",
      difficulty: "beginner",
      order: 6,
      xpReward: 80,
      prerequisites: ["fxb-m4-capstone"],
      estimatedMinutes: 0,
      quizId: "forex-basics-assessment",
      contentBlocks: [],
    },
  ],
}
