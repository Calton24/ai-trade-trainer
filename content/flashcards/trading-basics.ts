import { buildBasicCard, buildMcCard, buildTfCard } from "@/content/flashcards/card-builder"
import type { Flashcard } from "@/lib/flashcards/types"

const D = "trading-basics"

export const tradingBasicsCards: Flashcard[] = [
  buildBasicCard({ deckId: D, slug: "what-is-trading", front: "What is trading?", back: "Buying and selling financial instruments to capture price movement.", explanation: "Trading focuses on short-term price changes rather than long-term ownership.", tags: ["foundations"], relatedConcept: "Trading" }),
  buildBasicCard({ deckId: D, slug: "what-is-market", front: "What is a market?", back: "A place where buyers and sellers meet to exchange assets at agreed prices.", explanation: "Markets can be exchanges, ECNs, or broker platforms.", tags: ["foundations"] }),
  buildBasicCard({ deckId: D, slug: "what-is-price", front: "What is price?", back: "The current value at which buyers and sellers agree to trade.", explanation: "Price reflects supply, demand, and information at that moment.", tags: ["foundations"] }),
  buildBasicCard({ deckId: D, slug: "buyer", front: "What is a buyer?", back: "A participant willing to purchase at the current ask or higher.", explanation: "Buyers push price up when demand exceeds supply.", tags: ["foundations"] }),
  buildBasicCard({ deckId: D, slug: "seller", front: "What is a seller?", back: "A participant willing to sell at the current bid or lower.", explanation: "Sellers push price down when supply exceeds demand.", tags: ["foundations"] }),
  buildBasicCard({ deckId: D, slug: "volatility", front: "What is volatility?", back: "How much and how fast price moves over time.", explanation: "Higher volatility means larger swings — more opportunity and more risk.", tags: ["foundations"] }),
  buildBasicCard({ deckId: D, slug: "liquidity", front: "What is liquidity?", back: "How easily an asset can be bought or sold without moving price much.", explanation: "Liquid markets have tight spreads and fast fills.", tags: ["foundations"] }),
  buildBasicCard({ deckId: D, slug: "setup", front: "What is a setup?", back: "A repeatable pattern or condition that defines a potential trade idea.", explanation: "Setups give structure — random clicks are not setups.", tags: ["foundations"] }),
  buildBasicCard({ deckId: D, slug: "confirmation", front: "What is confirmation?", back: "Evidence that price is behaving as your setup expects before entry.", explanation: "Confirmation reduces impulsive entries.", tags: ["foundations"] }),
  buildMcCard({ deckId: D, slug: "practise-first", front: "Why practise before risking real money?", back: "Build habits without paying tuition to the market.", explanation: "Simulators let you rehearse entries, stops, and rules with zero capital at risk.", options: [{ id: "a", text: "Build habits without capital risk" }, { id: "b", text: "Guarantee live profits" }, { id: "c", text: "Skip learning charts" }, { id: "d", text: "Avoid all losses forever" }], correctAnswer: "a", tags: ["foundations"] }),
]
