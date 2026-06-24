import type { RiskScenario } from "@/lib/trader-readiness/types"

export const RISK_SCENARIOS: RiskScenario[] = [
  {
    id: "rm-1",
    mode: "manual",
    prompt:
      "Account size: £10,000. Risk: 1%. Stop: 50 pips. Calculate position size in £ risk.",
    accountSize: 10000,
    riskPercent: 1,
    stopPips: 50,
    correctAnswer: 100,
    tolerance: 1,
    explanation:
      "1% of £10,000 = £100 maximum risk per trade. Position size depends on pip value, but the risk amount is £100.",
  },
  {
    id: "rm-2",
    mode: "calculator",
    prompt:
      "Account: £25,000. Risk: 2%. What is the maximum acceptable loss per trade?",
    accountSize: 25000,
    riskPercent: 2,
    correctAnswer: 500,
    tolerance: 1,
    explanation: "2% of £25,000 = £500. Never risk more than this on a single trade.",
  },
  {
    id: "rm-3",
    mode: "guided",
    prompt:
      "Account: £5,000. Current drawdown: 10%. What should the trader avoid?",
    accountSize: 5000,
    drawdownPercent: 10,
    correctAnswer: "increase-risk",
    options: [
      { id: "increase-risk", text: "Increasing risk to recover losses faster" },
      { id: "reduce-size", text: "Reducing position size temporarily" },
      { id: "take-break", text: "Taking a short break to reset" },
      { id: "review-plan", text: "Reviewing the trading plan" },
    ],
    correctOptionId: "increase-risk",
    explanation:
      "After a 10% drawdown, increasing risk is revenge trading behaviour. Reduce size, review the plan, and protect remaining capital.",
  },
  {
    id: "rm-4",
    mode: "manual",
    prompt:
      "Account: £8,000. Risk: 1.5%. What is your maximum risk in £?",
    accountSize: 8000,
    riskPercent: 1.5,
    correctAnswer: 120,
    tolerance: 1,
    explanation: "1.5% of £8,000 = £120 maximum risk per trade.",
  },
]
