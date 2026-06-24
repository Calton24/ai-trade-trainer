import { buildBasicCard, buildMcCard } from "@/content/flashcards/card-builder"
import type { Flashcard } from "@/lib/flashcards/types"

const D = "market-structure"

export const marketStructureCards: Flashcard[] = [
  buildBasicCard({ deckId: D, slug: "swing-high", front: "What is a swing high?", back: "A local peak with lower highs on both sides.", explanation: "Swing highs help map resistance and trend.", tags: ["structure"] }),
  buildBasicCard({ deckId: D, slug: "swing-low", front: "What is a swing low?", back: "A local valley with higher lows on both sides.", explanation: "Swing lows help map support and trend.", tags: ["structure"] }),
  buildBasicCard({ deckId: D, slug: "higher-high", front: "What is a higher high (HH)?", back: "A peak above the previous peak.", explanation: "HHs suggest bullish structure.", tags: ["structure"] }),
  buildBasicCard({ deckId: D, slug: "higher-low", front: "What is a higher low (HL)?", back: "A valley above the previous valley.", explanation: "HLs confirm buyers defending dips.", tags: ["structure"] }),
  buildBasicCard({ deckId: D, slug: "lower-high", front: "What is a lower high (LH)?", back: "A peak below the previous peak.", explanation: "LHs suggest weakening bullish structure.", tags: ["structure"] }),
  buildBasicCard({ deckId: D, slug: "lower-low", front: "What is a lower low (LL)?", back: "A valley below the previous valley.", explanation: "LLs confirm bearish structure.", tags: ["structure"] }),
  buildBasicCard({ deckId: D, slug: "uptrend", front: "What defines an uptrend?", back: "Series of higher highs and higher lows.", explanation: "Trade with the trend or wait for clear reversal.", tags: ["structure"] }),
  buildBasicCard({ deckId: D, slug: "downtrend", front: "What defines a downtrend?", back: "Series of lower highs and lower lows.", explanation: "Fighting the trend without a plan increases risk.", tags: ["structure"] }),
  buildBasicCard({ deckId: D, slug: "range", front: "What is a range?", back: "Price oscillating between similar highs and lows without clear direction.", explanation: "Ranges favour mean-reversion strategies over breakout chasing.", tags: ["structure"] }),
  buildMcCard({ deckId: D, slug: "structure-break", front: "A structure break means:", back: "Price breaks a key swing level, potentially changing trend.", explanation: "Break of structure can signal trend shift or trap.", options: [{ id: "a", text: "Price breaks a key swing level" }, { id: "b", text: "One red candle appears" }, { id: "c", text: "Volume is always low" }, { id: "d", text: "Guaranteed reversal" }], correctAnswer: "a", tags: ["structure"] }),
]
