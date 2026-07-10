import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "forex-basics"
const MODULE_ID = "fxb-m2"

/** Module 2 — Trading Sessions: Sydney, Tokyo, London, New York, and overlaps. */
export const tradingSessionsModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "Trading Sessions",
  description:
    "The 24-hour forex clock: when each session opens, which pairs move, and when beginners should trade.",
  order: 2,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "fxb-m2-24-hour-market",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "the-24-hour-market",
      title: "The 24-Hour Market",
      description: "Four sessions follow the sun — and volatility follows the sessions.",
      lessonType: "interactive",
      difficulty: "beginner",
      order: 1,
      xpReward: 45,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Four Sessions Around the Globe" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Forex never sleeps during the week because trading desks hand over around the globe: Sydney opens the week, Tokyo follows, London takes over in the European morning, and New York carries the afternoon. Each session has its own personality — different pairs move, different volumes flow.",
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Sydney (approx. 21:00–06:00 UTC) is quiet — thin liquidity, small ranges. Tokyo (00:00–09:00 UTC) wakes up JPY pairs. London (08:00–17:00 UTC) is the heavyweight: roughly 35% of global volume, and the session where EUR and GBP pairs make their biggest moves. New York (13:00–22:00 UTC) brings US data releases and dollar flows.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: { kind: "session-clock" },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Volatility is fuel. A perfect setup during a dead session often goes nowhere — the same setup during London can run for a hundred pips.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Sydney → Tokyo → London → New York. Each session has its own volume profile and favourite pairs. London is the biggest, and session choice matters as much as setup choice.",
        },
      ],
    },
    {
      id: "fxb-m2-session-pairs",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "which-pairs-move-when",
      title: "Which Pairs Move When",
      description: "Match currencies to their home sessions.",
      lessonType: "interactive",
      difficulty: "beginner",
      order: 2,
      xpReward: 45,
      prerequisites: ["fxb-m2-24-hour-market"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Currencies Move in Their Home Hours" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "A currency is most active when its home financial centre is open — that's when its banks, funds, and businesses transact. The yen moves in Tokyo hours. The euro and pound wake up with London. The dollar dominates the New York session, especially around economic data at 13:30 UTC.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "sort-buckets",
            prompt: "Which session gives each pair its most active hours?",
            buckets: ["Tokyo", "London", "New York"],
            items: [
              { label: "USD/JPY", bucket: "Tokyo", explain: "Yen flows peak in Asian hours (it also moves in NY)." },
              { label: "EUR/USD", bucket: "London", explain: "The euro's home session — although the London–NY overlap is its busiest window." },
              { label: "GBP/USD", bucket: "London", explain: "The pound belongs to London." },
              { label: "AUD/JPY", bucket: "Tokyo", explain: "Both currencies are Asia-Pacific." },
              { label: "USD/CAD", bucket: "New York", explain: "Both economies are North American — data hits in NY hours." },
              { label: "EUR/GBP", bucket: "London", explain: "Two European currencies — London hours." },
            ],
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Trading GBP/USD at 3am UK time and wondering why nothing happens is a classic beginner experience. The pair isn't broken — its market is asleep.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Trade pairs during their home sessions. JPY in Tokyo, EUR/GBP in London, USD/CAD in New York. Activity follows the open financial centres.",
        },
      ],
    },
    {
      id: "fxb-m2-overlaps",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "session-overlaps",
      title: "Session Overlaps",
      description: "The London–New York overlap — the most liquid hours on earth.",
      lessonType: "reading",
      difficulty: "beginner",
      order: 3,
      xpReward: 40,
      prerequisites: ["fxb-m2-session-pairs"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "When Two Sessions Trade at Once" },
        {
          id: "def1",
          type: "definition",
          content:
            "A window when two major sessions are open simultaneously, stacking their liquidity and volatility. London–New York (13:00–17:00 UTC) is the biggest.",
          metadata: { term: "Session overlap" },
        },
        {
          id: "p1",
          type: "paragraph",
          content:
            "During the London–NY overlap both Europe's and America's desks are live. Spreads are tightest, moves are cleanest, and the most volume of the entire day flows through the market. The Tokyo–London handover (08:00–09:00 UTC) matters too: London often pushes back against the Asian range, creating the day's first directional move.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "EUR/USD often spends the Asian session in a 15–20 pip range. When London opens, that range frequently breaks — and when New York joins at 13:00 UTC, US data can extend or violently reverse the London move.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "More volatility cuts both ways: overlaps offer the best moves AND the fastest losses. Volatility rewards preparation, not presence.",
          metadata: { variant: "tip" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Overlaps stack liquidity. London–New York (13:00–17:00 UTC) is the prime window of the trading day; the London open is the second key moment.",
        },
      ],
    },
    {
      id: "fxb-m2-best-session",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "when-should-beginners-trade",
      title: "When Should Beginners Trade?",
      description: "Why London hours are the classroom of choice.",
      lessonType: "interactive",
      difficulty: "beginner",
      order: 4,
      xpReward: 45,
      prerequisites: ["fxb-m2-overlaps"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Pick One Session and Master It" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Beginners don't need to trade all sessions — they need repetition in ONE. The London session is the usual recommendation: huge liquidity, tight spreads on majors, clean technical behaviour, and it overlaps New York for the day's best window. Trading the same hours daily also makes your practice comparable — the market you study today behaves like the one you studied yesterday.",
        },
        {
          id: "checklist1",
          type: "checklist",
          content: "A good beginner session gives you:",
          metadata: {
            items: [
              "High liquidity and tight spreads on major pairs",
              "Enough volatility for setups to actually move",
              "Consistent daily timing so practice compounds",
              "Hours that fit your real life — consistency beats theory",
            ],
          },
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "decision-scenarios",
            prompt: "Pick the better choice for each trader.",
            options: ["London session", "Sydney session", "Whenever there's time"],
            scenarios: [
              {
                situation:
                  "A beginner in the UK can practise 8am–11am daily. Which schedule builds skill fastest?",
                correct: "London session",
                coaching:
                  "Consistent hours in the most liquid session — ideal. The same market context repeats daily, so lessons compound.",
              },
              {
                situation:
                  "A trader wants maximum liquidity and the tightest spreads on EUR/USD. Which fits?",
                correct: "London session",
                coaching:
                  "EUR/USD is most liquid during London, especially in the NY overlap.",
              },
              {
                situation:
                  "A beginner trades randomly — sometimes at 2am, sometimes lunchtime, whenever they're free. What's the actual problem?",
                correct: "Whenever there's time",
                coaching:
                  "Random hours mean random market conditions — practice never compounds because the environment keeps changing. Fixed session first, then flexibility.",
              },
            ],
          },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Choose one session — London if your timezone allows — and show up at the same hours daily. Consistent conditions are what turn practice into skill.",
        },
      ],
    },
    {
      id: "fxb-m2-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "trading-sessions-check",
      title: "Trading Sessions Check",
      description: "Test sessions, overlaps, and pair timing.",
      lessonType: "quiz",
      difficulty: "beginner",
      order: 5,
      xpReward: 50,
      prerequisites: ["fxb-m2-best-session"],
      estimatedMinutes: 0,
      quizId: "trading-sessions-check",
      contentBlocks: [],
    },
  ],
}
