import { buildBasicCard, buildTfCard } from "@/content/flashcards/card-builder"
import type { Flashcard } from "@/lib/flashcards/types"

const D = "candlesticks"

export const candlesticksCards: Flashcard[] = [
  buildBasicCard({ deckId: D, slug: "open", front: "What is the open?", back: "The price where the candle period started.", explanation: "Open is the first traded price in that timeframe.", tags: ["candlesticks"] }),
  buildBasicCard({ deckId: D, slug: "high", front: "What is the high?", back: "The highest price reached during the candle period.", explanation: "The top of the upper wick marks the high.", tags: ["candlesticks"] }),
  buildBasicCard({ deckId: D, slug: "low", front: "What is the low?", back: "The lowest price reached during the candle period.", explanation: "The bottom of the lower wick marks the low.", tags: ["candlesticks"] }),
  buildBasicCard({ deckId: D, slug: "close", front: "What is the close?", back: "The final price at the end of the candle period.", explanation: "Close vs open determines bullish or bearish body color.", tags: ["candlesticks"] }),
  buildBasicCard({ deckId: D, slug: "body", front: "What is the candle body?", back: "The thick area between open and close.", explanation: "Body shows where price settled relative to where it opened.", tags: ["candlesticks"] }),
  buildBasicCard({ deckId: D, slug: "wick", front: "What is a wick?", back: "The thin line showing how far price stretched beyond the body.", explanation: "Wicks show rejection or exploration beyond the body.", tags: ["candlesticks"] }),
  buildBasicCard({ deckId: D, slug: "bullish", front: "What is a bullish candle?", back: "Close is higher than open — buyers won the period.", explanation: "Often shown green; small lower wicks suggest control.", tags: ["candlesticks"] }),
  buildBasicCard({ deckId: D, slug: "bearish", front: "What is a bearish candle?", back: "Close is lower than open — sellers won the period.", explanation: "Often shown red; small upper wicks suggest control.", tags: ["candlesticks"] }),
  buildBasicCard({ deckId: D, slug: "rejection-wick", front: "What is a rejection wick?", back: "A long wick showing price was pushed back from a level.", explanation: "Long upper wick = sellers rejected higher prices.", tags: ["candlesticks"] }),
  buildTfCard({ deckId: D, slug: "one-candle-enough", front: "One candle alone is enough to confirm a full trend reversal.", back: "False", correctAnswer: "false", explanation: "Context and structure matter — one candle is a clue, not proof.", tags: ["candlesticks"] }),
]
