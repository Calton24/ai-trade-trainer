import type { PsychologyScenario } from "@/lib/trader-readiness/types"

export const PSYCHOLOGY_SCENARIOS: PsychologyScenario[] = [
  {
    id: "psy-1",
    situation:
      "You lose 4 trades in a row. Your strategy remains profitable over 100+ trades. What do you do?",
    options: [
      { id: "increase-risk", text: "Increase risk to recover faster", score: 10 },
      { id: "skip", text: "Skip the next trade entirely", score: 40 },
      { id: "change-strategy", text: "Change strategy immediately", score: 15 },
      { id: "follow-plan", text: "Follow the trading plan — next valid setup only", score: 100 },
    ],
    bestOptionId: "follow-plan",
    explanation:
      "Variance is normal. A profitable strategy will have losing streaks. Trust the process, follow your plan, and take only valid setups.",
    traits: ["Discipline", "Process thinking", "Long-term thinking"],
  },
  {
    id: "psy-2",
    situation:
      "You see a stock ripping 5% in 10 minutes. You have no plan for this setup. What do you do?",
    options: [
      { id: "fomo-enter", text: "Enter immediately — don't miss the move", score: 5 },
      { id: "watch", text: "Watch and journal what you observe", score: 70 },
      { id: "skip", text: "Skip — no plan means no trade", score: 100 },
      { id: "half-size", text: "Enter with half size just in case", score: 20 },
    ],
    bestOptionId: "skip",
    explanation:
      "FOMO trades have no edge. If it's not in your plan, it's not your trade. Journal the move for learning instead.",
    traits: ["Emotional control", "Patience", "Discipline"],
  },
  {
    id: "psy-3",
    situation:
      "You're up 3R on a trade. Your target is 4R but price is stalling. What do you do?",
    options: [
      { id: "hold-target", text: "Hold for full 4R target per plan", score: 80 },
      { id: "close-all", text: "Close entire position at 3R", score: 60 },
      { id: "trail", text: "Trail stop to lock in 2R, let rest run", score: 100 },
      { id: "add", text: "Add to the winner", score: 25 },
    ],
    bestOptionId: "trail",
    explanation:
      "Trailing a stop protects profits while allowing upside. This balances discipline with flexibility.",
    traits: ["Consistency", "Process thinking"],
  },
  {
    id: "psy-4",
    situation:
      "It's 30 minutes before market close. You're down 1R today and see a marginal setup. What do you do?",
    options: [
      { id: "take-it", text: "Take it — need to get back to breakeven", score: 10 },
      { id: "skip", text: "Skip — marginal setup near close", score: 100 },
      { id: "smaller", text: "Take with smaller size", score: 35 },
      { id: "revenge", text: "Take a different setup you're more confident in", score: 30 },
    ],
    bestOptionId: "skip",
    explanation:
      "End-of-day marginal setups combined with being down for the day is a revenge trading trap. Protect your capital.",
    traits: ["Emotional control", "Discipline", "Patience"],
  },
]
