import { buildBasicCard, buildMcCard } from "@/content/flashcards/card-builder"
import type { Flashcard } from "@/lib/flashcards/types"

const D = "risk-management"

export const riskManagementCards: Flashcard[] = [
  buildBasicCard({ deckId: D, slug: "risk-per-trade", front: "Risk per trade?", back: "Fixed dollar or % of account you're willing to lose if stopped.", explanation: "Define before entry — not after.", tags: ["risk"], source: "book-lab" }),
  buildBasicCard({ deckId: D, slug: "stop-loss", front: "Stop loss?", back: "Price level where you exit because the idea failed.", explanation: "Stops cap downside.", tags: ["risk"] }),
  buildBasicCard({ deckId: D, slug: "take-profit", front: "Take profit?", back: "Planned exit when the trade reaches your target.", explanation: "Targets anchor reward.", tags: ["risk"] }),
  buildBasicCard({ deckId: D, slug: "risk-reward", front: "Risk/reward ratio?", back: "Potential loss compared to potential gain.", explanation: "1:2 means risking £1 to make £2.", tags: ["risk"] }),
  buildMcCard({ deckId: D, slug: "one-two-rr", front: "Risking £10 to make £20 is:", back: "1:2 risk/reward", explanation: "Reward is twice the risk.", options: [{ id: "a", text: "1:2 R:R" }, { id: "b", text: "2:1 R:R" }, { id: "c", text: "No ratio" }, { id: "d", text: "Guaranteed win" }], correctAnswer: "a", tags: ["risk"] }),
  buildBasicCard({ deckId: D, slug: "position-sizing", front: "Position sizing?", back: "Share/lot count from risk ÷ stop distance.", explanation: "Wider stop = smaller size for same dollar risk.", tags: ["risk"] }),
  buildBasicCard({ deckId: D, slug: "daily-loss-limit", front: "Daily loss limit?", back: "Max loss after which you stop trading for the day.", explanation: "Prevents revenge spirals.", tags: ["risk"] }),
  buildBasicCard({ deckId: D, slug: "drawdown", front: "Drawdown?", back: "Peak-to-trough decline in account equity.", explanation: "Managing drawdown preserves ability to learn.", tags: ["risk"] }),
  buildBasicCard({ deckId: D, slug: "account-protection", front: "Account protection?", back: "Rules that keep you in the game — size, stops, daily limits.", explanation: "Survival enables skill development.", tags: ["risk"] }),
  buildBasicCard({ deckId: D, slug: "good-trades-lose", front: "Why can good setups still lose?", back: "Edge is statistical — any single trade can fail.", explanation: "Judge process over many trades, not one outcome.", tags: ["risk"] }),
]
