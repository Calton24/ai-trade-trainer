import type {
  KnowledgeQuestion,
  ReadinessPillarDefinition,
} from "@/lib/trader-readiness/types"

export const TRADER_READINESS_DISCLAIMER =
  "Educational diagnostic only. Not financial advice. Results reflect learning progress, not trading ability in live markets."

export const READINESS_PILLARS: ReadinessPillarDefinition[] = [
  {
    id: "market-knowledge",
    title: "Market Knowledge",
    description: "Conceptual understanding of markets, trends, and trading principles.",
    icon: "🧠",
    estimatedMinutes: 8,
  },
  {
    id: "chart-reading",
    title: "Chart Reading",
    description: "Interactive chart recognition — trends, levels, breakouts, and retests.",
    icon: "📈",
    estimatedMinutes: 6,
  },
  {
    id: "trade-selection",
    title: "Trade Selection",
    description: "Filter quality setups from poor ones and justify your decisions.",
    icon: "🎯",
    estimatedMinutes: 7,
  },
  {
    id: "risk-management",
    title: "Risk Management",
    description: "Position sizing, drawdown awareness, and capital protection.",
    icon: "🛡️",
    estimatedMinutes: 6,
  },
  {
    id: "psychology",
    title: "Trading Psychology",
    description: "Discipline, emotional control, and process-oriented decision making.",
    icon: "🧘",
    estimatedMinutes: 5,
  },
  {
    id: "journal-analysis",
    title: "Journal Analysis",
    description: "Identify mistakes and patterns in sample trade journals.",
    icon: "📓",
    estimatedMinutes: 5,
  },
  {
    id: "strategy-mastery",
    title: "Strategy Mastery",
    description: "Entry rules, invalidation, stops, and targets for each strategy.",
    icon: "⚔️",
    estimatedMinutes: 10,
    requiresStrategyCompletion: true,
  },
]

export function getPillarById(id: string): ReadinessPillarDefinition {
  return (
    READINESS_PILLARS.find((p) => p.id === id) ?? READINESS_PILLARS[0]
  )
}

export const MARKET_KNOWLEDGE_QUESTIONS: KnowledgeQuestion[] = [
  {
    id: "mk-1",
    type: "multiple-choice",
    question: "What defines an uptrend?",
    options: [
      { id: "a", text: "Higher highs and higher lows" },
      { id: "b", text: "Price above the 200 MA only" },
      { id: "c", text: "Three green candles in a row" },
      { id: "d", text: "Volume increasing every bar" },
    ],
    correctAnswer: "a",
    explanation:
      "An uptrend is defined by a series of higher highs (HH) and higher lows (HL). Moving averages can confirm but do not define the trend.",
    lessonHref: "/trend-spotter/lessons/what-is-a-trend",
  },
  {
    id: "mk-2",
    type: "multiple-choice",
    question: "Which matters more for long-term profitability?",
    options: [
      { id: "a", text: "Win rate above 70%" },
      { id: "b", text: "Expectancy over win rate" },
      { id: "c", text: "Number of trades per day" },
      { id: "d", text: "Following the news" },
    ],
    correctAnswer: "b",
    explanation:
      "Expectancy (average win × win rate − average loss × loss rate) determines profitability. A 40% win rate with 3:1 R:R can be highly profitable.",
    lessonHref: "/book-lab/risk-money-management",
  },
  {
    id: "mk-3",
    type: "multiple-choice",
    question:
      "What happens if risk per trade increases from 1% to 5% on the same strategy?",
    options: [
      { id: "a", text: "Profits scale linearly with no downside" },
      { id: "b", text: "Drawdowns grow dramatically; fewer losses wipe the account" },
      { id: "c", text: "Win rate automatically improves" },
      { id: "d", text: "Nothing changes if the strategy is profitable" },
    ],
    correctAnswer: "b",
    explanation:
      "Higher risk per trade amplifies both gains and losses. A losing streak at 5% risk can destroy an account in a handful of trades.",
    lessonHref: "/book-lab/risk-money-management",
  },
  {
    id: "mk-4",
    type: "true-false",
    question: "A break and retest confirms that old resistance may act as new support.",
    options: [
      { id: "true", text: "True" },
      { id: "false", text: "False" },
    ],
    correctAnswer: "true",
    explanation:
      "After price breaks above resistance, a pullback to that level that holds (retest) is a classic confirmation of role reversal.",
    lessonHref: "/strategy-wiki/break-retest",
    chartScenarioId: "task-break-retest",
  },
  {
    id: "mk-5",
    type: "multiple-choice",
    question: "What is the primary purpose of a stop loss?",
    options: [
      { id: "a", text: "Guarantee a winning trade" },
      { id: "b", text: "Define maximum acceptable loss on a trade" },
      { id: "c", text: "Avoid paying commissions" },
      { id: "d", text: "Lock in profits immediately" },
    ],
    correctAnswer: "b",
    explanation:
      "A stop loss caps your downside on any single trade. It is a risk management tool, not a profit guarantee.",
    lessonHref: "/book-lab/risk-money-management",
  },
  {
    id: "mk-6",
    type: "fill-blank",
    question:
      "In an ICC model, the three phases are Indication, Correction, and ______.",
    correctAnswer: "continuation",
    explanation:
      "ICC stands for Indication-Correction-Continuation. The continuation phase is where traders look for entry in the trend direction.",
    lessonHref: "/strategy-wiki/icc",
  },
]
