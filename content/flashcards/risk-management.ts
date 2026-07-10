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
  buildBasicCard({ deckId: D, slug: "sizing-formula", front: "Position sizing formula?", back: "Lots = (Account × Risk%) ÷ (Stop pips × Pip value per lot).", explanation: "$10,000 × 1% ÷ (25 × $10) = 0.40 lots.", tags: ["risk", "sizing"] }),
  buildBasicCard({ deckId: D, slug: "recover-50", front: "Gain needed to recover a 50% loss?", back: "100% — you must double what's left.", explanation: "Drawdown math is asymmetric; keep losses small.", tags: ["risk", "drawdown"] }),
  buildBasicCard({ deckId: D, slug: "invalidation", front: "Invalidation point?", back: "The price where your trade idea is objectively wrong — where the stop belongs.", explanation: "Never place stops by comfort or fixed distance.", tags: ["risk", "stops"] }),
  buildBasicCard({ deckId: D, slug: "atr-stop", front: "ATR and stops?", back: "Keep stops beyond the average candle range so noise can't hit them.", explanation: "A 10-pip stop inside an 18-pip ATR dies to randomness.", tags: ["risk", "stops"] }),
  buildBasicCard({ deckId: D, slug: "expectancy", front: "Expectancy formula?", back: "(Win% × avg win R) − (Loss% × 1R).", explanation: "40% win rate at 1:2 = +0.2R per trade — profitable while losing more often than winning.", tags: ["risk", "expectancy"] }),
  buildBasicCard({ deckId: D, slug: "break-even-winrate", front: "Break-even win rate at 1:2?", back: "About 34% — one win covers two losses.", explanation: "Break-even win rate = 1 ÷ (1 + R).", tags: ["risk", "expectancy"] }),
  buildBasicCard({ deckId: D, slug: "never-move-stop", front: "Can you move a stop away from price?", back: "Never. Stops only move toward profit.", explanation: "Moving stops away converts planned 1R losses into disasters.", tags: ["risk", "rules"] }),
  buildBasicCard({ deckId: D, slug: "rule-one", front: "Rule #1 of professional trading?", back: "Protect your capital — survive first, grow second.", explanation: "Every other rule serves this one.", tags: ["risk", "rules"] }),
]
