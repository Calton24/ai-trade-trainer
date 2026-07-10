import type { MarketReadingLevel, PracticeDrill, SkillCategory, SkillId } from "./types"

export const SKILL_LABELS: Record<SkillId, string> = {
  "trend-detection": "Trend Detection",
  continuation: "Continuation",
  reversal: "Reversal",
  "support-resistance": "Support & Resistance",
  "break-retest": "Break & Retest",
  liquidity: "Liquidity",
  "position-sizing": "Position Sizing",
  "stop-placement": "Stop Placement",
  "risk-reward": "Risk/Reward",
  discipline: "Discipline",
  "confidence-calibration": "Confidence Calibration",
  "journal-quality": "Journal Quality",
  "market-context": "Market Context",
  "pair-selection": "Pair Selection",
  "trade-or-skip": "Trade or Skip",
  "post-trade-review": "Post-Trade Review",
  "replay-accuracy": "Replay Accuracy",
  "decision-quality": "Decision Quality",
}

export const SKILL_CATEGORIES: Record<SkillId, SkillCategory> = {
  "trend-detection": "pattern-recognition",
  continuation: "pattern-recognition",
  reversal: "pattern-recognition",
  "support-resistance": "pattern-recognition",
  "break-retest": "pattern-recognition",
  liquidity: "pattern-recognition",
  "position-sizing": "risk-management",
  "stop-placement": "risk-management",
  "risk-reward": "risk-management",
  discipline: "psychology",
  "confidence-calibration": "psychology",
  "journal-quality": "psychology",
  "market-context": "professional-workflow",
  "pair-selection": "professional-workflow",
  "trade-or-skip": "professional-workflow",
  "post-trade-review": "professional-workflow",
  "replay-accuracy": "market-reading",
  "decision-quality": "market-reading",
}

export const CATEGORY_LABELS: Record<SkillCategory, string> = {
  "pattern-recognition": "Pattern Recognition",
  "risk-management": "Risk Management",
  psychology: "Psychology",
  "professional-workflow": "Professional Workflow",
  "market-reading": "Market Reading",
}

export const CATEGORY_ORDER: SkillCategory[] = [
  "market-reading",
  "pattern-recognition",
  "risk-management",
  "psychology",
  "professional-workflow",
]

export const ALL_SKILL_IDS = Object.keys(SKILL_LABELS) as SkillId[]

export function scoreToLevel(score: number): MarketReadingLevel {
  if (score >= 90) return "Professional"
  if (score >= 75) return "Advanced"
  if (score >= 55) return "Intermediate"
  if (score >= 30) return "Developing"
  return "Beginner"
}

/** Maps weakest skill → highest-ROI practice destination. */
export const SKILL_PRACTICE_ROUTES: Record<SkillId, string> = {
  "trend-detection":
    "/paths/market-structure-mastery/lessons/higher-highs-and-higher-lows",
  continuation:
    "/paths/market-behaviour-academy/lessons/four-point-rule",
  reversal:
    "/paths/market-behaviour-academy/lessons/pullback-vs-reversal",
  "support-resistance": "/chart-lab/task-support-bounce",
  "break-retest": "/chart-lab/task-break-retest",
  liquidity: "/chart-lab",
  "position-sizing":
    "/execution-lab",
  "stop-placement": "/execution-lab",
  "risk-reward": "/execution-lab",
  discipline: "/paths/trading-psychology/lessons/discipline-and-process",
  "confidence-calibration":
    "/paths/market-structure-mastery/lessons/structure-replay",
  "journal-quality": "/journal",
  "market-context": "/paths/professional-forex-workflow/lessons/daily-checklist",
  "pair-selection":
    "/paths/professional-forex-workflow/lessons/build-your-watchlist",
  "trade-or-skip": "/strategy-wiki",
  "post-trade-review": "/journal",
  "replay-accuracy": "/paths/market-behaviour-academy/lessons/reversal-assessment",
  "decision-quality": "/execution-lab",
}

export const PRACTICE_DRILLS: PracticeDrill[] = [
  {
    id: "reversal-academy",
    title: "Reversal Academy",
    description:
      "Pullback vs reversal, four-point rule, structure breaks, and 20 Execution Lab scenarios.",
    href: "/paths/market-behaviour-academy",
    skillIds: ["reversal", "continuation", "replay-accuracy", "decision-quality"],
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    available: true,
    badge: "Flagship",
  },
  {
    id: "execution-lab",
    title: "Execution Lab",
    description:
      "Drag entry, stop, and target on a live chart. Size the trade, submit, and get coached.",
    href: "/execution-lab",
    skillIds: ["position-sizing", "stop-placement", "risk-reward", "decision-quality"],
    difficulty: "Intermediate",
    estimatedMinutes: 10,
    available: true,
    badge: "New",
  },
  {
    id: "trend-detective",
    title: "Trend Detective",
    description: "Label HH/HL/LH/LL swings and classify the trend.",
    href: "/paths/market-structure-mastery/lessons/higher-highs-and-higher-lows",
    skillIds: ["trend-detection"],
    difficulty: "Beginner",
    estimatedMinutes: 5,
    available: true,
  },
  {
    id: "continuation-predictor",
    title: "Continuation Predictor",
    description: "Predict continuation vs reversal before the next swing.",
    href: "/paths/market-structure-mastery/lessons/continuation-vs-reversal",
    skillIds: ["continuation", "reversal"],
    difficulty: "Intermediate",
    estimatedMinutes: 5,
    available: true,
  },
  {
    id: "structure-replay",
    title: "Structure Replay",
    description: "Reveal candles one at a time, then read the market.",
    href: "/paths/market-structure-mastery/lessons/structure-replay",
    skillIds: ["replay-accuracy", "trend-detection", "continuation"],
    difficulty: "Intermediate",
    estimatedMinutes: 8,
    available: true,
    badge: "Core",
  },
  {
    id: "trend-builder",
    title: "Trend Builder",
    description: "Construct a clean uptrend or downtrend from scratch.",
    href: "/paths/market-structure-mastery/lessons/build-the-structure",
    skillIds: ["trend-detection"],
    difficulty: "Intermediate",
    estimatedMinutes: 5,
    available: true,
  },
  {
    id: "swing-replay",
    title: "Swing Replay",
    description: "Mark swing highs and lows on replay charts.",
    href: "/practice?drill=swing-replay",
    skillIds: ["trend-detection", "support-resistance"],
    difficulty: "Intermediate",
    estimatedMinutes: 8,
    available: false,
    badge: "Coming soon",
  },
  {
    id: "sr-replay",
    title: "Support & Resistance Replay",
    description: "Identify key levels as candles reveal.",
    href: "/chart-lab/task-support-bounce",
    skillIds: ["support-resistance"],
    difficulty: "Intermediate",
    estimatedMinutes: 8,
    available: true,
  },
  {
    id: "break-retest-replay",
    title: "Break & Retest Replay",
    description: "Spot breakouts and retests on replay charts.",
    href: "/chart-lab/task-break-retest",
    skillIds: ["break-retest"],
    difficulty: "Advanced",
    estimatedMinutes: 10,
    available: true,
  },
  {
    id: "position-sizing",
    title: "Position Sizing",
    description: "Calculate lot size from account risk and stop distance.",
    href: "/paths/risk-management/lessons/position-sizing-basics",
    skillIds: ["position-sizing", "risk-reward"],
    difficulty: "Beginner",
    estimatedMinutes: 10,
    available: true,
  },
  {
    id: "trade-or-skip",
    title: "Trade or Skip",
    description: "Decide whether a setup is worth taking.",
    href: "/strategy-wiki",
    skillIds: ["trade-or-skip", "decision-quality"],
    difficulty: "Advanced",
    estimatedMinutes: 15,
    available: true,
  },
  {
    id: "journal-review",
    title: "Journal Review",
    description: "Review past trades and label mistakes.",
    href: "/journal",
    skillIds: ["journal-quality", "post-trade-review"],
    difficulty: "Intermediate",
    estimatedMinutes: 10,
    available: true,
  },
  {
    id: "chart-lab",
    title: "Chart Lab",
    description: "Mark structures on interactive chart scenarios.",
    href: "/chart-lab",
    skillIds: ["support-resistance", "break-retest"],
    difficulty: "Beginner",
    estimatedMinutes: 10,
    available: true,
  },
  {
    id: "trend-spotter",
    title: "Trend Spotter",
    description: "Classify trends across 10 rapid-fire charts.",
    href: "/trend-spotter/challenge",
    skillIds: ["trend-detection", "continuation"],
    difficulty: "Intermediate",
    estimatedMinutes: 15,
    available: true,
  },
  {
    id: "simulator",
    title: "Trading Simulator",
    description: "Make decisions on replay charts with trade management.",
    href: "/simulator",
    skillIds: ["replay-accuracy", "decision-quality"],
    difficulty: "Advanced",
    estimatedMinutes: 20,
    available: true,
  },
]
