import { buildBasicCard, buildScenarioCard } from "@/content/flashcards/card-builder"
import type { Flashcard } from "@/lib/flashcards/types"

const D = "psychology"

export const psychologyCards: Flashcard[] = [
  buildBasicCard({ deckId: D, slug: "fomo", front: "FOMO?", back: "Fear of missing out — entering late because price is moving without a plan.", explanation: "FOMO entries usually have poor R:R.", tags: ["psychology"] }),
  buildBasicCard({ deckId: D, slug: "revenge", front: "Revenge trading?", back: "Trading to recover losses immediately after a stop.", explanation: "Often breaks size and rule limits.", tags: ["psychology"] }),
  buildBasicCard({ deckId: D, slug: "overtrading", front: "Overtrading?", back: "Taking too many trades without A+ setups.", explanation: "Quality beats quantity.", tags: ["psychology"] }),
  buildBasicCard({ deckId: D, slug: "patience", front: "Patience in trading?", back: "Waiting for your setup instead of forcing action.", explanation: "Cash is a position.", tags: ["psychology"] }),
  buildBasicCard({ deckId: D, slug: "discipline", front: "Discipline?", back: "Following your written rules even when emotional.", explanation: "Discipline beats prediction.", tags: ["psychology"] }),
  buildBasicCard({ deckId: D, slug: "confidence-rating", front: "Confidence rating?", back: "Self-score 1–5 on how well you followed your plan.", explanation: "Track confidence in journal, not just P&L.", tags: ["psychology"] }),
  buildBasicCard({ deckId: D, slug: "journaling", front: "Why journal?", back: "Spot recurring mistakes and measure rule adherence.", explanation: "Memory lies; logs don't.", tags: ["psychology"] }),
  buildBasicCard({ deckId: D, slug: "rule-breaking", front: "Rule-breaking?", back: "Deviate from plan — oversize, skip stops, chase.", explanation: "One broken rule often leads to more.", tags: ["psychology"] }),
  buildScenarioCard({ deckId: D, slug: "emotional-state", front: "You just took two stops in a row and feel angry. Best action?", back: "Stop trading, journal, walk away until calm.", explanation: "Emotional state is not a setup.", tags: ["psychology"] }),
  buildBasicCard({ deckId: D, slug: "skip-bad-setups", front: "Skipping bad setups?", back: "Choosing not to trade when criteria aren't met.", explanation: "Best traders take fewer, better trades.", tags: ["psychology"] }),
  buildBasicCard({ deckId: D, slug: "edge-series", front: "Where does an edge show up?", back: "Over a large series of trades — never in any single one.", explanation: "Trade like a casino: small edge, endless repetitions.", tags: ["psychology", "probabilities"] }),
  buildBasicCard({ deckId: D, slug: "resulting", front: "'Resulting'?", back: "Judging a decision by its outcome instead of its quality.", explanation: "A rule-breaking win is still a bad decision that got lucky.", tags: ["psychology", "probabilities"] }),
  buildBasicCard({ deckId: D, slug: "streaks", front: "What do streaks in results mean?", back: "Usually nothing — random processes produce streaks constantly.", explanation: "Five losses at a 50% win rate is routine. Change nothing.", tags: ["psychology", "probabilities"] }),
  buildBasicCard({ deckId: D, slug: "hope-trading", front: "Hope trading?", back: "Holding past invalidation because it 'might come back'.", explanation: "Past the stop level, analysis is gone — only wishing remains.", tags: ["psychology", "emotions"] }),
  buildBasicCard({ deckId: D, slug: "overconfidence", front: "Why are winning streaks dangerous?", back: "Risk creeps up and setups loosen — the normal loss then erases weeks.", explanation: "Audit yourself after wins, not just losses.", tags: ["psychology", "emotions"] }),
  buildBasicCard({ deckId: D, slug: "urgency-tell", front: "The tell of a revenge trade?", back: "Urgency — real setups never need to happen RIGHT NOW.", explanation: "If a trade feels urgent, the urgency is the loss talking.", tags: ["psychology", "emotions"] }),
  buildBasicCard({ deckId: D, slug: "state-check", front: "First step of a trading day?", back: "Decide IF you should trade — sleep, stress, and state check.", explanation: "A degraded trader turns perfect setups into bad trades.", tags: ["psychology", "habits"] }),
  buildBasicCard({ deckId: D, slug: "trade-wait-skip", front: "The three verdicts on any chart?", back: "Trade (fully qualified), Wait (incomplete), Skip (disqualified).", explanation: "Wait and Skip are where professionals make their money.", tags: ["psychology", "decisions"] }),
]
