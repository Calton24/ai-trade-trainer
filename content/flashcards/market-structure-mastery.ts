import { buildBasicCard } from "@/content/flashcards/card-builder"
import type { Flashcard } from "@/lib/flashcards/types"

const D = "market-structure-mastery"

/** Flashcards for the Market Structure Mastery path. */
export const marketStructureMasteryCards: Flashcard[] = [
  buildBasicCard({ deckId: D, slug: "hh", front: "Higher High (HH)?", back: "A swing high above the previous swing high.", explanation: "HHs build the ceiling of an uptrend.", tags: ["structure"] }),
  buildBasicCard({ deckId: D, slug: "hl", front: "Higher Low (HL)?", back: "A swing low above the previous swing low.", explanation: "The key uptrend signal — the first lower low is the first warning.", tags: ["structure"] }),
  buildBasicCard({ deckId: D, slug: "lh", front: "Lower High (LH)?", back: "A swing high below the previous swing high.", explanation: "LHs are the ceiling of a downtrend.", tags: ["structure"] }),
  buildBasicCard({ deckId: D, slug: "ll", front: "Lower Low (LL)?", back: "A swing low below the previous swing low.", explanation: "The key downtrend signal.", tags: ["structure"] }),
  buildBasicCard({ deckId: D, slug: "uptrend", front: "Uptrend structure?", back: "Higher Highs + Higher Lows.", explanation: "A rising staircase — buyers in control.", tags: ["structure", "trend"] }),
  buildBasicCard({ deckId: D, slug: "downtrend", front: "Downtrend structure?", back: "Lower Highs + Lower Lows.", explanation: "A falling staircase — sellers in control.", tags: ["structure", "trend"] }),
  buildBasicCard({ deckId: D, slug: "range", front: "Range?", back: "Highs and lows roughly equal — no net progress.", explanation: "No trend to follow; most professionals stand aside.", tags: ["structure", "trend"] }),
  buildBasicCard({ deckId: D, slug: "transition", front: "Transition?", back: "Structure breaking — an uptrend's first LL or a downtrend's first HH.", explanation: "The bridge between trends; investigate before trading.", tags: ["structure", "trend"] }),
  buildBasicCard({ deckId: D, slug: "four-point-rule", front: "The four-point rule?", back: "Read the latest four swings — four agreeing points confirm a trend.", explanation: "You don't need the whole chart, just the last four turning points.", tags: ["structure"] }),
  buildBasicCard({ deckId: D, slug: "continuation", front: "Continuation?", back: "The trend resumes — structure stays intact (another HH/HL in an uptrend).", explanation: "Trading with the established direction.", tags: ["structure", "continuation"] }),
  buildBasicCard({ deckId: D, slug: "reversal", front: "Reversal?", back: "The trend turns — structure breaks (first LL in an uptrend / first HH in a downtrend).", explanation: "One broken swing is a warning; demand confirmation before committing.", tags: ["structure", "reversal"] }),
  buildBasicCard({ deckId: D, slug: "impulse", front: "Phase 1 (impulse)?", back: "The strong, decisive leg moving WITH the trend.", explanation: "The real direction — but never chase it mid-move.", tags: ["structure", "phases"] }),
  buildBasicCard({ deckId: D, slug: "pullback", front: "Phase 2 (pullback)?", back: "The corrective drift against the trend on smaller candles.", explanation: "Preparation time, not entry time. Enter as the next Phase 1 begins.", tags: ["structure", "phases"] }),
  buildBasicCard({ deckId: D, slug: "strong-trend", front: "Strong trend signs?", back: "Decisive impulses, shallow pullbacks, clean HH/HL.", explanation: "High-confidence continuations come from strong trends.", tags: ["structure", "quality"] }),
  buildBasicCard({ deckId: D, slug: "weak-trend", front: "Weak / late trend signs?", back: "Deep pullbacks that nearly break structure, feeble breaks of prior swings.", explanation: "The market whispering the trend is tiring.", tags: ["structure", "quality"] }),
  buildBasicCard({ deckId: D, slug: "no-trade", front: "When is 'No Trade' the best answer?", back: "Ranges, broken continuation theses, unconfirmed triggers, or transition.", explanation: "Skipping is a high-quality decision, not a missed opportunity.", tags: ["structure", "decisions"] }),
]
