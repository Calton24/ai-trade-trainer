import { buildBasicCard, buildMcCard } from "@/content/flashcards/card-builder"
import type { Flashcard } from "@/lib/flashcards/types"

const D = "icc"

export const iccCards: Flashcard[] = [
  buildBasicCard({ deckId: D, slug: "indication", front: "ICC: Indication", back: "Higher-timeframe bias showing likely direction.", explanation: "Indication sets which side you favour.", tags: ["icc"], source: "paths" }),
  buildBasicCard({ deckId: D, slug: "correction", front: "ICC: Correction", back: "Pullback against the indication move.", explanation: "Corrections offer better entries than chasing.", tags: ["icc"], source: "paths" }),
  buildBasicCard({ deckId: D, slug: "continuation", front: "ICC: Continuation", back: "Move resuming in the indication direction after correction.", explanation: "Continuation is the trigger phase.", tags: ["icc"], source: "paths" }),
  buildBasicCard({ deckId: D, slug: "htf-bias", front: "Higher timeframe bias?", back: "The dominant trend or structure on a larger chart.", explanation: "Trade in line with HTF bias when possible.", tags: ["icc"] }),
  buildBasicCard({ deckId: D, slug: "ltf-confirm", front: "Lower timeframe confirmation?", back: "Entry trigger on a smaller chart aligning with HTF.", explanation: "LTF fine-tunes timing.", tags: ["icc"] }),
  buildBasicCard({ deckId: D, slug: "bullish-icc", front: "Bullish ICC sequence?", back: "Indication up → correction down → continuation up.", explanation: "Look for longs after correction exhausts.", tags: ["icc"] }),
  buildBasicCard({ deckId: D, slug: "bearish-icc", front: "Bearish ICC sequence?", back: "Indication down → correction up → continuation down.", explanation: "Look for shorts after correction exhausts.", tags: ["icc"] }),
  buildBasicCard({ deckId: D, slug: "correction-exhaust", front: "Correction exhaustion?", back: "Pullback loses momentum — smaller candles, support/resistance holds.", explanation: "Signals correction may be ending.", tags: ["icc"] }),
  buildBasicCard({ deckId: D, slug: "continuation-trigger", front: "Continuation trigger?", back: "Break of correction structure in indication direction.", explanation: "Often a break of correction high/low.", tags: ["icc"] }),
  buildMcCard({ deckId: D, slug: "invalidation", front: "ICC setup invalidates when:", back: "Correction breaks indication structure.", explanation: "If correction goes too deep, bias may have changed.", options: [{ id: "a", text: "Correction breaks indication structure" }, { id: "b", text: "One small red candle" }, { id: "c", text: "Market opens" }, { id: "d", text: "You feel unsure" }], correctAnswer: "a", tags: ["icc"] }),
]
