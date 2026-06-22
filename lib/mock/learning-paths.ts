import type { LearningPath, SyllabusItem } from "@/lib/types"

export const learningPaths: LearningPath[] = [
  {
    id: "trading-foundations",
    title: "Trading Foundations",
    description:
      "Learn the absolute basics of trading, chart reading, market structure, and risk.",
    difficulty: "beginner",
    estimatedHours: 8,
    moduleCount: 10,
    quizCount: 2,
    drillCount: 1,
    progressPercent: 0,
    locked: false,
    skillsYouGain: [
      "Read candlestick charts",
      "Identify market structure",
      "Understand risk/reward basics",
      "Follow beginner trading rules",
    ],
    whatYouLearn: [
      "What trading is and how markets move",
      "How to read candlesticks",
      "Trends, support, and resistance",
      "Basic risk management principles",
    ],
    relatedPathIds: ["price-action", "risk-management"],
  },
  {
    id: "forex-basics",
    title: "Forex Basics",
    description:
      "Understand currency pairs, pips, lots, spreads, sessions, and leverage.",
    difficulty: "beginner",
    estimatedHours: 6,
    moduleCount: 10,
    quizCount: 2,
    drillCount: 1,
    progressPercent: 0,
    locked: false,
    skillsYouGain: [
      "Read currency pairs",
      "Calculate pips and position size",
      "Understand trading sessions",
      "Apply forex risk rules",
    ],
    whatYouLearn: [
      "How the forex market works",
      "Pips, lots, and spreads explained",
      "London, New York, and Asia sessions",
      "Leverage and margin basics",
    ],
    relatedPathIds: ["trading-foundations", "risk-management"],
  },
  {
    id: "price-action",
    title: "Price Action Fundamentals",
    description:
      "Learn candlesticks, support and resistance, trends, breakouts, fakeouts, and retests.",
    difficulty: "beginner",
    estimatedHours: 10,
    moduleCount: 12,
    quizCount: 1,
    drillCount: 4,
    progressPercent: 0,
    locked: false,
    skillsYouGain: [
      "Mark support and resistance",
      "Spot trends and ranges",
      "Identify breakouts vs fakeouts",
      "Trade Break & Retest setups",
    ],
    whatYouLearn: [
      "Pure price action reading",
      "Swing highs and swing lows",
      "Breakout and fakeout patterns",
      "The Break & Retest setup",
    ],
    relatedPathIds: ["trading-foundations", "icc-strategy"],
  },
  {
    id: "icc-strategy",
    title: "ICC Strategy Path",
    description:
      "Learn the Indication, Correction, Continuation strategy step by step using structure and confirmation.",
    difficulty: "beginner-intermediate",
    estimatedHours: 12,
    moduleCount: 13,
    quizCount: 1,
    drillCount: 4,
    progressPercent: 0,
    locked: false,
    skillsYouGain: [
      "Identify ICC phases on charts",
      "Use higher timeframe bias",
      "Confirm entries on lower timeframes",
      "Apply ICC setup checklist",
    ],
    whatYouLearn: [
      "Indication: spotting the market push",
      "Correction: waiting for the pullback",
      "Continuation: confirming the entry zone",
      "Multi-timeframe ICC analysis",
    ],
    relatedPathIds: ["price-action", "risk-management"],
  },
  {
    id: "risk-management",
    title: "Risk Management Mastery",
    description:
      "Learn position sizing, risk/reward, stop losses, drawdown, and account protection.",
    difficulty: "beginner",
    estimatedHours: 7,
    moduleCount: 10,
    quizCount: 1,
    drillCount: 1,
    progressPercent: 0,
    locked: true,
    skillsYouGain: [
      "Calculate position size",
      "Set stop loss and take profit",
      "Understand risk/reward ratios",
      "Manage drawdown and losing streaks",
    ],
    whatYouLearn: [
      "Why risk management matters most",
      "Account size and risk percentage",
      "Stop loss and take profit placement",
      "Building personal risk rules",
    ],
    relatedPathIds: ["trading-foundations", "trading-psychology"],
  },
  {
    id: "trading-psychology",
    title: "Trading Psychology",
    description:
      "Build discipline, patience, emotional control, journaling habits, and rule-based execution.",
    difficulty: "beginner",
    estimatedHours: 6,
    moduleCount: 11,
    quizCount: 2,
    drillCount: 0,
    progressPercent: 0,
    locked: true,
    skillsYouGain: [
      "Control FOMO and revenge trading",
      "Build journaling habits",
      "Create personal trading rules",
      "Maintain discipline under pressure",
    ],
    whatYouLearn: [
      "Why traders lose discipline",
      "Patience and waiting for setups",
      "Managing emotions after wins and losses",
      "Building a rule-based trading plan",
    ],
    relatedPathIds: ["risk-management", "trading-foundations"],
  },
]

function syllabus(
  pathId: string,
  items: Omit<SyllabusItem, "pathId">[]
): SyllabusItem[] {
  return items.map((item) => ({ ...item, pathId }))
}

export const pathSyllabus: SyllabusItem[] = [
  ...syllabus("trading-foundations", [
    { id: "tf-1", order: 1, title: "What is Trading?", type: "lesson", estimatedMinutes: 15, locked: false, completed: false, linkedId: "what-is-trading" },
    { id: "tf-2", order: 2, title: "What Moves Markets?", type: "lesson", estimatedMinutes: 15, locked: false, completed: false, linkedId: "what-moves-markets" },
    { id: "tf-3", order: 3, title: "Understanding Candlesticks", type: "lesson", estimatedMinutes: 20, locked: false, completed: false, linkedId: "candlesticks-101" },
    { id: "tf-4", order: 4, title: "Candlestick Quiz", type: "quiz", estimatedMinutes: 10, locked: false, completed: false, linkedId: "candlestick-basics-quiz" },
    { id: "tf-5", order: 5, title: "Market Structure Basics", type: "lesson", estimatedMinutes: 20, locked: false, completed: false, linkedId: "market-structure-101" },
    { id: "tf-6", order: 6, title: "Identify Trend Direction", type: "drill", estimatedMinutes: 15, locked: false, completed: false, linkedId: "drill-trend" },
    { id: "tf-7", order: 7, title: "Support and Resistance Basics", type: "lesson", estimatedMinutes: 20, locked: false, completed: false, linkedId: "support-resistance-101" },
    { id: "tf-8", order: 8, title: "Risk and Reward Introduction", type: "lesson", estimatedMinutes: 15, locked: false, completed: false, linkedId: "risk-reward-101" },
    { id: "tf-9", order: 9, title: "Beginner Trading Rules", type: "reflection", estimatedMinutes: 10, locked: false, completed: false },
    { id: "tf-10", order: 10, title: "Foundations Final Quiz", type: "quiz", estimatedMinutes: 15, locked: false, completed: false, linkedId: "foundations-final-quiz" },
  ]),
  ...syllabus("forex-basics", [
    { id: "fx-1", order: 1, title: "What is Forex?", type: "lesson", estimatedMinutes: 15, locked: false, completed: false, linkedId: "what-is-forex" },
    { id: "fx-2", order: 2, title: "Currency Pairs Explained", type: "lesson", estimatedMinutes: 15, locked: false, completed: false },
    { id: "fx-3", order: 3, title: "Pips, Lots, and Position Size", type: "lesson", estimatedMinutes: 20, locked: false, completed: false },
    { id: "fx-4", order: 4, title: "Spread and Fees", type: "lesson", estimatedMinutes: 15, locked: false, completed: false },
    { id: "fx-5", order: 5, title: "Trading Sessions: London, New York, Asia", type: "lesson", estimatedMinutes: 20, locked: false, completed: false },
    { id: "fx-6", order: 6, title: "Leverage and Margin", type: "lesson", estimatedMinutes: 20, locked: false, completed: false },
    { id: "fx-7", order: 7, title: "Forex Terms Quiz", type: "quiz", estimatedMinutes: 10, locked: false, completed: false, linkedId: "forex-terms-quiz" },
    { id: "fx-8", order: 8, title: "Mark Session Volatility", type: "drill", estimatedMinutes: 15, locked: false, completed: false, linkedId: "drill-trend" },
    { id: "fx-9", order: 9, title: "Beginner Forex Risk Rules", type: "reflection", estimatedMinutes: 10, locked: false, completed: false },
    { id: "fx-10", order: 10, title: "Forex Basics Final Quiz", type: "quiz", estimatedMinutes: 15, locked: false, completed: false, linkedId: "forex-final-quiz" },
  ]),
  ...syllabus("price-action", [
    { id: "pa-1", order: 1, title: "What is Price Action?", type: "lesson", estimatedMinutes: 15, locked: false, completed: false, linkedId: "what-is-price-action" },
    { id: "pa-2", order: 2, title: "Bullish and Bearish Candles", type: "lesson", estimatedMinutes: 15, locked: false, completed: false, linkedId: "candlesticks-101" },
    { id: "pa-3", order: 3, title: "Swing Highs and Swing Lows", type: "lesson", estimatedMinutes: 20, locked: false, completed: false },
    { id: "pa-4", order: 4, title: "Trends and Ranges", type: "lesson", estimatedMinutes: 20, locked: false, completed: false, linkedId: "market-structure-101" },
    { id: "pa-5", order: 5, title: "Support and Resistance", type: "lesson", estimatedMinutes: 20, locked: false, completed: false, linkedId: "support-resistance-101" },
    { id: "pa-6", order: 6, title: "Identify Support", type: "drill", estimatedMinutes: 15, locked: false, completed: false, linkedId: "drill-support" },
    { id: "pa-7", order: 7, title: "Identify Resistance", type: "drill", estimatedMinutes: 15, locked: false, completed: false, linkedId: "drill-resistance" },
    { id: "pa-8", order: 8, title: "Breakouts vs Fakeouts", type: "lesson", estimatedMinutes: 20, locked: false, completed: false, linkedId: "breakouts-fakeouts-101" },
    { id: "pa-9", order: 9, title: "Break and Retest", type: "lesson", estimatedMinutes: 25, locked: false, completed: false, linkedId: "break-retest-101" },
    { id: "pa-10", order: 10, title: "Mark the Break and Retest", type: "drill", estimatedMinutes: 20, locked: false, completed: false, linkedId: "drill-full-setup" },
    { id: "pa-11", order: 11, title: "Price Action Quiz", type: "quiz", estimatedMinutes: 15, locked: false, completed: false, linkedId: "break-retest-quiz" },
    { id: "pa-12", order: 12, title: "Price Action Review", type: "reflection", estimatedMinutes: 10, locked: false, completed: false },
  ]),
  ...syllabus("icc-strategy", [
    { id: "icc-1", order: 1, title: "What is ICC?", type: "lesson", estimatedMinutes: 20, locked: false, completed: false, linkedId: "what-is-icc" },
    { id: "icc-2", order: 2, title: "Indication: Spotting the Market Push", type: "lesson", estimatedMinutes: 20, locked: false, completed: false },
    { id: "icc-3", order: 3, title: "Correction: Waiting for the Pullback", type: "lesson", estimatedMinutes: 20, locked: false, completed: false },
    { id: "icc-4", order: 4, title: "Continuation: Confirming the Entry Zone", type: "lesson", estimatedMinutes: 20, locked: false, completed: false },
    { id: "icc-5", order: 5, title: "Higher Timeframe Bias", type: "lesson", estimatedMinutes: 25, locked: false, completed: false },
    { id: "icc-6", order: 6, title: "Lower Timeframe Confirmation", type: "lesson", estimatedMinutes: 25, locked: false, completed: false },
    { id: "icc-7", order: 7, title: "Identify the Indication", type: "drill", estimatedMinutes: 15, locked: false, completed: false, linkedId: "drill-break" },
    { id: "icc-8", order: 8, title: "Mark the Correction", type: "drill", estimatedMinutes: 15, locked: false, completed: false, linkedId: "drill-retest" },
    { id: "icc-9", order: 9, title: "Confirm the Continuation", type: "drill", estimatedMinutes: 15, locked: false, completed: false, linkedId: "drill-full-setup" },
    { id: "icc-10", order: 10, title: "ICC Setup Checklist", type: "lesson", estimatedMinutes: 15, locked: false, completed: false },
    { id: "icc-11", order: 11, title: "ICC Beginner Quiz", type: "quiz", estimatedMinutes: 15, locked: false, completed: false, linkedId: "icc-beginner-quiz" },
    { id: "icc-12", order: 12, title: "ICC Full Setup Practice", type: "drill", estimatedMinutes: 20, locked: false, completed: false, linkedId: "drill-full-setup" },
    { id: "icc-13", order: 13, title: "ICC Trade Reflection", type: "reflection", estimatedMinutes: 10, locked: false, completed: false },
  ]),
  ...syllabus("risk-management", [
    { id: "rm-1", order: 1, title: "Why Risk Management Matters", type: "lesson", estimatedMinutes: 15, locked: true, completed: false },
    { id: "rm-2", order: 2, title: "Account Size and Risk Percentage", type: "lesson", estimatedMinutes: 20, locked: true, completed: false },
    { id: "rm-3", order: 3, title: "Stop Loss Basics", type: "lesson", estimatedMinutes: 15, locked: true, completed: false },
    { id: "rm-4", order: 4, title: "Take Profit Basics", type: "lesson", estimatedMinutes: 15, locked: true, completed: false },
    { id: "rm-5", order: 5, title: "Risk/Reward Ratio", type: "lesson", estimatedMinutes: 20, locked: true, completed: false, linkedId: "risk-reward-101" },
    { id: "rm-6", order: 6, title: "Position Size Calculator", type: "exercise", estimatedMinutes: 15, locked: true, completed: false },
    { id: "rm-7", order: 7, title: "Place Entry, Stop Loss, and Take Profit", type: "drill", estimatedMinutes: 20, locked: true, completed: false, linkedId: "drill-full-setup" },
    { id: "rm-8", order: 8, title: "Drawdown and Losing Streaks", type: "lesson", estimatedMinutes: 20, locked: true, completed: false },
    { id: "rm-9", order: 9, title: "Risk Management Quiz", type: "quiz", estimatedMinutes: 15, locked: true, completed: false, linkedId: "risk-reward-quiz" },
    { id: "rm-10", order: 10, title: "Create Your Risk Rules", type: "reflection", estimatedMinutes: 10, locked: true, completed: false },
  ]),
  ...syllabus("trading-psychology", [
    { id: "psy-1", order: 1, title: "Why Traders Lose Discipline", type: "lesson", estimatedMinutes: 15, locked: true, completed: false, linkedId: "psychology-101" },
    { id: "psy-2", order: 2, title: "Patience and Waiting for Setups", type: "lesson", estimatedMinutes: 15, locked: true, completed: false },
    { id: "psy-3", order: 3, title: "Fear of Missing Out", type: "lesson", estimatedMinutes: 15, locked: true, completed: false },
    { id: "psy-4", order: 4, title: "Revenge Trading", type: "lesson", estimatedMinutes: 15, locked: true, completed: false },
    { id: "psy-5", order: 5, title: "Overconfidence After Winning", type: "lesson", estimatedMinutes: 15, locked: true, completed: false },
    { id: "psy-6", order: 6, title: "Journaling Your Trades", type: "lesson", estimatedMinutes: 15, locked: true, completed: false, linkedId: "journaling-101" },
    { id: "psy-7", order: 7, title: "Emotional State Reflection", type: "reflection", estimatedMinutes: 10, locked: true, completed: false },
    { id: "psy-8", order: 8, title: "Psychology Scenario Quiz", type: "quiz", estimatedMinutes: 15, locked: true, completed: false, linkedId: "psychology-quiz" },
    { id: "psy-9", order: 9, title: "Build Your Personal Trading Rules", type: "reflection", estimatedMinutes: 10, locked: true, completed: false },
    { id: "psy-10", order: 10, title: "Discipline Final Review", type: "quiz", estimatedMinutes: 15, locked: true, completed: false, linkedId: "psychology-final-quiz" },
  ]),
]

export function getPathById(id: string) {
  return learningPaths.find((p) => p.id === id)
}

export function getSyllabusByPathId(pathId: string) {
  return pathSyllabus
    .filter((s) => s.pathId === pathId)
    .sort((a, b) => a.order - b.order)
}

export function getSyllabusItemById(id: string) {
  return pathSyllabus.find((s) => s.id === id)
}

export function getRelatedPaths(pathId: string) {
  const path = getPathById(pathId)
  if (!path) return []
  return learningPaths.filter((p) => path.relatedPathIds.includes(p.id))
}
