import { buildBasicCard, buildTfCard } from "@/content/flashcards/card-builder"
import type { Flashcard } from "@/lib/flashcards/types"

const D = "support-resistance"

export const supportResistanceCards: Flashcard[] = [
  buildBasicCard({ deckId: D, slug: "support", front: "What is support?", back: "A price zone where buyers repeatedly step in.", explanation: "Support acts like a floor until it breaks.", tags: ["levels"] }),
  buildBasicCard({ deckId: D, slug: "resistance", front: "What is resistance?", back: "A price zone where sellers repeatedly appear.", explanation: "Resistance acts like a ceiling until it breaks.", tags: ["levels"] }),
  buildBasicCard({ deckId: D, slug: "s-r-flip", front: "Support becoming resistance?", back: "After support breaks, old support often acts as resistance on retests.", explanation: "Classic role reversal after breakdown.", tags: ["levels"] }),
  buildBasicCard({ deckId: D, slug: "r-s-flip", front: "Resistance becoming support?", back: "After resistance breaks, old resistance often acts as support on pullbacks.", explanation: "Breakout buyers defend the old ceiling.", tags: ["levels"] }),
  buildBasicCard({ deckId: D, slug: "tested-level", front: "What is a tested level?", back: "A level price has touched multiple times.", explanation: "More tests can weaken or strengthen depending on reaction.", tags: ["levels"] }),
  buildBasicCard({ deckId: D, slug: "weak-level", front: "What makes a level weak?", back: "Few touches, unclear reactions, or inside noisy chop.", explanation: "Weak levels break easily — stops must account for that.", tags: ["levels"] }),
  buildBasicCard({ deckId: D, slug: "strong-level", front: "What makes a level strong?", back: "Multiple clean rejections with clear wicks and volume.", explanation: "Strong levels deserve respect until proven broken.", tags: ["levels"] }),
  buildBasicCard({ deckId: D, slug: "liquidity-levels", front: "Liquidity around levels?", back: "Stops and orders cluster near obvious highs/lows.", explanation: "Markets often sweep liquidity before reversing.", tags: ["levels"] }),
  buildTfCard({ deckId: D, slug: "false-breakout", front: "A false breakout closes back inside the range.", back: "True", correctAnswer: "true", explanation: "Price pierces a level then fails — trapping breakout traders.", tags: ["levels"] }),
  buildBasicCard({ deckId: D, slug: "invalidation", front: "Level invalidation?", back: "When price closes convincingly beyond your level, the idea is wrong.", explanation: "Invalidation defines where your stop belongs.", tags: ["levels"] }),
]
