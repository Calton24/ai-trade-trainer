import type { AccessLevel } from "@/lib/learning-map/types"

export interface FeatureUnlockRule {
  id: string
  title: string
  requiredNodeIds: string[]
  previewNodeIds?: string[]
  reason: string
  lockedMessage: string
  href: string
  previewHref?: string
}

export const FEATURE_UNLOCK_RULES: FeatureUnlockRule[] = [
  {
    id: "feature-book-lab-starter",
    title: "Book Lab Foundations",
    requiredNodeIds: [],
    reason: "Day trading foundations are available from the start.",
    lockedMessage: "",
    href: "/book-lab",
  },
  {
    id: "feature-flashcards-candlesticks",
    title: "Candlestick Flashcards",
    requiredNodeIds: ["node-lesson-candle-anatomy"],
    previewNodeIds: ["node-quiz-basics"],
    reason: "Review candle vocabulary after your first candlestick lesson.",
    lockedMessage: "Complete Candlestick Anatomy to unlock the full candlestick deck.",
    href: "/flashcards",
  },
  {
    id: "feature-chart-lab-swings",
    title: "Chart Lab: Swing Markup",
    requiredNodeIds: ["node-lesson-swing-highs"],
    previewNodeIds: ["node-lesson-candle-anatomy"],
    reason: "Mark swing highs and lows after learning market structure basics.",
    lockedMessage:
      "Complete Swing Highs and Swing Lows before guided swing markup exercises.",
    href: "/chart-lab/task-spot-trend",
    previewHref: "/chart-lab/demo-swing-high-low",
  },
  {
    id: "feature-trend-spotter-challenge",
    title: "Trend Spotter 10-Chart Challenge",
    requiredNodeIds: ["node-trend-vs-range"],
    previewNodeIds: ["node-trend-what-is"],
    reason: "The challenge unlocks after you complete Trend Basics.",
    lockedMessage:
      "Complete Trend vs Range before the 10-chart challenge. You need uptrend, downtrend, and range recognition first.",
    href: "/trend-spotter/challenge",
    previewHref: "/trend-spotter",
  },
  {
    id: "feature-chart-lab-levels",
    title: "Chart Lab: Support & Resistance",
    requiredNodeIds: ["node-chart-resistance"],
    previewNodeIds: ["node-chart-support"],
    reason: "Full level practice unlocks after both support and resistance drills.",
    lockedMessage:
      "Complete support and resistance chart drills before full free practice on levels.",
    href: "/chart-lab",
    previewHref: "/chart-lab/demo-support",
  },
  {
    id: "feature-strategy-sr",
    title: "Strategy Wiki: S&R Strategies",
    requiredNodeIds: ["node-chart-resistance"],
    previewNodeIds: ["node-chart-support"],
    reason: "Support Bounce and Resistance Rejection unlock after S&R basics.",
    lockedMessage:
      "Complete Support & Resistance chart drills before strategy practice on levels.",
    href: "/strategy-wiki/support-bounce",
    previewHref: "/strategy-wiki",
  },
  {
    id: "feature-strategy-break-retest",
    title: "Strategy Wiki: Break & Retest",
    requiredNodeIds: ["node-chart-fakeout"],
    previewNodeIds: ["node-chart-breakout"],
    reason: "Break & Retest is easier after you understand breakouts and fakeouts.",
    lockedMessage:
      "Complete Market Structure Basics and Breakouts & Fakeouts before Break & Retest practice.",
    href: "/strategy-wiki/break-retest",
    previewHref: "/strategy-wiki/break-retest",
  },
  {
    id: "feature-strategy-intermediate",
    title: "Intermediate Strategies",
    requiredNodeIds: ["node-lesson-risk-reward"],
    previewNodeIds: ["node-lesson-what-is-risk"],
    reason: "VWAP, ORB, and flag strategies recommend risk management first.",
    lockedMessage:
      "Complete Risk Management Basics before intermediate strategy practice.",
    href: "/strategy-wiki",
    previewHref: "/strategy-wiki",
  },
  {
    id: "feature-strategy-wiki-practice",
    title: "Strategy Wiki Practice Mode",
    requiredNodeIds: ["node-strategy-break-retest-practice"],
    reason: "Full practice mode unlocks after your first completed strategy setup.",
    lockedMessage: "Complete at least one strategy practice session to unlock challenge mode.",
    href: "/strategy-wiki",
  },
  {
    id: "feature-icc-chart-lab",
    title: "Chart Lab: ICC Markup",
    requiredNodeIds: ["node-lesson-icc-indication"],
    previewNodeIds: ["node-strategy-icc"],
    reason: "ICC markup unlocks after ICC Foundations lessons.",
    lockedMessage: "Complete ICC Indication lesson before ICC chart markup exercises.",
    href: "/chart-lab/task-icc-bullish",
    previewHref: "/chart-lab/demo-icc-indication",
  },
  {
    id: "feature-strategy-all-beginner",
    title: "All Beginner Strategies",
    requiredNodeIds: ["node-strategy-support-bounce"],
    reason: "Explore beginner setups after your first strategy practice.",
    lockedMessage: "Complete Support Bounce strategy overview first.",
    href: "/strategy-wiki",
  },
  {
    id: "feature-journal-full",
    title: "Full Journaling",
    requiredNodeIds: ["node-journal-first"],
    reason: "Journal freely after your first reflection entry.",
    lockedMessage: "Write your first journal reflection to unlock full journaling.",
    href: "/journal",
  },
  {
    id: "feature-exploration-full",
    title: "Full Exploration Mode",
    requiredNodeIds: ["node-trend-challenge", "node-strategy-challenge-advanced"],
    reason: "All practice zones unlock as you build mastery over time.",
    lockedMessage: "Complete intermediate mastery challenges to unlock full exploration.",
    href: "/learning-map",
  },
]

export const FEATURE_BY_ID = Object.fromEntries(
  FEATURE_UNLOCK_RULES.map((f) => [f.id, f])
) as Record<string, FeatureUnlockRule>

export function getLockedMessage(nodeId: string): string {
  const messages: Record<string, string> = {
    "node-strategy-break-retest":
      "Complete Support & Resistance and Breakouts & Fakeouts before Break & Retest. You need to understand swing highs, swing lows, and key levels first.",
    "node-strategy-icc":
      "ICC requires Trend Detection, Market Structure, and Break & Retest foundations.",
    "node-trend-challenge":
      "Complete Trend Basics (What is a Trend, Uptrend vs Downtrend, Trend vs Range) before the 10-chart challenge.",
    "node-chart-fakeout":
      "Learn to mark breakouts before spotting fakeouts.",
    "node-strategy-challenge-advanced":
      "Complete Break & Retest practice and score 70%+ on the basic challenge first.",
  }
  return messages[nodeId] ?? "Complete the prerequisites below to unlock this step."
}

export function getDefaultAccessForLevel(
  level: "beginner" | "beginner-plus" | "intermediate" | "advanced",
  foundationComplete: boolean
): AccessLevel {
  if (level === "beginner") return "unlocked"
  if (level === "beginner-plus" && foundationComplete) return "unlocked"
  if (level === "beginner-plus") return "preview"
  if (foundationComplete) return "preview"
  return "locked"
}
