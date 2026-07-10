import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "professional-forex"
const MODULE_ID = "pf-m4"

/** Stage 16 — Watchlist Building & Pair Selection. Filter markets before trading them. */
export const watchlistModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "Watchlist Building & Pair Selection",
  description:
    "28 pairs is too many. Professionals filter the market down to a handful of quality opportunities before the session starts.",
  order: 4,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "pf-m4-not-every-pair",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "why-professionals-dont-trade-every-pair",
      title: "Why Professionals Don't Trade Every Pair",
      description: "Filter 28 pairs down to 4–5 quality opportunities.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 1,
      xpReward: 55,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Why Professionals Don't Trade Every Pair" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "There are 28 commonly traded major and cross pairs. Watching all of them means analysing none of them properly. Professionals invert the problem: instead of asking 'what does this chart offer?', they ask 'which 4–5 markets deserve my attention today?' — and ignore the rest completely.",
        },
        {
          id: "def-watchlist",
          type: "definition",
          content:
            "A short, deliberately filtered list of markets that pass your context checks for the day. If a pair isn't on the watchlist, it does not get traded — no matter what its chart does intraday.",
          metadata: { term: "Watchlist" },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "The filter is everything you built in Stages 13–15: daily direction, DXY alignment, sentiment, HTF agreement, and a recognisable market type. Most pairs fail. That's the point — the watchlist concentrates your attention on the few markets where the whole system agrees.",
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "Quality of attention beats quantity of markets. Five pairs analysed properly will always outperform twenty-eight pairs glanced at.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "Adding a pair to your list mid-session because it 'suddenly looks good'. The watchlist is built during your morning routine, from context — not from impulse during the day.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Filter the 28 pairs through your context checks each morning and keep only the 4–5 that pass. The watchlist is a commitment device: not on the list, not traded.",
        },
      ],
    },
    {
      id: "pf-m4-continuation-watchlist",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "continuation-watchlist",
      title: "The Continuation Watchlist",
      description: "Finding pairs continuing an established trend.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 2,
      xpReward: 55,
      prerequisites: ["pf-m4-not-every-pair"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Continuation Watchlist" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "The continuation watchlist collects pairs in confirmed trends that are currently offering — or about to offer — a Phase 1 resumption. These are the highest-probability candidates most days, so professionals scan for them first.",
        },
        {
          id: "check1",
          type: "checklist",
          content: "A pair qualifies for the continuation watchlist when:",
          metadata: {
            items: [
              "Daily trend confirmed by four swing points",
              "Daily and 4H agree on direction",
              "Price is in or completing a pullback (Phase 2), not extended",
              "Pullback is approaching a defined zone: EMA 20/50 area or prior structure",
              "DXY and sentiment don't contradict the trade direction",
            ],
          },
        },
        {
          id: "ex1",
          type: "example",
          content:
            "Sunday scan: USDJPY shows HH/HL/HH/HL on the daily, both timeframes bullish, price three candles into an orderly pullback toward the rising EMA 20, and DXY is also bullish (agreement, since USD is the base). USDJPY goes on the continuation watchlist with a note: 'watch for Phase 1 resumption at the EMA zone'.",
        },
        {
          id: "callout-tip",
          type: "callout",
          content:
            "Rank your continuation candidates by cleanliness of structure. The clearest chart — the one a stranger could read — goes to the top of the list.",
          metadata: { variant: "tip" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Continuation candidates are confirmed trends in a healthy pullback approaching a defined zone, with timeframes and the dollar in agreement.",
        },
      ],
    },
    {
      id: "pf-m4-reversal-watchlist",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "reversal-watchlist",
      title: "The Reversal Watchlist",
      description: "Finding pairs showing genuine reversal potential.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 3,
      xpReward: 55,
      prerequisites: ["pf-m4-continuation-watchlist"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Reversal Watchlist" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "The reversal watchlist is shorter and stricter. Reversal setups are rarer and riskier than continuations, so the bar for making this list is deliberately higher — most days it holds one or two names, often zero.",
        },
        {
          id: "check1",
          type: "checklist",
          content: "A pair qualifies for the reversal watchlist when:",
          metadata: {
            items: [
              "The trend is mature and extended — not fresh",
              "Price is at a significant HTF level (weekly/daily zone)",
              "Exhaustion is visible: shrinking candles, rejection wicks, failed pushes",
              "Early warnings are firing: EMA 5/10 crossing, stochastic extreme and turning",
              "You have a defined confirmation you're waiting for (immediate high/low break)",
            ],
          },
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "Reversal watchlist entries are 'watch and wait', never 'act now'. The list records WHERE a reversal could happen; confirmation decides IF you ever trade it.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "Filling your reversal list with every pair that's 'moved a lot'. Extension alone isn't exhaustion — demand the structural evidence, or the list becomes a collection of counter-trend temptations.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Reversal candidates need a mature trend, a significant level, visible exhaustion, and early warnings — and even then they stay in 'watch and wait' until structure confirms.",
        },
      ],
    },
    {
      id: "pf-m4-pair-scoring",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "pair-scoring",
      title: "Pair Scoring",
      description: "Score candidates objectively across six dimensions.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 4,
      xpReward: 60,
      prerequisites: ["pf-m4-reversal-watchlist"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Pair Scoring" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "When several pairs pass your filters, which deserves your risk? Professionals remove the guesswork by scoring each candidate on the same fixed dimensions. Scoring turns 'I like this chart' into a comparable, journal-able number.",
        },
        {
          id: "check1",
          type: "checklist",
          content: "Score each watchlist pair (e.g. 0–2 points each) on:",
          metadata: {
            items: [
              "Daily direction — how clear and confirmed is the bias?",
              "DXY alignment — does the dollar agree with the trade?",
              "Sentiment — does the market mood support this pair's direction?",
              "HTF agreement — are daily and 4H telling the same story?",
              "Strategy fit — does a specific framework cleanly apply right now?",
              "Risk clarity — is there an obvious stop level and a sensible target?",
            ],
          },
        },
        {
          id: "ex1",
          type: "example",
          content:
            "Scoring day: EURUSD scores 8/12 (direction clear, DXY agrees, but the 4H is mid-pullback and the stop would be wide). USDJPY scores 11/12 (everything aligned, tight invalidation at the EMA zone). GBPUSD scores 6/12. USDJPY takes today's focus; EURUSD stays on watch; GBPUSD drops off.",
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "Note the last dimension: risk clarity. A great-looking trade with no obvious stop level is not a great trade — if you can't define where you're wrong, you can't size the position.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "callout-tip",
          type: "callout",
          content:
            "Record the scores in your journal. Over weeks, you'll learn which dimension your losing trades tended to be weakest on — that's your personal leak, found with data.",
          metadata: { variant: "tip" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Score every candidate on direction, DXY, sentiment, HTF agreement, strategy fit, and risk clarity. Trade the highest scores; let low scores fall away without regret.",
        },
      ],
    },
    {
      id: "pf-m4-max-positions",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "maximum-three-positions",
      title: "Maximum 3 Positions",
      description: "Why fewer trades means better decisions.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 5,
      xpReward: 55,
      prerequisites: ["pf-m4-pair-scoring"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Maximum 3 Positions" },
        {
          id: "def-position",
          type: "definition",
          content:
            "An open trade in a market — entry filled, stop and target working. Each position consumes a slice of your risk budget AND a slice of your attention.",
          metadata: { term: "Position" },
        },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Even with a perfect watchlist, there's a final constraint: how many positions can you actually manage well? For a developing trader the honest answer is small. The professional rule this track teaches: never more than 3 positions open at once.",
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Two forces drive the rule. Attention: every open position needs monitoring — at four, five, six positions, management quality collapses exactly when it matters most. Correlation: remember the DXY lesson — long EURUSD, long GBPUSD, and short USDJPY isn't three positions, it's one dollar-weakness bet at triple size.",
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "Fewer trades, better decisions. Your edge lives in the quality of each decision, and decision quality degrades with every simultaneous position you add.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "Opening a fourth position because a 'can't-miss' setup appeared. If your three slots are full, the new setup goes in the journal as a skipped trade — the limit only works if it's absolute.",
          metadata: { variant: "mistake" },
        },
        {
          id: "safety",
          type: "safety-note",
          content:
            "Educational simulator only. Not financial advice. Position limits are a risk-control training rule, not a profitability formula.",
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Cap yourself at 3 open positions, and count correlated trades as one. The limit protects both your risk budget and the attention every position deserves.",
        },
      ],
    },
    {
      id: "pf-m4-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "watchlist-check",
      title: "Watchlist Check",
      description: "Test watchlist building, pair scoring, and position limits.",
      lessonType: "quiz",
      difficulty: "advanced",
      order: 6,
      xpReward: 50,
      prerequisites: ["pf-m4-max-positions"],
      estimatedMinutes: 0,
      quizId: "watchlist-check",
      contentBlocks: [],
    },
  ],
}
