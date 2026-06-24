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
]
