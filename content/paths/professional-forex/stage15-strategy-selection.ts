import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "professional-forex"
const MODULE_ID = "pf-m3"

/** Stage 15 — Professional Strategy Selection. Classify the market first, then choose the strategy. */
export const strategySelectionModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "Professional Strategy Selection",
  description:
    "Professionals don't collect strategies — they classify the market first, then select the framework that fits, or skip.",
  order: 3,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "pf-m3-selection-not-collecting",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "strategy-selection-not-collecting",
      title: "Strategy Selection Is Not Strategy Collecting",
      description: "Classify the market first. Then choose the strategy.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 1,
      xpReward: 60,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Strategy Selection Is Not Strategy Collecting" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Beginners collect strategies like trading cards, hoping the next one is 'the one'. Professionals own a small set of frameworks and ask a completely different question each morning: what kind of market do I have today? The market type selects the strategy — never the other way around.",
        },
        {
          id: "def-classification",
          type: "definition",
          content:
            "Deciding which regime the market is in — trending (continuation), turning (reversal), compressing (breakout), or unclear (no trade) — before considering any setup.",
          metadata: { term: "Market classification" },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "This is why every strategy 'stops working': it was never universal. A continuation strategy in a ranging market bleeds losses. A breakout strategy in a quiet market buys fakeouts. The strategy didn't break — it was applied to the wrong market type.",
        },
        {
          id: "check1",
          type: "checklist",
          content: "The professional selection sequence:",
          metadata: {
            items: [
              "Classify: trending, reversing, compressing, or unclear?",
              "Trending → continuation framework",
              "Turning with exhaustion → reversal framework",
              "Compressing after quiet → breakout framework",
              "Unclear → no trade. That is a complete, valid answer.",
            ],
          },
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "Learn how professionals THINK, not another list of setups. One classification skill beats twenty memorised strategies.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "First classify the market — continuation, reversal, breakout, or no trade. Then, and only then, pick the framework built for that condition.",
        },
      ],
    },
    {
      id: "pf-m3-continuation-framework",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "continuation-framework",
      title: "The Continuation Framework",
      description: "Trend + pullback + resumption, guided by EMA 20/50/200.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 2,
      xpReward: 60,
      prerequisites: ["pf-m3-selection-not-collecting"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Continuation Framework" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "The continuation framework is the professional's bread and butter, because trends persist more often than they reverse. The logic chains together everything from Stages 13–14: confirmed trend → wait for pullback (Phase 2) → enter when the trend resumes (next Phase 1).",
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "The EMA 20/50/200 stack is the framework's map. In a healthy uptrend the EMAs stack in order — price above EMA 20, above EMA 50, above EMA 200 — and pullbacks tend to find support at the EMA 20 or 50. When the stack is in order and price pulls back to a rising EMA, the continuation zone is defined for you.",
        },
        {
          id: "check1",
          type: "checklist",
          content: "Continuation framework conditions:",
          metadata: {
            items: [
              "Four-point trend confirmed on the daily",
              "EMA 20/50/200 stacked in trend order",
              "Price pulling back (Phase 2), not extended mid-air",
              "Pullback reaching the EMA 20/50 zone or prior structure",
              "HTF agreement: daily and 4H aligned",
            ],
          },
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "Running the continuation framework in a ranging market. When EMAs are flat and intertwined, there is no trend to continue — the framework is switched off.",
          metadata: { variant: "mistake" },
        },
        {
          id: "callout-tip",
          type: "callout",
          content:
            "Two continuation playbooks in the Strategy Wiki implement this framework: EOD Continuation (daily chart) and Momentum Bounce (multi-timeframe). You'll unlock them alongside this stage.",
          metadata: { variant: "tip" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Continuation = confirmed trend + orderly pullback + resumption entry, with the EMA 20/50/200 stack defining both the trend's health and the pullback zone.",
        },
      ],
    },
    {
      id: "pf-m3-reversal-framework",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "reversal-framework",
      title: "The Reversal Framework",
      description: "Exhaustion + confirmation, with fast EMAs and stochastic.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 3,
      xpReward: 60,
      prerequisites: ["pf-m3-continuation-framework"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Reversal Framework" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Reversal trading is harder than continuation trading — you are calling the end of a move rather than riding one. That's why the reversal framework demands two things continuation doesn't: visible exhaustion AND explicit confirmation. Suspicion alone is never enough.",
        },
        {
          id: "def-exhaustion",
          type: "definition",
          content:
            "Signs a trend is running out of participants: shrinking candles into a level, failure to make meaningful new highs/lows, long rejection wicks at the extreme.",
          metadata: { term: "Exhaustion" },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "The indicator set changes too. Reversal traders use fast EMAs — the 5 and 10 — because they need to detect a turn early, not confirm a mature trend. A cross of the EMA 5 below the EMA 10 after an extended rally is an early warning. The stochastic oscillator adds the second opinion: readings at overbought (above ~80) or oversold (below ~20) while momentum stalls suggest the move is stretched.",
        },
        {
          id: "def-stochastic",
          type: "definition",
          content:
            "A momentum oscillator (0–100) comparing the current close to the recent range. Extreme readings flag stretched moves — but an extreme reading alone is not a signal; trends can stay overbought for a long time.",
          metadata: { term: "Stochastic oscillator" },
        },
        {
          id: "check1",
          type: "checklist",
          content: "Reversal framework conditions:",
          metadata: {
            items: [
              "Extended, mature trend — not a fresh one",
              "Visible exhaustion at a meaningful HTF level",
              "EMA 5/10 cross against the old trend",
              "Stochastic at an extreme and turning",
              "Structural confirmation: the immediate high/low breaks",
            ],
          },
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "Shorting 'because it's gone up too much'. Price has no memory of how far it has travelled. Without exhaustion plus confirmation, that's not a reversal trade — it's an opinion with a position attached.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Reversals need exhaustion AND confirmation. Fast EMAs (5/10) and the stochastic provide early warnings; broken structure provides the proof.",
        },
      ],
    },
    {
      id: "pf-m3-breakout-framework",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "breakout-framework",
      title: "The Breakout Framework",
      description: "Volatility compression, expansion, and Bollinger Bands.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 4,
      xpReward: 60,
      prerequisites: ["pf-m3-reversal-framework"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Breakout Framework" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Markets alternate between quiet and loud: volatility compresses, then expands. The breakout framework trades that rhythm — it looks for markets coiling into unusually tight ranges and positions for the expansion that follows.",
        },
        {
          id: "def-compression",
          type: "definition",
          content:
            "A period of shrinking ranges and overlapping candles as the market builds pressure. The tighter and longer the compression, the more energetic the eventual expansion tends to be.",
          metadata: { term: "Volatility compression" },
        },
        {
          id: "def-bollinger",
          type: "definition",
          content:
            "Bands plotted a set number of standard deviations around a moving average. They narrow when volatility compresses (the 'squeeze') and widen when it expands — making the quiet-before-the-move visible at a glance.",
          metadata: { term: "Bollinger Bands" },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "The playbook: spot the squeeze, mark the range boundaries, then wait for a decisive CLOSE outside the range with expanding candles. The breakout framework's enemy is the fakeout you studied earlier — a wick through the level that snaps back. The close, not the poke, is the evidence.",
        },
        {
          id: "check1",
          type: "checklist",
          content: "Breakout framework conditions:",
          metadata: {
            items: [
              "Clear range or squeeze after a quiet period",
              "Bands / range visibly narrowing",
              "Decisive candle CLOSE beyond the boundary",
              "Expansion follows the break (bands widening, bigger bodies)",
              "No major news seconds away that could whipsaw the break",
            ],
          },
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "Buying the first touch of the band edge inside the squeeze. Inside a compression, band touches mean nothing — the framework only activates on the confirmed break.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Compression precedes expansion. Bollinger Bands make the squeeze visible; a decisive close outside the range — not a wick — activates the breakout framework.",
        },
      ],
    },
    {
      id: "pf-m3-decision-engine",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "trade-or-skip-decision-engine",
      title: "The Trade-or-Skip Decision Engine",
      description: "The most important lesson in this track: when NOT to trade.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 5,
      xpReward: 75,
      prerequisites: ["pf-m3-breakout-framework"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Trade-or-Skip Decision Engine" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "This may be the most important lesson in the academy. Everything you've built — context, positioning, classification — feeds one final decision that beginners don't even know exists: trade, or don't trade. Professionals run this decision as an engine with explicit exit ramps, and most days end at an exit ramp.",
        },
        {
          id: "def-engine",
          type: "definition",
          content:
            "A sequential series of agreement checks where ANY failure ends in a skip. Only full alignment reaches strategy selection and execution.",
          metadata: { term: "Decision engine" },
        },
        {
          id: "ex1",
          type: "example",
          content:
            "The engine, step by step: Context clear? No → skip. Daily direction defined? No → skip. DXY agrees? No → skip. Sentiment agrees? No → skip. Positioning right (HTF agreement, Phase 1, correct zone)? No → skip. Everything agrees → classify the market → select the strategy → trade. One 'no' anywhere ends the sequence.",
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "Actively hunt for reasons NOT to trade. If you find more reasons to skip than to enter, the market answered your question. Skipping is not missing out — skipping IS the strategy working.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Why does this eliminate so many beginner mistakes? Because nearly every classic error — revenge trading, boredom trading, FOMO entries, counter-trend gambles — is a trade that entered the engine and should have exited at a ramp. The engine doesn't make you smarter about markets; it makes your discipline mechanical.",
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "Treating a skip as a failure. Your journal should record skipped trades as completed decisions — over time, the quality of your skips predicts the quality of your account.",
          metadata: { variant: "mistake" },
        },
        {
          id: "safety",
          type: "safety-note",
          content:
            "Educational simulator only. Not financial advice. No process guarantees profitable outcomes — the engine improves decision quality, which is the only thing a trader controls.",
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "The decision engine checks context, direction, DXY, sentiment, and positioning in sequence — any failure means skip. Full agreement, and only full agreement, leads to strategy selection and a trade.",
        },
      ],
    },
    {
      id: "pf-m3-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "strategy-selection-check",
      title: "Strategy Selection Check",
      description: "Test market classification, frameworks, and the decision engine.",
      lessonType: "quiz",
      difficulty: "advanced",
      order: 6,
      xpReward: 50,
      prerequisites: ["pf-m3-decision-engine"],
      estimatedMinutes: 0,
      quizId: "strategy-selection-check",
      contentBlocks: [],
    },
  ],
}
