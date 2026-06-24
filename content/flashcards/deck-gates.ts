/** Which flashcard decks require Learning Map progress. Empty = always available. */
export const DECK_UNLOCK_RULES: Record<
  string,
  { requiredNodeIds: string[]; lockedMessage: string }
> = {
  candlesticks: {
    requiredNodeIds: ["node-lesson-candle-anatomy"],
    lockedMessage: "Complete Candlestick Anatomy on the Learning Map first.",
  },
  "market-structure": {
    requiredNodeIds: ["node-lesson-swing-highs"],
    lockedMessage: "Complete Swing Highs and Swing Lows before this deck.",
  },
  "support-resistance": {
    requiredNodeIds: ["node-chart-support"],
    lockedMessage: "Complete Support chart practice on the Learning Map first.",
  },
  "break-retest": {
    requiredNodeIds: ["node-chart-breakout"],
    lockedMessage: "Learn breakouts on the Learning Map before Break & Retest cards.",
  },
  icc: {
    requiredNodeIds: ["node-lesson-icc-indication"],
    lockedMessage: "Complete ICC Foundations before ICC flashcards.",
  },
  "risk-management": {
    requiredNodeIds: ["node-lesson-risk-reward"],
    lockedMessage: "Complete Risk/Reward on the Learning Map first.",
  },
  "trend-spotter": {
    requiredNodeIds: ["node-trend-what-is"],
    lockedMessage: "Complete Trend Basics before trend flashcards.",
  },
  "chart-cards": {
    requiredNodeIds: ["node-lesson-swing-highs"],
    lockedMessage: "Complete Swing Highs and Swing Lows before chart recognition cards.",
  },
  "book-lab": {
    requiredNodeIds: ["node-lesson-what-is-trading"],
    lockedMessage: "Start with What is Trading? on the Learning Map first.",
  },
}

/** Decks with no entry are always unlocked (e.g. trading-basics, psychology, forex-basics). */
