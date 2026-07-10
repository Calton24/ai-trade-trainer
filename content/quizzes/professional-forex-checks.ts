import type { CourseQuiz } from "@/lib/course/types"

const PATH_ID = "professional-forex"

/** Stage 13 quiz — Market Context & Bias. */
export const marketContextCheckQuiz: CourseQuiz = {
  id: "market-context-check",
  pathId: PATH_ID,
  lessonId: "pf-m1-quiz",
  title: "Market Context Check",
  description:
    "Test your understanding of market context, daily direction, DXY, and sentiment.",
  passingScore: 70,
  xpReward: 60,
  questions: [
    {
      id: "ctx-1",
      type: "multiple-choice",
      question: "What do professionals analyse FIRST each trading day?",
      options: [
        { id: "a", text: "Market context — direction, DXY, and sentiment" },
        { id: "b", text: "Entry signals on the 15-minute chart" },
        { id: "c", text: "Yesterday's profit and loss" },
      ],
      correctAnswer: "a",
      explanation:
        "Context comes before entries. Professionals build a view of the market first, then ask which charts offer a setup that agrees with it.",
      beginnerHint: "Think about what makes a 'perfect setup' fail.",
      relatedConcept: "Market context",
    },
    {
      id: "ctx-2",
      type: "multiple-choice",
      question: "Which timeframe should decide your overall daily bias?",
      options: [
        { id: "a", text: "The daily chart" },
        { id: "b", text: "The 15-minute chart" },
        { id: "c", text: "Whichever timeframe looks clearest today" },
      ],
      correctAnswer: "a",
      explanation:
        "Bias is set on the daily chart. Lower timeframes show noise inside the bigger move and must never set direction.",
      beginnerHint: "Lower timeframes are for execution only.",
      relatedConcept: "Daily bias",
    },
    {
      id: "ctx-3",
      type: "multiple-choice",
      question: "DXY is rising strongly. What does that suggest for EURUSD?",
      options: [
        { id: "a", text: "A headwind for longs — a strong dollar pushes EURUSD down" },
        { id: "b", text: "A tailwind for longs — a strong dollar pushes EURUSD up" },
        { id: "c", text: "Nothing — DXY and EURUSD are unrelated" },
      ],
      correctAnswer: "a",
      explanation:
        "The dollar is the quote currency in EURUSD, so dollar strength pushes the pair down. Rising DXY contradicts EURUSD long ideas.",
      beginnerHint: "EURUSD has the dollar on the second side of the pair.",
      relatedConcept: "DXY",
    },
    {
      id: "ctx-4",
      type: "multiple-choice",
      question: "In a risk-off market mood, money typically flows INTO which currencies?",
      options: [
        { id: "a", text: "Safe havens like USD, JPY, and CHF" },
        { id: "b", text: "Growth-linked currencies like AUD and NZD" },
        { id: "c", text: "Whichever currency has the highest interest rate" },
      ],
      correctAnswer: "a",
      explanation:
        "Risk-off means fear: investors seek safety, so safe-haven currencies strengthen while growth-linked currencies weaken.",
      beginnerHint: "Fearful money looks for shelter.",
      relatedConcept: "Risk-off",
    },
    {
      id: "ctx-5",
      type: "scenario",
      question:
        "Your morning checklist shows: daily bias bullish, DXY contradicting, sentiment unclear. What is the professional response?",
      options: [
        { id: "a", text: "Skip the pair today — the context checks disagree" },
        { id: "b", text: "Trade anyway, since the daily bias is the most important" },
        { id: "c", text: "Drop to the 5-minute chart to break the tie" },
      ],
      correctAnswer: "a",
      explanation:
        "When direction, DXY, and sentiment disagree, the checklist's correct output is 'no trade'. Skipping on conflicting context is the process working.",
      beginnerHint: "The checklist includes 'reasons NOT to trade' for a reason.",
      relatedConcept: "Context checklist",
    },
    {
      id: "ctx-6",
      type: "true-false",
      question:
        "A no-trade day decided by your context checklist counts as a successfully completed process.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "true",
      explanation:
        "Professionals measure success by process execution. Standing aside when context disagrees is a correct decision, not a missed opportunity.",
      relatedConcept: "No-trade decision",
    },
  ],
}

/** Stage 14 quiz — Positioning & Timeframe Agreement. */
export const positioningCheckQuiz: CourseQuiz = {
  id: "positioning-check",
  pathId: PATH_ID,
  lessonId: "pf-m2-quiz",
  title: "Positioning Check",
  description:
    "Test timeframe agreement, Phase 1 vs Phase 2, and trend confirmation.",
  passingScore: 70,
  xpReward: 60,
  questions: [
    {
      id: "pos-1",
      type: "multiple-choice",
      question: "In the professional timeframe chain of command, what is the 1H chart for?",
      options: [
        { id: "a", text: "Execution only — timing entries, never deciding direction" },
        { id: "b", text: "Deciding the macro direction" },
        { id: "c", text: "Overriding the daily when they disagree" },
      ],
      correctAnswer: "a",
      explanation:
        "Daily sets bias, 4H confirms, 1H executes. The 1H never gets a vote on direction.",
      beginnerHint: "It's a magnifying glass, not a compass.",
      relatedConcept: "HTF agreement",
    },
    {
      id: "pos-2",
      type: "multiple-choice",
      question: "The daily chart is bullish but the 4H chart is bearish. What do you do?",
      options: [
        { id: "a", text: "No trade on that pair today — disagreement is a skip signal" },
        { id: "b", text: "Trade the 4H direction since it's more recent" },
        { id: "c", text: "Take half-size trades in both directions" },
      ],
      correctAnswer: "a",
      explanation:
        "Trades require daily and 4H agreement. When the timeframes disagree, professionals stand down rather than guess.",
      beginnerHint: "Disagreement is not a puzzle to solve.",
      relatedConcept: "HTF agreement",
    },
    {
      id: "pos-3",
      type: "multiple-choice",
      question: "What is Phase 2 of a trend?",
      options: [
        { id: "a", text: "The corrective pullback against the trend — never traded" },
        { id: "b", text: "The impulsive leg in the trend direction" },
        { id: "c", text: "The moment the trend reverses completely" },
      ],
      correctAnswer: "a",
      explanation:
        "Phase 1 is the impulsive trend leg; Phase 2 is the pullback. Professionals use Phase 2 to prepare, and only trade the Phase 1 resumption.",
      beginnerHint: "One phase is for trading, one is for planning.",
      relatedConcept: "Phase 2",
    },
    {
      id: "pos-4",
      type: "multiple-choice",
      question: "How many swing points confirm a trend using four-point confirmation?",
      options: [
        { id: "a", text: "Four — e.g. HH, HL, HH, HL for an uptrend" },
        { id: "b", text: "Two — one high and one low" },
        { id: "c", text: "One decisive breakout candle" },
      ],
      correctAnswer: "a",
      explanation:
        "Four agreeing swing points (HH/HL/HH/HL or LL/LH/LL/LH) mean the market has committed to a direction twice in a row. Fewer is a guess.",
      beginnerHint: "Two points draw a line; more points confirm a market.",
      relatedConcept: "Four-point trend confirmation",
    },
    {
      id: "pos-5",
      type: "scenario",
      question:
        "An uptrend is pulling back. Which pullback is the healthiest sign the trend remains strong?",
      options: [
        { id: "a", text: "A shallow, orderly ~3-bar drift toward the rising EMA 20" },
        { id: "b", text: "A deep, fast collapse through the last higher low" },
        { id: "c", text: "A pullback that has lasted longer than the original push" },
      ],
      correctAnswer: "a",
      explanation:
        "Short, orderly pullbacks into a rising moving average show buyers returning quickly. Deep or structural breaks threaten the trend itself.",
      beginnerHint: "Healthy pullbacks are shallow and brief.",
      relatedConcept: "3-bar pullback",
    },
    {
      id: "pos-6",
      type: "true-false",
      question:
        "A perfect-looking bullish candle is a valid reason to enter, even if price is extended far above the last higher low.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "false",
      explanation:
        "Candles are triggers, not reasons. Location provides the edge — an extended price far from structure is poor positioning regardless of the candle.",
      relatedConcept: "Positioning",
    },
  ],
}

/** Stage 15 quiz — Professional Strategy Selection. */
export const strategySelectionCheckQuiz: CourseQuiz = {
  id: "strategy-selection-check",
  pathId: PATH_ID,
  lessonId: "pf-m3-quiz",
  title: "Strategy Selection Check",
  description:
    "Test market classification, the three frameworks, and the trade-or-skip decision engine.",
  passingScore: 70,
  xpReward: 60,
  questions: [
    {
      id: "sel-1",
      type: "multiple-choice",
      question: "What question do professionals ask BEFORE choosing a strategy?",
      options: [
        { id: "a", text: "What kind of market do I have today?" },
        { id: "b", text: "Which strategy has won most recently?" },
        { id: "c", text: "What is my favourite setup?" },
      ],
      correctAnswer: "a",
      explanation:
        "The market type selects the strategy, never the other way round. Classify first: continuation, reversal, breakout, or no trade.",
      beginnerHint: "Selection starts with classification.",
      relatedConcept: "Market classification",
    },
    {
      id: "sel-2",
      type: "multiple-choice",
      question: "Which market condition suits the continuation framework?",
      options: [
        { id: "a", text: "A confirmed trend with orderly pullbacks and stacked EMAs" },
        { id: "b", text: "A tight, quiet range with narrowing bands" },
        { id: "c", text: "An exhausted, extended trend at a weekly level" },
      ],
      correctAnswer: "a",
      explanation:
        "Continuation needs a trend to continue: four-point confirmation, EMA 20/50/200 stacked in order, and a healthy Phase 2 pullback.",
      beginnerHint: "You can't continue what doesn't exist.",
      relatedConcept: "Continuation",
    },
    {
      id: "sel-3",
      type: "multiple-choice",
      question: "Why does the reversal framework use the fast EMA 5/10 pair plus the stochastic?",
      options: [
        { id: "a", text: "To detect a turn early and confirm the move is stretched" },
        { id: "b", text: "Because they guarantee the reversal will happen" },
        { id: "c", text: "To measure long-term trend health" },
      ],
      correctAnswer: "a",
      explanation:
        "Reversal traders need early warnings: fast EMAs crossing signal a possible turn, and stochastic extremes flag stretched moves. Structure still has to confirm.",
      beginnerHint: "Reversal tools are early-warning tools.",
      relatedConcept: "EMA 5/10",
    },
    {
      id: "sel-4",
      type: "multiple-choice",
      question: "In the breakout framework, what actually confirms the breakout?",
      options: [
        { id: "a", text: "A decisive candle CLOSE beyond the range boundary" },
        { id: "b", text: "Any wick poking through the level" },
        { id: "c", text: "The Bollinger Bands touching price" },
      ],
      correctAnswer: "a",
      explanation:
        "The close, not the poke, is the evidence. Wicks through a level that snap back are fakeouts — the breakout framework's enemy.",
      beginnerHint: "Watch where the candle closes, not where it reached.",
      relatedConcept: "Breakout",
    },
    {
      id: "sel-5",
      type: "scenario",
      question:
        "Context is clear and direction is defined, but DXY contradicts your pair's setup. The decision engine says…",
      options: [
        { id: "a", text: "Skip — any failed agreement check ends the sequence" },
        { id: "b", text: "Trade at half size as a compromise" },
        { id: "c", text: "Trade anyway — DXY is only one factor" },
      ],
      correctAnswer: "a",
      explanation:
        "The decision engine is sequential: context, direction, DXY, sentiment, positioning. Any 'no' anywhere means skip. Only full agreement leads to a trade.",
      beginnerHint: "The engine has exit ramps, not volume knobs.",
      relatedConcept: "Decision engine",
    },
    {
      id: "sel-6",
      type: "true-false",
      question:
        "Professionals actively look for MORE reasons not to trade than reasons to trade.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "true",
      explanation:
        "Hunting for reasons to skip is a core professional habit. If the skip reasons win, the market has answered your question — and skipping is the strategy working.",
      relatedConcept: "No-trade decision",
    },
  ],
}

/** Stage 16 quiz — Watchlist Building & Pair Selection. */
export const watchlistCheckQuiz: CourseQuiz = {
  id: "watchlist-check",
  pathId: PATH_ID,
  lessonId: "pf-m4-quiz",
  title: "Watchlist Check",
  description:
    "Test watchlist building, pair scoring, and the maximum-positions rule.",
  passingScore: 70,
  xpReward: 60,
  questions: [
    {
      id: "wl-1",
      type: "multiple-choice",
      question: "Roughly how many pairs should survive your morning filter onto the watchlist?",
      options: [
        { id: "a", text: "4–5 quality opportunities" },
        { id: "b", text: "All 28 — more charts means more chances" },
        { id: "c", text: "Exactly one" },
      ],
      correctAnswer: "a",
      explanation:
        "Watching 28 pairs means analysing none of them properly. Professionals filter down to a handful where the whole system agrees.",
      beginnerHint: "Quality of attention beats quantity of markets.",
      relatedConcept: "Watchlist",
    },
    {
      id: "wl-2",
      type: "multiple-choice",
      question: "Which pair belongs on the CONTINUATION watchlist?",
      options: [
        {
          id: "a",
          text: "Confirmed daily trend, 4H agreeing, price in an orderly pullback near a defined zone",
        },
        {
          id: "b",
          text: "A mature, extended trend showing exhaustion wicks at a weekly level",
        },
        { id: "c", text: "A pair with no clear structure but big candles today" },
      ],
      correctAnswer: "a",
      explanation:
        "Continuation candidates are confirmed trends completing a healthy Phase 2 near a defined zone. The exhausted trend at a level is a reversal-watch candidate.",
      beginnerHint: "Match the list to the framework it feeds.",
      relatedConcept: "Continuation watchlist",
    },
    {
      id: "wl-3",
      type: "multiple-choice",
      question: "Why is the reversal watchlist deliberately shorter and stricter?",
      options: [
        {
          id: "a",
          text: "Reversal setups are rarer and riskier — they stay 'watch and wait' until structure confirms",
        },
        { id: "b", text: "Because reversals are the easiest trades" },
        { id: "c", text: "Because only exotic pairs can reverse" },
      ],
      correctAnswer: "a",
      explanation:
        "Reversals demand a mature trend, a significant level, visible exhaustion, and confirmation. Most days that list holds one or two names — often zero.",
      beginnerHint: "Higher risk means a higher bar for entry to the list.",
      relatedConcept: "Reversal watchlist",
    },
    {
      id: "wl-4",
      type: "multiple-choice",
      question: "Which of these is one of the six pair-scoring dimensions?",
      options: [
        { id: "a", text: "Risk clarity — is there an obvious stop level and sensible target?" },
        { id: "b", text: "How exciting the pair feels today" },
        { id: "c", text: "How many pips the pair moved last month" },
      ],
      correctAnswer: "a",
      explanation:
        "The six dimensions are daily direction, DXY alignment, sentiment, HTF agreement, strategy fit, and risk clarity. If you can't define where you're wrong, you can't size the trade.",
      beginnerHint: "Scoring turns 'I like this chart' into a comparable number.",
      relatedConcept: "Pair scoring",
    },
    {
      id: "wl-5",
      type: "scenario",
      question:
        "You're long EURUSD and GBPUSD, and short USDJPY. How many effective positions is that?",
      options: [
        { id: "a", text: "Roughly one — all three are the same dollar-weakness bet" },
        { id: "b", text: "Three completely independent positions" },
        { id: "c", text: "Zero, because they cancel out" },
      ],
      correctAnswer: "a",
      explanation:
        "All three trades profit from a falling dollar. Correlated trades count as one position at multiplied size — a key reason for the maximum-3 rule.",
      beginnerHint: "Ask what single event would make all three win or lose.",
      relatedConcept: "Position",
    },
    {
      id: "wl-6",
      type: "true-false",
      question:
        "If a pair isn't on your morning watchlist but 'suddenly looks good' mid-session, it's fine to trade it.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "false",
      explanation:
        "The watchlist is a commitment device built from context during your routine. Mid-session additions are impulse, not analysis — journal it as a skip instead.",
      relatedConcept: "Watchlist",
    },
  ],
}

/** Stage 17 final milestone — Professional Forex Workflow Assessment. */
export const professionalForexWorkflowAssessment: CourseQuiz = {
  id: "professional-forex-workflow-assessment",
  pathId: PATH_ID,
  lessonId: "pf-m5-final-assessment",
  title: "Professional Forex Workflow Assessment",
  description:
    "The final milestone: prove you can run the complete professional workflow — context through journal.",
  passingScore: 75,
  xpReward: 150,
  questions: [
    {
      id: "pfa-1",
      type: "multiple-choice",
      question: "Put the professional daily workflow in the correct order.",
      options: [
        {
          id: "a",
          text: "Context → positioning → watchlist → strategy selection → decision engine → manage → journal",
        },
        {
          id: "b",
          text: "Find entries → pick a strategy → check context if the trade loses",
        },
        {
          id: "c",
          text: "Watchlist → entries → context → journal only the winners",
        },
      ],
      correctAnswer: "a",
      explanation:
        "The operating system always runs context-first and journal-last, with the decision engine gating execution in between.",
      beginnerHint: "Context is always the first step.",
      relatedConcept: "Daily routine",
    },
    {
      id: "pfa-2",
      type: "multiple-choice",
      question: "DXY is falling steadily. Which trade does that CONFIRM?",
      options: [
        { id: "a", text: "A EURUSD long — dollar weakness lifts the pair" },
        { id: "b", text: "A EURUSD short — dollar weakness sinks the pair" },
        { id: "c", text: "A USDJPY long — dollar weakness lifts the pair" },
      ],
      correctAnswer: "a",
      explanation:
        "The dollar is EURUSD's quote currency, so a weakening dollar pushes EURUSD up — falling DXY confirms EURUSD longs (and would confirm USDJPY shorts, not longs).",
      beginnerHint: "Work out which side of the pair the dollar is on.",
      relatedConcept: "DXY",
    },
    {
      id: "pfa-3",
      type: "multiple-choice",
      question: "Markets are in clear risk-off mode. Which currency group is strengthening?",
      options: [
        { id: "a", text: "Safe havens — USD, JPY, CHF" },
        { id: "b", text: "Growth currencies — AUD, NZD" },
        { id: "c", text: "All currencies equally" },
      ],
      correctAnswer: "a",
      explanation:
        "Risk-off sends money to safety. Safe havens strengthen while growth-linked currencies weaken — which shapes which pairs belong on the watchlist.",
      relatedConcept: "Risk-off",
    },
    {
      id: "pfa-4",
      type: "scenario",
      question:
        "Daily bearish, 4H bearish, price completing a shallow pullback toward a falling EMA zone. What kind of opportunity is this?",
      options: [
        { id: "a", text: "A continuation short — trend confirmed, Phase 2 ending at a defined zone" },
        { id: "b", text: "A reversal long — the pullback means buyers are taking over" },
        { id: "c", text: "A breakout — the pullback is a squeeze" },
      ],
      correctAnswer: "a",
      explanation:
        "HTF agreement plus a healthy pullback in a confirmed downtrend is the continuation framework's exact setup — in the trend direction, which is short.",
      beginnerHint: "Classify the market first: this one is trending.",
      relatedConcept: "Continuation",
    },
    {
      id: "pfa-5",
      type: "scenario",
      question:
        "A pair has rallied for weeks into a weekly resistance. Candles are shrinking, the EMA 5 just crossed below the EMA 10, and the stochastic is turning down from above 80. What framework applies — and what do you still need?",
      options: [
        {
          id: "a",
          text: "Reversal framework — but you still need structural confirmation before any entry",
        },
        { id: "b", text: "Continuation framework — buy the dip immediately" },
        { id: "c", text: "No framework — indicators are meaningless" },
      ],
      correctAnswer: "a",
      explanation:
        "Mature trend, significant level, exhaustion, and early warnings satisfy the reversal watchlist — but the framework still demands structure to break (the immediate low) before a trade exists.",
      beginnerHint: "Early warnings are not entries.",
      relatedConcept: "Reversal",
    },
    {
      id: "pfa-6",
      type: "multiple-choice",
      question: "When is a Bollinger Band breakout setup actually active?",
      options: [
        {
          id: "a",
          text: "After a visible squeeze, when a candle CLOSES decisively outside the range",
        },
        { id: "b", text: "Whenever price touches a band edge" },
        { id: "c", text: "During any high-volatility news spike" },
      ],
      correctAnswer: "a",
      explanation:
        "Compression precedes expansion. The framework needs the squeeze first and a decisive close — not a wick — beyond the boundary.",
      relatedConcept: "Bollinger Bands",
    },
    {
      id: "pfa-7",
      type: "scenario",
      question:
        "Direction, sentiment, and positioning all agree — but there's a major news release in 20 minutes. The decision engine output is…",
      options: [
        { id: "a", text: "Skip or wait — imminent high-impact news is a reason not to trade" },
        { id: "b", text: "Trade immediately before the news hits" },
        { id: "c", text: "Double the position to profit from the volatility" },
      ],
      correctAnswer: "a",
      explanation:
        "'Reasons not to trade' is a first-class checklist item. High-impact news can invalidate perfect alignment in seconds — professionals stand aside or wait for the dust to settle.",
      beginnerHint: "The engine's last check is the skip check.",
      relatedConcept: "Decision engine",
    },
    {
      id: "pfa-8",
      type: "multiple-choice",
      question: "Which trade plan follows the professional risk rules?",
      options: [
        {
          id: "a",
          text: "~1% risk, stop and target set before entry, size calculated from the stop distance",
        },
        {
          id: "b",
          text: "10% risk with a mental stop you'll place 'if needed'",
        },
        {
          id: "c",
          text: "1% risk, but the stop gets moved further away if price approaches it",
        },
      ],
      correctAnswer: "a",
      explanation:
        "Small fixed risk, exits defined before entry, and size derived from stop distance. Moving a stop away from price converts a small planned loss into an unplanned large one.",
      relatedConcept: "Risk per trade",
    },
    {
      id: "pfa-9",
      type: "multiple-choice",
      question: "How should a 20-pips-per-day target be understood?",
      options: [
        {
          id: "a",
          text: "As an example training objective — never a promise, and never a reason to force trades",
        },
        { id: "b", text: "As a guaranteed daily income once you're skilled" },
        { id: "c", text: "As a minimum the market owes you each day" },
      ],
      correctAnswer: "a",
      explanation:
        "Pip targets train patience and consistency, judged over weeks. Some days the correct action is no trade — and that day still counts as success if the process was followed.",
      beginnerHint: "Process first; the target never outranks the decision engine.",
      relatedConcept: "Pip training target",
    },
    {
      id: "pfa-10",
      type: "multiple-choice",
      question: "You already hold 3 open positions and a high-scoring setup appears. What now?",
      options: [
        { id: "a", text: "Journal it as a skipped trade — the 3-position limit is absolute" },
        { id: "b", text: "Open it anyway; great setups override limits" },
        { id: "c", text: "Close a winner early to free a slot" },
      ],
      correctAnswer: "a",
      explanation:
        "Position limits only work if they're absolute. Attention and correlation risk degrade with every simultaneous position — the setup goes in the journal as a skip.",
      relatedConcept: "Position",
    },
    {
      id: "pfa-11",
      type: "multiple-choice",
      question: "What is the headline statistic of the weekly review?",
      options: [
        { id: "a", text: "Rule adherence — the % of decisions that followed your process" },
        { id: "b", text: "Total pips won this week" },
        { id: "c", text: "Number of trades taken" },
      ],
      correctAnswer: "a",
      explanation:
        "Outcomes wobble with market noise; adherence is fully under your control, and over months it's what your equity curve reflects. Review skips as well as takes.",
      beginnerHint: "Track the thing you control.",
      relatedConcept: "Weekly review",
    },
    {
      id: "pfa-12",
      type: "true-false",
      question:
        "A rule-breaking trade that happens to win is a better trade than a rule-following trade that loses.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "false",
      explanation:
        "A rule-following loss is a good trade; a rule-breaking win rewards exactly the behaviour that eventually ends accounts. Judge yourself by adherence, not single outcomes.",
      relatedConcept: "Professional mindset",
    },
  ],
}

export const PROFESSIONAL_FOREX_QUIZZES: CourseQuiz[] = [
  marketContextCheckQuiz,
  positioningCheckQuiz,
  strategySelectionCheckQuiz,
  watchlistCheckQuiz,
  professionalForexWorkflowAssessment,
]
