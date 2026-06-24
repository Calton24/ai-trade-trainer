import type { StrategyMasteryQuestion } from "@/lib/trader-readiness/types"

export const STRATEGY_MASTERY_QUESTIONS: StrategyMasteryQuestion[] = [
  {
    id: "sm-bull-flag-entry",
    strategySlug: "bull-flag",
    question: "What confirms entry on a bull flag setup?",
    options: [
      { id: "a", text: "Break above flag high with volume" },
      { id: "b", text: "Any green candle in the flag" },
      { id: "c", text: "Price touches the 200 MA" },
      { id: "d", text: "RSI above 70" },
    ],
    correctAnswer: "a",
    explanation:
      "Entry is confirmed on a breakout above the flag high, ideally with increased volume showing buyer commitment.",
  },
  {
    id: "sm-bull-flag-stop",
    strategySlug: "bull-flag",
    question: "Where should the stop loss go on a bull flag?",
    options: [
      { id: "a", text: "Below the flag low / consolidation" },
      { id: "b", text: "At breakeven immediately" },
      { id: "c", text: "Above the flag high" },
      { id: "d", text: "50 pips below entry regardless of structure" },
    ],
    correctAnswer: "a",
    explanation:
      "Stop goes below the flag consolidation. If price breaks below, the pattern has failed.",
  },
  {
    id: "sm-breakout-invalidate",
    strategySlug: "break-retest",
    question: "What invalidates a break and retest setup?",
    options: [
      { id: "a", text: "Price closes back below the broken level" },
      { id: "b", text: "Volume is low on the breakout" },
      { id: "c", text: "The retest takes more than 5 candles" },
      { id: "d", text: "Price gaps at open" },
    ],
    correctAnswer: "a",
    explanation:
      "If price closes back below the broken resistance (now support), the role reversal has failed and the setup is invalid.",
  },
  {
    id: "sm-pullback-skip",
    strategySlug: "trend-pullback",
    question: "When should you skip a trend pullback trade?",
    options: [
      { id: "a", text: "When the overall trend is unclear or ranging" },
      { id: "b", text: "When R:R is above 2:1" },
      { id: "c", text: "When volume confirms the pullback" },
      { id: "d", text: "Never — always take pullbacks" },
    ],
    correctAnswer: "a",
    explanation:
      "Pullback trades require a clear trend. In ranging or messy markets, pullbacks are low probability.",
  },
  {
    id: "sm-vwap-target",
    strategySlug: "vwap-bounce",
    question: "Where is a typical target for a VWAP bounce long?",
    options: [
      { id: "a", text: "Prior high of day or next resistance" },
      { id: "b", text: "Always 10 pips" },
      { id: "c", text: "Below VWAP" },
      { id: "d", text: "At the opening price only" },
    ],
    correctAnswer: "a",
    explanation:
      "VWAP bounces target the prior high of day or next structural resistance, depending on market context.",
  },
  {
    id: "sm-orb-entry",
    strategySlug: "opening-range-breakout",
    question: "What confirms an Opening Range Breakout entry?",
    options: [
      { id: "a", text: "Clean break above/below the opening range with volume" },
      { id: "b", text: "First candle of the day is green" },
      { id: "c", text: "Price is at VWAP" },
      { id: "d", text: "Pre-market gap is filled" },
    ],
    correctAnswer: "a",
    explanation:
      "ORB entries need a decisive break of the opening range (first 15–30 min) with volume confirmation.",
  },
  {
    id: "sm-reversal-invalidate",
    strategySlug: "reversal",
    question: "What invalidates a reversal trade?",
    options: [
      { id: "a", text: "Price makes a new extreme beyond the reversal point" },
      { id: "b", text: "Volume decreases slightly" },
      { id: "c", text: "The setup takes 2 hours to form" },
      { id: "d", text: "RSI is at 50" },
    ],
    correctAnswer: "a",
    explanation:
      "If price pushes to a new high (for bearish reversal) or new low (for bullish reversal), the reversal thesis is wrong.",
  },
  {
    id: "sm-support-bounce-stop",
    strategySlug: "support-bounce",
    question: "Where should the stop loss go on a support bounce?",
    options: [
      { id: "a", text: "Below the support level / swing low" },
      { id: "b", text: "At the support level exactly" },
      { id: "c", text: "Above resistance" },
      { id: "d", text: "No stop needed on bounces" },
    ],
    correctAnswer: "a",
    explanation:
      "Stop goes below support. If price breaks through, support has failed and the bounce thesis is invalid.",
  },
]

export function getStrategyMasteryQuestions(
  completedStrategyIds: string[]
): StrategyMasteryQuestion[] {
  if (completedStrategyIds.length === 0) {
    return STRATEGY_MASTERY_QUESTIONS.slice(0, 4)
  }
  return STRATEGY_MASTERY_QUESTIONS
}
