import { getNodeById } from "@/content/learning-map/nodes"

const STRATEGY_NODE_BY_SLUG: Record<string, string> = {
  "support-bounce": "node-strategy-support-bounce",
  "resistance-rejection": "node-strategy-support-bounce",
  "break-retest": "node-strategy-break-retest",
  icc: "node-strategy-icc",
}

const PRACTICE_NODE_BY_SLUG: Record<string, string> = {
  "break-retest": "node-strategy-break-retest-practice",
}

const CHALLENGE_NODE_BY_SLUG: Record<string, string> = {
  "support-bounce": "node-strategy-challenge",
  "resistance-rejection": "node-strategy-challenge",
  "break-retest": "node-strategy-challenge-advanced",
}

const INTERMEDIATE_STRATEGY_SLUGS = new Set([
  "trend-pullback",
  "opening-range-breakout",
  "vwap-bounce",
  "bull-flag",
  "bear-flag",
  "reversal",
  "moving-average-trend",
  "high-of-day-breakout",
])

const PROFESSIONAL_STRATEGY_SLUGS = new Set([
  "eod-continuation",
  "eod-reversal",
  "momentum-bounce",
  "advanced-reversal-swing",
  "bolly-breakout-band",
])

export function getStrategyOverviewNodeId(slug: string): string | null {
  if (STRATEGY_NODE_BY_SLUG[slug]) return STRATEGY_NODE_BY_SLUG[slug]
  if (INTERMEDIATE_STRATEGY_SLUGS.has(slug)) return null
  return null
}

export function getStrategyPracticeNodeId(slug: string): string {
  if (PRACTICE_NODE_BY_SLUG[slug]) return PRACTICE_NODE_BY_SLUG[slug]
  const overview = STRATEGY_NODE_BY_SLUG[slug]
  if (overview) return overview
  return "node-strategy-support-bounce"
}

export function getStrategyChallengeNodeId(slug: string): string | null {
  return CHALLENGE_NODE_BY_SLUG[slug] ?? null
}

export function getStrategyPracticeFeatureId(slug: string): string | null {
  if (slug === "break-retest") return "feature-strategy-break-retest"
  if (STRATEGY_NODE_BY_SLUG[slug]) return "feature-strategy-sr"
  if (INTERMEDIATE_STRATEGY_SLUGS.has(slug)) return "feature-strategy-intermediate"
  if (PROFESSIONAL_STRATEGY_SLUGS.has(slug)) return "feature-strategy-professional"
  return "feature-strategy-wiki-practice"
}

export function getStrategyUnlocksAfter(slug: string): string[] {
  const nodeId = STRATEGY_NODE_BY_SLUG[slug] ?? PRACTICE_NODE_BY_SLUG[slug]
  if (!nodeId) return []
  const node = getNodeById(nodeId)
  return (
    node?.unlocks
      .map((id) => getNodeById(id)?.title)
      .filter((t): t is string => Boolean(t)) ?? []
  )
}
