import {
  buildBasicCard,
  buildMcCard,
  buildTfCard,
} from "@/content/flashcards/card-builder"
import type { Flashcard } from "@/lib/flashcards/types"

const DECK_ID = "deck-professional-forex"

/** Flashcards for the Professional Forex Workflow track (Stages 13–17). */
export const professionalForexCards: Flashcard[] = [
  buildBasicCard({
    deckId: DECK_ID,
    slug: "market-context",
    front: "What is market context?",
    back: "The environment around a setup: higher-timeframe direction, related markets (like DXY), and current sentiment.",
    explanation:
      "Every strategy only works in the correct context. Professionals analyse context before looking for any entry.",
    tags: ["context", "professional"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "daily-bias",
    front: "What is daily bias, and which chart sets it?",
    back: "Your working assumption for the day — bullish, bearish, or neutral — decided on the DAILY chart only.",
    explanation:
      "Lower timeframes show noise inside the bigger move. They are for execution, never for deciding direction.",
    tags: ["context", "bias"],
    difficulty: "advanced",
  }),
  buildMcCard({
    deckId: DECK_ID,
    slug: "dxy",
    front: "DXY is rising. What does that typically mean for EURUSD?",
    back: "Downward pressure — a strengthening dollar pushes EURUSD lower.",
    explanation:
      "The dollar is EURUSD's quote currency. Rising DXY is a headwind for EURUSD longs and a tailwind for USDJPY longs.",
    options: [
      { id: "a", text: "Downward pressure on EURUSD" },
      { id: "b", text: "Upward pressure on EURUSD" },
      { id: "c", text: "No relationship at all" },
    ],
    correctAnswer: "a",
    tags: ["dxy", "context"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "risk-on",
    front: "What is a risk-on market mood?",
    back: "Investors are confident and seeking returns — money flows into growth-linked currencies like AUD, NZD, and GBP.",
    explanation:
      "Sentiment shapes which currencies get bought. Risk-on favours growth currencies over safe havens.",
    tags: ["sentiment"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "risk-off",
    front: "What is a risk-off market mood?",
    back: "Investors are fearful and seeking safety — money flows into safe havens like USD, JPY, and CHF.",
    explanation:
      "In risk-off conditions safe havens strengthen while growth-linked currencies weaken.",
    tags: ["sentiment"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "sentiment",
    front: "Why does sentiment matter for pair selection?",
    back: "The cleanest trades pair a strong currency against a weak one — sentiment tells you which is which today.",
    explanation:
      "News is the event; sentiment is the market's reaction. Trade the reaction you can see, not the headline you expected.",
    tags: ["sentiment", "context"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "htf-agreement",
    front: "What is higher timeframe (HTF) agreement?",
    back: "The daily and 4H charts showing the same structural direction. The 1H is for execution only.",
    explanation:
      "Daily decides, 4H confirms, 1H executes. When the chain of command disagrees, there is no trade on that pair.",
    tags: ["positioning", "timeframes"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "phase-1",
    front: "What is Phase 1 of a trend?",
    back: "The impulsive leg moving WITH the trend — strong candles, decisive progress. This is what professionals trade.",
    explanation:
      "Trends alternate between impulsive Phase 1 legs and corrective Phase 2 pullbacks. Trade only Phase 1 continuations.",
    tags: ["positioning", "phases"],
    difficulty: "advanced",
  }),
  buildTfCard({
    deckId: DECK_ID,
    slug: "phase-2",
    front: "True or false: Phase 2 (the pullback) is a good place to enter counter-trend trades.",
    back: "False — never trade Phase 2. Use it to plan where Phase 1 will resume.",
    explanation:
      "The pullback is information, not opportunity. Most pullbacks look like reversals while they're happening.",
    correctAnswer: "false",
    tags: ["positioning", "phases"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "four-point-trend",
    front: "What is four-point trend confirmation?",
    back: "A trend is confirmed only when four consecutive swing points agree: HH/HL/HH/HL up, or LL/LH/LL/LH down.",
    explanation:
      "Four points means the market committed to a direction twice in a row. Fewer points is a guess, not a trend.",
    tags: ["positioning", "structure"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "immediate-high-low",
    front: "What are the immediate high and immediate low?",
    back: "The most recent swing high and swing low — the trend's heartbeat.",
    explanation:
      "In an uptrend, the immediate low holding keeps the structure alive; its break means the four-point structure is broken and bias must be re-examined.",
    tags: ["positioning", "structure"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "ema-20-50-200",
    front: "What does the EMA 20/50/200 stack tell you?",
    back: "Trend health and pullback zones: in a healthy uptrend price sits above EMA 20 > 50 > 200, and pullbacks often bounce at the 20/50.",
    explanation:
      "The stacked EMAs are the continuation framework's map — flat, intertwined EMAs mean there is no trend to continue.",
    tags: ["indicators", "continuation"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "ema-5-10",
    front: "What are the fast EMA 5/10 used for?",
    back: "Early reversal detection — a cross against an extended trend is an early warning that the move may be turning.",
    explanation:
      "Reversal traders need to detect turns early, not confirm mature trends. Fast EMAs provide the warning; structure provides the proof.",
    tags: ["indicators", "reversal"],
    difficulty: "advanced",
  }),
  buildMcCard({
    deckId: DECK_ID,
    slug: "stochastic",
    front: "The stochastic reads 85 in a strong uptrend. What does that mean by itself?",
    back: "The move is stretched — but that alone is NOT a sell signal.",
    explanation:
      "Extreme stochastic readings flag stretched moves, but trends can stay overbought for a long time. It's one input to the reversal framework, never a standalone signal.",
    options: [
      { id: "a", text: "The move is stretched, but not a signal by itself" },
      { id: "b", text: "An automatic sell signal" },
      { id: "c", text: "The trend is guaranteed to continue" },
    ],
    correctAnswer: "a",
    tags: ["indicators", "reversal"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "bollinger-bands",
    front: "What do narrowing Bollinger Bands indicate?",
    back: "Volatility compression — the 'squeeze' that often precedes an expansion breakout.",
    explanation:
      "Bands plot standard deviations around a moving average: they narrow in quiet markets and widen in volatile ones, making the quiet-before-the-move visible.",
    tags: ["indicators", "breakout"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "continuation",
    front: "When does the continuation framework apply?",
    back: "In a confirmed trend with orderly pullbacks — enter when Phase 1 resumes out of the pullback zone.",
    explanation:
      "Conditions: four-point trend, stacked EMAs, healthy Phase 2 reaching the EMA/structure zone, and HTF agreement.",
    tags: ["frameworks", "continuation"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "reversal",
    front: "What TWO things does the reversal framework demand?",
    back: "Visible exhaustion AND explicit confirmation (structure breaking). Suspicion alone is never enough.",
    explanation:
      "Reversals call the end of a move, so the bar is higher: mature trend, significant level, exhaustion signs, early warnings, then a structural break.",
    tags: ["frameworks", "reversal"],
    difficulty: "advanced",
  }),
  buildMcCard({
    deckId: DECK_ID,
    slug: "breakout",
    front: "What confirms a breakout in the breakout framework?",
    back: "A decisive candle CLOSE beyond the range boundary — not a wick through it.",
    explanation:
      "Wicks that poke through and snap back are fakeouts. The close is the evidence; expansion afterwards is the confirmation.",
    options: [
      { id: "a", text: "A decisive close beyond the level" },
      { id: "b", text: "Any wick through the level" },
      { id: "c", text: "Price touching the Bollinger Band" },
    ],
    correctAnswer: "a",
    tags: ["frameworks", "breakout"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "watchlist",
    front: "What is a professional watchlist?",
    back: "A short, filtered list (4–5 pairs) that passed your context checks in the morning. Not on the list = not traded.",
    explanation:
      "28 pairs is too many to analyse properly. The watchlist concentrates attention on markets where the whole system agrees — and it's a commitment device.",
    tags: ["watchlist"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "pair-scoring",
    front: "Name the six pair-scoring dimensions.",
    back: "Daily direction, DXY alignment, sentiment, HTF agreement, strategy fit, and risk clarity.",
    explanation:
      "Scoring turns 'I like this chart' into a comparable number. Trade the highest scores; journal the rest.",
    tags: ["watchlist", "scoring"],
    difficulty: "advanced",
  }),
  buildMcCard({
    deckId: DECK_ID,
    slug: "position",
    front: "Long EURUSD, long GBPUSD, short USDJPY — how many effective positions?",
    back: "Roughly ONE: all three are the same dollar-weakness bet.",
    explanation:
      "Correlated trades count as one position at multiplied size. This is a key reason for the maximum-3-positions rule.",
    options: [
      { id: "a", text: "Effectively one" },
      { id: "b", text: "Three independent positions" },
      { id: "c", text: "Zero — they cancel out" },
    ],
    correctAnswer: "a",
    tags: ["positions", "risk"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "stop-loss-rule",
    front: "When is the stop-loss decided, and when can it be moved away from price?",
    back: "Decided BEFORE entry, at the level that proves the idea wrong. It is never moved away from price.",
    explanation:
      "Moving a stop doesn't protect the trade — it converts a small planned loss into an unplanned large one.",
    tags: ["risk"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "take-profit-rule",
    front: "When is the take-profit set, and where does it go?",
    back: "Before entry, while you're objective — at a logical target: structure, prior high/low, or measured move.",
    explanation:
      "Planning the exit before entry removes in-trade improvisation, which is almost always fear or greed in disguise.",
    tags: ["risk"],
    difficulty: "advanced",
  }),
  buildMcCard({
    deckId: DECK_ID,
    slug: "risk-per-trade",
    front: "What risk per trade does the professional track teach?",
    back: "A fixed, small percentage — around 1% or less — with size calculated FROM the stop distance.",
    explanation:
      "At 1% risk a five-trade losing streak costs ~5% — recoverable. Fixed risk also removes emotion from sizing decisions.",
    options: [
      { id: "a", text: "Around 1% or less, fixed" },
      { id: "b", text: "10% to grow fast" },
      { id: "c", text: "Whatever feels right that day" },
    ],
    correctAnswer: "a",
    tags: ["risk"],
    difficulty: "advanced",
  }),
  buildTfCard({
    deckId: DECK_ID,
    slug: "pip-training-target",
    front: "True or false: a 20-pip daily target means you should always find a trade to hit it.",
    back: "False — it's a training objective for patience and consistency, never a reason to force trades.",
    explanation:
      "Some days the correct action is no trade, and that day still counts as success if the process was followed. The decision engine always outranks the target.",
    correctAnswer: "false",
    tags: ["targets", "discipline"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "no-trade-decision",
    front: "In the decision engine, what happens when ANY agreement check fails?",
    back: "Skip. Only full alignment — context, direction, DXY, sentiment, positioning — leads to strategy selection and a trade.",
    explanation:
      "Skipping is a professional decision, not a missed opportunity. Journal skips like trades: their quality predicts your account's quality.",
    tags: ["decision-engine", "discipline"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "weekly-review",
    front: "What is the headline stat of the weekly review?",
    back: "Rule adherence — the percentage of decisions (takes AND skips) that followed your process.",
    explanation:
      "Outcomes wobble with market noise; adherence is fully under your control, and over months it's what the equity curve reflects. The stats never end.",
    tags: ["review", "discipline"],
    difficulty: "advanced",
  }),
  buildBasicCard({
    deckId: DECK_ID,
    slug: "professional-mindset",
    front: "Where does professional confidence come from?",
    back: "Repetition of the process — not from wins. Rules conquer fear; consistency beats gambling.",
    explanation:
      "A trader who has run the same routine hundreds of times trusts it in a way no winning streak can produce.",
    tags: ["mindset"],
    difficulty: "advanced",
  }),
]
