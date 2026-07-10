import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "forex-basics"
const MODULE_ID = "fxb-m3"

/** Module 3 — Choosing Currency Pairs: specialisation, strength, DXY, correlation. */
export const choosingPairsModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "Choosing Currency Pairs",
  description:
    "Why professionals specialise in a handful of pairs — currency strength, DXY, correlations, and building a focused watchlist.",
  order: 3,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "fxb-m3-specialisation",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "why-professionals-specialise",
      title: "Why Professionals Specialise",
      description: "Five pairs studied deeply beat twenty-eight glanced at.",
      lessonType: "reading",
      difficulty: "beginner",
      order: 1,
      xpReward: 40,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Depth Beats Breadth" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "There are 28 commonly traded pairs, and a beginner's instinct is to watch all of them so they 'don't miss anything'. Professionals do the opposite. They trade a small set — often just 3 to 5 pairs — and know those charts intimately: how they behave in each session, how they react to news, what their normal daily range looks like.",
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Specialisation builds pattern recognition. When you've watched EUR/USD every London session for three months, you FEEL when the day is abnormal. That intuition never develops when your attention is split 28 ways.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "A sensible beginner set: EUR/USD (cleanest, tightest spread), GBP/USD (more volatile, still liquid), USD/JPY (different personality, Asian influence), AUD/USD (commodity currency), and one cross like EUR/GBP. Five personalities — enough variety, little enough to master.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Missing a move on a pair you don't trade costs you nothing. Taking a bad trade on a pair you don't understand costs you money.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Watch few, know them deeply. Three to five majors are plenty. The Professional Forex track later builds a daily filtering system on top of this principle.",
        },
      ],
    },
    {
      id: "fxb-m3-currency-strength",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "currency-strength",
      title: "Currency Strength",
      description: "Pair a strong currency against a weak one — the cleanest trades.",
      lessonType: "interactive",
      difficulty: "beginner",
      order: 2,
      xpReward: 45,
      prerequisites: ["fxb-m3-specialisation"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Strong vs Weak" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Every pair is a tug of war. EUR/USD rises when the euro is stronger than the dollar — but 'stronger' is relative. The cleanest trends appear when you pair the strongest currency on the board against the weakest, because both sides of the pair push the same direction.",
        },
        {
          id: "def1",
          type: "definition",
          content:
            "A measure of how one currency is performing against ALL others at once — not just one pair. If EUR is rising against USD, GBP, JPY and AUD simultaneously, the euro is genuinely strong.",
          metadata: { term: "Currency strength" },
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "decision-scenarios",
            prompt: "Use the strength readings to pick the best decision.",
            options: ["Buy the pair", "Sell the pair", "Skip — no edge"],
            scenarios: [
              {
                situation:
                  "EUR is the strongest currency today; USD is the weakest. You're looking at EUR/USD.",
                correct: "Buy the pair",
                coaching:
                  "Strong base vs weak quote — both forces push EUR/USD up. This is the ideal strength alignment.",
              },
              {
                situation:
                  "GBP is the weakest currency; JPY is the strongest. You're looking at GBP/JPY.",
                correct: "Sell the pair",
                coaching:
                  "Weak base vs strong quote pushes the pair down — selling aligns with both forces.",
              },
              {
                situation:
                  "AUD and NZD are both mid-table with no clear divergence. You're looking at AUD/NZD.",
                correct: "Skip — no edge",
                coaching:
                  "Two average currencies produce a choppy, directionless pair. No strength edge = no trade.",
              },
            ],
          },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Trade strongest against weakest. When both currencies in a pair push the same way, trends are cleaner and pullbacks shallower.",
        },
      ],
    },
    {
      id: "fxb-m3-dxy",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "the-dollar-index",
      title: "The Dollar Index (DXY)",
      description: "One chart that reads the dollar side of every major pair.",
      lessonType: "reading",
      difficulty: "beginner",
      order: 3,
      xpReward: 45,
      prerequisites: ["fxb-m3-currency-strength"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "One Chart for the Dollar" },
        {
          id: "def1",
          type: "definition",
          content:
            "An index measuring the US dollar against a basket of major currencies (heavily weighted to the euro). DXY up = dollar strengthening. DXY down = dollar weakening.",
          metadata: { term: "DXY (Dollar Index)" },
        },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Because every major pair contains USD, the dollar's direction influences all of them at once. DXY rising tends to push EUR/USD, GBP/USD and AUD/USD down (dollar is the quote — strengthening quote lowers the pair) and USD/JPY, USD/CAD and USD/CHF up (dollar is the base).",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "You spot a bullish setup on EUR/USD, but DXY is breaking out upward with momentum. The dollar strengthening is a direct headwind for your long — a professional either skips or demands extra confirmation.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Checking DXY before trading any USD pair takes ten seconds and instantly tells you whether the biggest force in the market agrees with your idea.",
          metadata: { variant: "tip" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "DXY is the dollar's scoreboard. It rises → USD-quote pairs (EUR/USD) fall and USD-base pairs (USD/JPY) rise. Check it before every dollar trade — the professional workflow makes this a daily habit.",
        },
      ],
    },
    {
      id: "fxb-m3-correlation",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "pair-correlations",
      title: "Pair Correlations",
      description: "Positive, negative — and why two trades can secretly be one.",
      lessonType: "interactive",
      difficulty: "beginner",
      order: 4,
      xpReward: 45,
      prerequisites: ["fxb-m3-dxy"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "When Pairs Move Together" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "EUR/USD and GBP/USD usually rise and fall together (positive correlation) — both are European currencies priced in dollars. EUR/USD and USD/CHF usually move in opposite directions (negative correlation) — the dollar sits on opposite sides. Correlation matters for RISK: buying EUR/USD and GBP/USD at the same time isn't two trades, it's roughly one dollar-short position at double size.",
        },
        {
          id: "def1",
          type: "definition",
          content:
            "The tendency of two pairs to move together (positive) or in opposite directions (negative). Driven mostly by shared currencies.",
          metadata: { term: "Correlation" },
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "sort-buckets",
            prompt: "Sort each pair combination by its usual correlation.",
            buckets: ["Positive", "Negative"],
            items: [
              {
                label: "EUR/USD + GBP/USD",
                bucket: "Positive",
                explain: "Both European vs the dollar — they usually move together.",
              },
              {
                label: "EUR/USD + USD/CHF",
                bucket: "Negative",
                explain: "USD flips sides — these classically mirror each other.",
              },
              {
                label: "AUD/USD + NZD/USD",
                bucket: "Positive",
                explain: "Two closely linked Pacific economies vs USD.",
              },
              {
                label: "GBP/USD + USD/JPY",
                bucket: "Negative",
                explain: "Dollar strength pushes these in opposite directions (loosely).",
              },
            ],
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Taking three correlated positions with 1% risk each isn't 3× diversification — it's one 3% bet on the dollar. Correlation is hidden risk concentration.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Correlated pairs are secretly the same trade. Count exposure per CURRENCY, not per pair — a rule the professional track formalises as 'maximum 3 positions'.",
        },
      ],
    },
    {
      id: "fxb-m3-watchlist",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "build-your-first-watchlist",
      title: "Build Your First Watchlist",
      description: "Apply strength, DXY, and structure to rank real candidates.",
      lessonType: "interactive",
      difficulty: "beginner",
      order: 5,
      xpReward: 55,
      prerequisites: ["fxb-m3-correlation"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "From 28 Pairs to a Focused Few" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "A watchlist is a decision, not a bookmark folder. Each morning you ask: which pairs have a clear trend, agreement with the dollar picture, clean structure, and no dangerous news? Pairs that pass go on the list. Everything else is ignored — deliberately.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "watchlist-builder",
            prompt:
              "It's Monday morning. DXY is trending down. Build today's watchlist from these six candidates.",
            maxPicks: 3,
            pairs: [
              {
                pair: "EUR/USD",
                trend: "up",
                withDxy: true,
                cleanStructure: true,
                newsRisk: false,
                goodPick: true,
                explain: "Uptrend + weak dollar agrees + clean structure + no news. A-grade candidate.",
              },
              {
                pair: "GBP/USD",
                trend: "up",
                withDxy: true,
                cleanStructure: true,
                newsRisk: false,
                goodPick: true,
                explain: "Same tailwinds as EUR/USD — but remember they're correlated: together they double dollar exposure.",
              },
              {
                pair: "USD/JPY",
                trend: "down",
                withDxy: true,
                cleanStructure: true,
                newsRisk: false,
                goodPick: true,
                explain: "Dollar weakness pushes USD/JPY down — a clean downtrend that agrees with DXY.",
              },
              {
                pair: "AUD/USD",
                trend: "messy",
                withDxy: true,
                cleanStructure: false,
                newsRisk: false,
                goodPick: false,
                explain: "DXY agrees but the chart is a mess — choppy structure fails the filter regardless of context.",
              },
              {
                pair: "USD/CAD",
                trend: "down",
                withDxy: true,
                cleanStructure: true,
                newsRisk: true,
                goodPick: false,
                explain: "Structure is fine, but high-impact Canadian news today makes the move a coin flip. Skip.",
              },
              {
                pair: "EUR/GBP",
                trend: "range",
                withDxy: false,
                cleanStructure: false,
                newsRisk: false,
                goodPick: false,
                explain: "Rangebound with no strength divergence — no directional edge to trade.",
              },
            ],
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Notice you rejected half the board. A short watchlist isn't a lack of opportunity — it IS the skill.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Filter by trend, dollar agreement, structure, and news. Keep 3–5 pairs maximum, and mind correlation between your picks.",
        },
      ],
    },
    {
      id: "fxb-m3-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "choosing-pairs-check",
      title: "Choosing Pairs Check",
      description: "Test specialisation, strength, DXY, and correlation.",
      lessonType: "quiz",
      difficulty: "beginner",
      order: 6,
      xpReward: 50,
      prerequisites: ["fxb-m3-watchlist"],
      estimatedMinutes: 0,
      quizId: "choosing-pairs-check",
      contentBlocks: [],
    },
  ],
}
