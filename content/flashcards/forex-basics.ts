import { buildBasicCard } from "@/content/flashcards/card-builder"
import type { Flashcard } from "@/lib/flashcards/types"

const D = "forex-basics"

export const forexBasicsCards: Flashcard[] = [
  buildBasicCard({ deckId: D, slug: "currency-pair", front: "Currency pair?", back: "Two currencies quoted together, e.g. EUR/USD.", explanation: "First currency is base, second is quote.", tags: ["forex"] }),
  buildBasicCard({ deckId: D, slug: "base", front: "Base currency?", back: "The first currency in the pair.", explanation: "In EUR/USD, EUR is base.", tags: ["forex"] }),
  buildBasicCard({ deckId: D, slug: "quote", front: "Quote currency?", back: "The second currency — price shows how much quote per one base.", explanation: "In EUR/USD, price is USD per EUR.", tags: ["forex"] }),
  buildBasicCard({ deckId: D, slug: "pip", front: "What is a pip?", back: "Smallest standard price increment in forex (usually 0.0001).", explanation: "Pips measure small price moves.", tags: ["forex"] }),
  buildBasicCard({ deckId: D, slug: "lot-size", front: "Lot size?", back: "Standardised trade volume (standard, mini, micro lots).", explanation: "Lot size affects pip value and risk.", tags: ["forex"] }),
  buildBasicCard({ deckId: D, slug: "spread", front: "Spread?", back: "Difference between bid and ask — cost to enter.", explanation: "Tighter spread = lower friction.", tags: ["forex"] }),
  buildBasicCard({ deckId: D, slug: "leverage", front: "Leverage?", back: "Borrowed buying power — magnifies gains and losses.", explanation: "Beginners should use low leverage.", tags: ["forex"] }),
  buildBasicCard({ deckId: D, slug: "margin", front: "Margin?", back: "Collateral required to open a leveraged position.", explanation: "Margin calls happen if losses exceed available margin.", tags: ["forex"] }),
  buildBasicCard({ deckId: D, slug: "london", front: "London session?", back: "Major forex session ~ 8am–4pm UK time.", explanation: "High liquidity for EUR, GBP pairs.", tags: ["forex"] }),
  buildBasicCard({ deckId: D, slug: "new-york", front: "New York session?", back: "Major US session, overlaps London afternoon.", explanation: "Often highest volume period.", tags: ["forex"] }),
  buildBasicCard({ deckId: D, slug: "overlap", front: "London–New York overlap?", back: "13:00–17:00 UTC — both major sessions live, the day's highest volume window.", explanation: "Tightest spreads and cleanest moves of the day.", tags: ["forex", "sessions"] }),
  buildBasicCard({ deckId: D, slug: "dxy", front: "DXY?", back: "The US Dollar Index — measures USD against a basket of majors.", explanation: "DXY up → EUR/USD tends down, USD/JPY tends up.", tags: ["forex", "context"] }),
  buildBasicCard({ deckId: D, slug: "currency-strength", front: "Currency strength?", back: "How one currency performs against ALL others at once.", explanation: "Pair the strongest against the weakest for the cleanest trends.", tags: ["forex", "context"] }),
  buildBasicCard({ deckId: D, slug: "correlation", front: "Pair correlation?", back: "Tendency of two pairs to move together (positive) or opposite (negative).", explanation: "EUR/USD + GBP/USD together ≈ one doubled dollar bet — count risk per currency.", tags: ["forex", "risk"] }),
  buildBasicCard({ deckId: D, slug: "big-four-news", front: "The 'big four' red news events?", back: "FOMC, CPI, NFP, and interest rate decisions.", explanation: "All four violently reprice USD pairs — plan around them, never through them.", tags: ["forex", "news"] }),
  buildBasicCard({ deckId: D, slug: "news-surprise", front: "What moves price at a news release?", back: "The SURPRISE — the gap between forecast and actual.", explanation: "Expectations are already priced in.", tags: ["forex", "news"] }),
  buildBasicCard({ deckId: D, slug: "specialise", front: "How many pairs should a beginner watch?", back: "3–5 majors, studied deeply.", explanation: "Depth builds pattern recognition; breadth splits attention 28 ways.", tags: ["forex"] }),
]
