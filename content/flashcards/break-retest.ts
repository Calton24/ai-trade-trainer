import { buildBasicCard, buildScenarioCard } from "@/content/flashcards/card-builder"
import type { Flashcard } from "@/lib/flashcards/types"

const D = "break-retest"

export const breakRetestCards: Flashcard[] = [
  buildBasicCard({ deckId: D, slug: "break", front: "What is a break?", back: "Price moves through a key level with momentum.", explanation: "Breaks signal potential continuation or trap.", tags: ["break-retest"] }),
  buildBasicCard({ deckId: D, slug: "retest", front: "What is a retest?", back: "Price returns to the broken level to test it as new support/resistance.", explanation: "Retests offer lower-risk entries than chasing.", tags: ["break-retest"] }),
  buildBasicCard({ deckId: D, slug: "confirmation-br", front: "Confirmation in break & retest?", back: "A bullish/bearish reaction at the retest level.", explanation: "Wait for rejection candle or structure shift.", tags: ["break-retest"] }),
  buildBasicCard({ deckId: D, slug: "failed-retest", front: "Failed retest?", back: "Price breaks back through the level — setup invalid.", explanation: "Exit or skip — the break may have been false.", tags: ["break-retest"] }),
  buildBasicCard({ deckId: D, slug: "entry-zone", front: "Entry zone?", back: "Area near the retest where risk is defined and reward is reasonable.", explanation: "Enter at the level, not miles away.", tags: ["break-retest"] }),
  buildBasicCard({ deckId: D, slug: "stop-placement", front: "Stop placement?", back: "Beyond the level that invalidates the retest idea.", explanation: "Tight stops at obvious levels get hunted.", tags: ["break-retest"] }),
  buildBasicCard({ deckId: D, slug: "target-area", front: "Target area?", back: "Next logical structure level or measured move.", explanation: "Define target before entry for R:R.", tags: ["break-retest"] }),
  buildScenarioCard({ deckId: D, slug: "beginner-mistake", front: "You break above resistance, price immediately reverses back inside. What happened?", back: "Likely a false breakout — you chased without retest confirmation.", explanation: "Wait for retest or confirmation candle.", tags: ["break-retest"] }),
  buildBasicCard({ deckId: D, slug: "clean-retest", front: "Clean retest?", back: "Price tags the broken level once with a clear rejection wick.", explanation: "Clean retests are higher-quality entries.", tags: ["break-retest"] }),
  buildBasicCard({ deckId: D, slug: "chasing", front: "Chasing after the move?", back: "Entering far from your planned level because of FOMO.", explanation: "Chasing worsens R:R and increases stop distance.", tags: ["break-retest"] }),
]
