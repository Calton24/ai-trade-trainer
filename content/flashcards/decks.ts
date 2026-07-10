import { bookLabCards } from "@/content/flashcards/book-lab"
import { breakRetestCards } from "@/content/flashcards/break-retest"
import { candlesticksCards } from "@/content/flashcards/candlesticks"
import { chartCards } from "@/content/flashcards/chart-cards"
import { forexBasicsCards } from "@/content/flashcards/forex-basics"
import { iccCards } from "@/content/flashcards/icc"
import { marketStructureCards } from "@/content/flashcards/market-structure"
import { professionalForexCards } from "@/content/flashcards/professional-forex"
import { psychologyCards } from "@/content/flashcards/psychology"
import { riskManagementCards } from "@/content/flashcards/risk-management"
import { supportResistanceCards } from "@/content/flashcards/support-resistance"
import { trendSpotterCards } from "@/content/flashcards/trend-spotter"
import { tradingBasicsCards } from "@/content/flashcards/trading-basics"
import type { FlashcardDeck } from "@/lib/flashcards/types"

export const FLASHCARD_DECK_DEFS: Omit<FlashcardDeck, "cardIds">[] = [
  {
    id: "deck-trading-basics",
    slug: "trading-basics",
    title: "Trading Basics",
    description: "Core vocabulary every beginner needs.",
    category: "Foundations",
    difficulty: "beginner",
  },
  {
    id: "deck-candlesticks",
    slug: "candlesticks",
    title: "Candlesticks",
    description: "Read the language of price candles.",
    category: "Foundations",
    difficulty: "beginner",
  },
  {
    id: "deck-market-structure",
    slug: "market-structure",
    title: "Market Structure",
    description: "Swings, trends, and structure breaks.",
    category: "Price Action",
    difficulty: "beginner",
  },
  {
    id: "deck-support-resistance",
    slug: "support-resistance",
    title: "Support & Resistance",
    description: "Levels, flips, and invalidation.",
    category: "Price Action",
    difficulty: "beginner",
  },
  {
    id: "deck-break-retest",
    slug: "break-retest",
    title: "Break & Retest",
    description: "Breakouts, retests, and confirmation.",
    category: "Price Action",
    difficulty: "intermediate",
  },
  {
    id: "deck-icc",
    slug: "icc",
    title: "ICC Strategy",
    description: "Indication, correction, continuation.",
    category: "Strategy",
    difficulty: "intermediate",
  },
  {
    id: "deck-risk-management",
    slug: "risk-management",
    title: "Risk Management",
    description: "Stops, sizing, and account protection.",
    category: "Risk",
    difficulty: "beginner",
  },
  {
    id: "deck-forex-basics",
    slug: "forex-basics",
    title: "Forex Basics",
    description: "Pairs, pips, sessions, and leverage.",
    category: "Forex",
    difficulty: "beginner",
  },
  {
    id: "deck-book-lab",
    slug: "book-lab",
    title: "Day Trading Book Lab",
    description: "Concepts from your Book Lab companion.",
    category: "Book Lab",
    difficulty: "beginner",
  },
  {
    id: "deck-psychology",
    slug: "psychology",
    title: "Trading Psychology",
    description: "Mindset, discipline, and emotional control.",
    category: "Psychology",
    difficulty: "beginner",
  },
  {
    id: "deck-trend-spotter",
    slug: "trend-spotter",
    title: "Trend Spotter",
    description: "Trend, range, structure, and skip discipline.",
    category: "Trend Spotter",
    difficulty: "beginner",
  },
  {
    id: "deck-chart-cards",
    slug: "chart-cards",
    title: "Chart Cards",
    description: "Interactive chart recognition drills.",
    category: "Chart Lab",
    difficulty: "intermediate",
  },
  {
    id: "deck-professional-forex",
    slug: "professional-forex",
    title: "Professional Forex Workflow",
    description: "Context, positioning, strategy selection, and the daily operating system.",
    category: "Professional Forex",
    difficulty: "advanced",
  },
]

export const ALL_FLASHCARD_ARRAYS = [
  tradingBasicsCards,
  candlesticksCards,
  marketStructureCards,
  supportResistanceCards,
  breakRetestCards,
  iccCards,
  riskManagementCards,
  forexBasicsCards,
  bookLabCards,
  psychologyCards,
  trendSpotterCards,
  chartCards,
  professionalForexCards,
]

export const DECK_SLUG_TO_CARDS: Record<string, typeof tradingBasicsCards> = {
  "trading-basics": tradingBasicsCards,
  candlesticks: candlesticksCards,
  "market-structure": marketStructureCards,
  "support-resistance": supportResistanceCards,
  "break-retest": breakRetestCards,
  icc: iccCards,
  "risk-management": riskManagementCards,
  "forex-basics": forexBasicsCards,
  "book-lab": bookLabCards,
  psychology: psychologyCards,
  "trend-spotter": trendSpotterCards,
  "chart-cards": chartCards,
  "professional-forex": professionalForexCards,
}
