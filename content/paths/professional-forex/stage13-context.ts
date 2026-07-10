import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "professional-forex"
const MODULE_ID = "pf-m1"

/** Stage 13 — Market Context & Bias. Professional trading starts with context, not entries. */
export const marketContextModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "Market Context & Bias",
  description:
    "Professional trading starts with market context — direction, the dollar, and sentiment — before any entry is considered.",
  order: 1,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "pf-m1-market-context",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "what-is-market-context",
      title: "What Is Market Context?",
      description: "Every strategy only works in the correct context.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 1,
      xpReward: 55,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "What Is Market Context?" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "You've learned setups: break and retest, ICC, support bounces. Professionals know something beginners don't — a perfect-looking setup in the wrong market is still a bad trade. Context is the environment your setup lives in: the overall direction, what the dollar is doing, and the mood of the market that day.",
        },
        {
          id: "def-context",
          type: "definition",
          content:
            "The combination of higher-timeframe direction, related-market behaviour, and current sentiment that determines whether a setup is worth taking today.",
          metadata: { term: "Market context" },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Beginners open a chart and hunt for entries. Professionals do the opposite: they build a view of the market first, then ask which charts — if any — offer a setup that agrees with that view. Context comes before entries, every single day.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "Two traders see the same bullish break and retest on EURUSD. Trader A takes it immediately. Trader B checks first: the daily chart is in a downtrend, the dollar is strengthening, and sentiment is risk-off. Trader B skips. The setup was identical — the context made it a low-probability trade.",
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "A strategy is not good or bad on its own. It is good or bad *for the market in front of you*. Context decides.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "Applying a memorised setup to every chart regardless of environment. This is the single most common reason technically 'correct' entries lose.",
          metadata: { variant: "mistake" },
        },
        {
          id: "safety",
          type: "safety-note",
          content:
            "Educational simulator only. Not financial advice. Nothing in this track promises profits — it teaches a decision process.",
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Context is the environment around a setup. Professionals analyse the market before looking for entries. From this stage onward, every trade decision starts with the question: what market do I have today?",
        },
      ],
    },
    {
      id: "pf-m1-daily-direction",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "daily-direction",
      title: "Daily Direction",
      description: "The daily chart determines bias — bullish, bearish, or neutral.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 2,
      xpReward: 55,
      prerequisites: ["pf-m1-market-context"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Daily Direction" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Direction is the first context question: is this market bullish, bearish, or neutral? Professionals answer it on the daily chart — not the 15-minute chart. Lower timeframes show noise inside the bigger move; the daily chart shows the move itself.",
        },
        {
          id: "def-bias",
          type: "definition",
          content:
            "Your working assumption about which side of the market you will favour today — long, short, or stand aside — decided on the daily timeframe.",
          metadata: { term: "Daily bias" },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "You already know how to read structure: higher highs and higher lows mean bullish, lower highs and lower lows mean bearish, overlapping swings mean neutral. What changes at the professional level is discipline about *where* you read it. If the daily structure is bearish, intraday long setups are counter-trend trades — possible, but lower probability and not for this stage of your development.",
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "Do not use the 1-hour or 15-minute chart to decide overall direction. Lower timeframes are for execution, never for bias.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "ex1",
          type: "example",
          content:
            "Gold has printed three consecutive daily higher lows and closed above the prior week's high. Daily bias: bullish. Today you will only consider long setups on gold — or no trade at all if nothing clean appears.",
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "Flipping bias mid-session because a 15-minute candle went against you. Bias is set on the daily chart and only changes when daily structure changes.",
          metadata: { variant: "mistake" },
        },
        {
          id: "check1",
          type: "checklist",
          content: "Before moving on, make sure you can:",
          metadata: {
            items: [
              "State a market's bias from its daily chart in one sentence",
              "Explain why lower timeframes must not set direction",
              "Accept 'neutral — no bias' as a valid answer",
            ],
          },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Daily direction is decided on the daily chart using the structure skills you already have. Bullish, bearish, or neutral — and neutral means you need a very good reason to trade at all.",
        },
      ],
    },
    {
      id: "pf-m1-dxy",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "dxy-dollar-strength",
      title: "DXY & Dollar Strength",
      description: "The Dollar Index confirms or contradicts your forex bias.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 3,
      xpReward: 60,
      prerequisites: ["pf-m1-daily-direction"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "DXY & Dollar Strength" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Almost every major forex pair has the US dollar on one side. That means one chart — the Dollar Index — influences nearly everything you trade. Professionals check DXY before they check any pair.",
        },
        {
          id: "def-dxy",
          type: "definition",
          content:
            "An index measuring the US dollar's value against a basket of major currencies (euro, yen, pound, and others). Rising DXY = dollar strengthening; falling DXY = dollar weakening.",
          metadata: { term: "DXY (Dollar Index)" },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "The relationships follow from which side of the pair the dollar sits on. EURUSD and GBPUSD have the dollar as the second (quote) currency — a strong dollar pushes them DOWN. USDJPY has the dollar first — a strong dollar pushes it UP. Gold (XAUUSD) is priced in dollars and tends to move inversely to dollar strength.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "DXY is breaking out of a range to the upside on the daily chart. Your EURUSD chart shows a tempting long setup. These two views disagree — a strengthening dollar is a headwind for EURUSD longs. A professional either skips the trade or demands much stronger confirmation.",
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "Use DXY as a confirmation filter: when DXY agrees with your pair's setup, confidence rises. When it contradicts, that is a reason not to trade.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "callout-tip",
          type: "callout",
          content:
            "When to ignore DXY: pairs without the dollar (EURGBP, EURJPY) respond to it only indirectly, and during ranging, newsless sessions the correlation weakens. DXY is a filter, not a signal generator.",
          metadata: { variant: "tip" },
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "Trading EURUSD and GBPUSD longs at the same time as a USDJPY short and calling it three trades. All three are the same bet: dollar weakness. That is one position taken three times.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "DXY is the dollar's own chart. Check its daily direction before trading any dollar pair: it should confirm your bias, and when it contradicts, skipping is the professional choice.",
        },
      ],
    },
    {
      id: "pf-m1-sentiment",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "market-sentiment",
      title: "Market Sentiment",
      description: "Risk-on vs risk-off — the mood that moves currencies.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 4,
      xpReward: 55,
      prerequisites: ["pf-m1-dxy"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Market Sentiment" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Charts tell you what price did. Sentiment tells you what the market is feeling — and feelings decide which currencies get bought and which get sold. The simplest sentiment model is risk-on versus risk-off.",
        },
        {
          id: "def-risk-on",
          type: "definition",
          content:
            "A market mood where investors are confident and seek returns — money flows into growth-linked currencies (AUD, NZD, GBP) and out of safe havens.",
          metadata: { term: "Risk-on" },
        },
        {
          id: "def-risk-off",
          type: "definition",
          content:
            "A market mood where investors are fearful and seek safety — money flows into safe havens (USD, JPY, CHF) and out of riskier assets.",
          metadata: { term: "Risk-off" },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Sentiment also shows up as currency strength and weakness: on any day, some currencies are being bought across the board while others are being sold. The cleanest trades pair a strong currency against a weak one — the two forces push the same direction.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "A risk-off day: equity markets falling, yen strengthening across every pair, AUD weak everywhere. AUDJPY pairs the day's weakest currency against its strongest — if the daily structure agrees, that alignment is far stronger than a setup on a randomly chosen pair.",
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "News is the event; sentiment is the market's reaction. The same headline can produce opposite reactions in different moods — trade the reaction you can see, not the headline you expected.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "callout-tip",
          type: "callout",
          content:
            "Check an economic calendar every morning. High-impact releases (rate decisions, inflation, employment data) can flip sentiment in minutes — many professionals simply stand aside around them.",
          metadata: { variant: "tip" },
        },
        {
          id: "safety",
          type: "safety-note",
          content:
            "Educational simulator only. Not financial advice. Sentiment analysis improves decision quality; it does not predict outcomes.",
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Sentiment is the market's mood: risk-on favours growth currencies, risk-off favours safe havens. Combine it with direction and DXY, and you have the three pillars of daily context.",
        },
      ],
    },
    {
      id: "pf-m1-context-checklist",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "context-checklist",
      title: "The Context Checklist",
      description: "Turn context into a repeatable pre-market routine.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 5,
      xpReward: 55,
      prerequisites: ["pf-m1-sentiment"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Context Checklist" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Context only works if you check it the same way every day. This checklist is the first half of the professional workflow you'll complete in Stage 17 — run it before you look at a single entry.",
        },
        {
          id: "check1",
          type: "checklist",
          content: "The daily context checklist:",
          metadata: {
            items: [
              "Direction — what is the daily bias on the markets I follow?",
              "DXY — is the dollar strengthening, weakening, or ranging?",
              "Sentiment — is today risk-on, risk-off, or unclear?",
              "Market condition — trending, ranging, or messy?",
              "Reasons NOT to trade — news events, unclear structure, conflicting signals",
            ],
          },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Notice the last item. Professionals actively hunt for reasons to stay out. If direction, DXY, and sentiment disagree with each other, the correct output of the checklist is 'no trade today' — and that output counts as a successfully completed process.",
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "A no-trade day decided by your checklist is a win. A profitable trade taken against your checklist is a loss of discipline that will cost you later.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "ex1",
          type: "example",
          content:
            "Morning check: EURUSD daily bias bearish. DXY bullish (agrees). Sentiment risk-off, dollar strong (agrees). Condition: trending. No major news for 4 hours. All five items align — today you look for EURUSD short setups, and only short setups.",
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "Running the checklist, getting a conflicted answer, and trading anyway because you 'feel' it. The checklist exists precisely to overrule that feeling.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Direction, DXY, sentiment, condition, reasons to skip — five questions before any entry. This checklist becomes the opening step of your daily operating system in Stage 17.",
        },
      ],
    },
    {
      id: "pf-m1-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "market-context-check",
      title: "Market Context Check",
      description: "Test your understanding of context, direction, DXY, and sentiment.",
      lessonType: "quiz",
      difficulty: "advanced",
      order: 6,
      xpReward: 50,
      prerequisites: ["pf-m1-context-checklist"],
      estimatedMinutes: 0,
      quizId: "market-context-check",
      contentBlocks: [],
    },
  ],
}
