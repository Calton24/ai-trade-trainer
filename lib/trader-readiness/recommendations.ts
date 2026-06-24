import type { ReadinessPillarId, TraderReadinessStats } from "./types"
import { getTraderLevel, traderLevelLabel } from "./levels"
import {
  computeOverallReadiness,
  findStrongestPillar,
  findWeakestPillar,
} from "./scoring"
import { getPillarById } from "@/content/trader-readiness"

const PILLAR_RECOMMENDATIONS: Record<
  ReadinessPillarId,
  { focus: string; href: string; actions: string[] }
> = {
  "market-knowledge": {
    focus: "Trading Foundations Path",
    href: "/paths/trading-foundations",
    actions: [
      "Complete 2 Book Lab concept chapters",
      "Review trading basics flashcards",
      "Pass the market structure quiz",
    ],
  },
  "chart-reading": {
    focus: "Trend Spotter Level 4",
    href: "/trend-spotter",
    actions: [
      "Complete 3 Chart Lab drills",
      "Practise trend classification exercises",
      "Review support and resistance flashcards",
    ],
  },
  "trade-selection": {
    focus: "Strategy Wiki Practice",
    href: "/strategy-wiki",
    actions: [
      "Complete 5 trade-or-skip exercises",
      "Review break and retest strategy",
      "Practise filtering setups in Chart Lab",
    ],
  },
  "risk-management": {
    focus: "Risk Management Module",
    href: "/book-lab/risk-money-management",
    actions: [
      "Review risk management flashcards",
      "Complete position sizing drills",
      "Pass the risk management quiz",
    ],
  },
  psychology: {
    focus: "Emotional Discipline Path",
    href: "/book-lab/psychology-discipline",
    actions: [
      "Complete 3 psychology drills",
      "Review emotional discipline flashcards",
      "Pass psychology quiz",
      "Complete journal review exercise",
    ],
  },
  "journal-analysis": {
    focus: "Journal Review Practice",
    href: "/journal",
    actions: [
      "Log 5 trades with full notes",
      "Review past entries for patterns",
      "Complete Book Lab journaling chapter",
    ],
  },
  "strategy-mastery": {
    focus: "Strategy Wiki Mastery",
    href: "/strategy-wiki",
    actions: [
      "Reach 80% on strategy practice drills",
      "Complete strategy challenge for weakest setup",
      "Review entry and exit rules for each strategy",
    ],
  },
}

const WEAKNESS_KEYWORDS: Record<string, { label: string; pillar: ReadinessPillarId }> = {
  emotional: { label: "Emotional Discipline", pillar: "psychology" },
  discipline: { label: "Trading Discipline", pillar: "psychology" },
  trend: { label: "Trend Recognition", pillar: "chart-reading" },
  support: { label: "Support & Resistance", pillar: "chart-reading" },
  resistance: { label: "Support & Resistance", pillar: "chart-reading" },
  risk: { label: "Risk Sizing", pillar: "risk-management" },
  sizing: { label: "Position Sizing", pillar: "risk-management" },
  overtrading: { label: "Overtrading", pillar: "journal-analysis" },
  revenge: { label: "Revenge Trading", pillar: "psychology" },
  fomo: { label: "FOMO Control", pillar: "psychology" },
  filtering: { label: "Trade Filtering", pillar: "trade-selection" },
  strategy: { label: "Strategy Rules", pillar: "strategy-mastery" },
}

export function detectWeaknesses(
  pillarPercents: Record<ReadinessPillarId, number>,
  rawWeaknesses: string[]
): string[] {
  const detected = new Set<string>()

  for (const [pillar, score] of Object.entries(pillarPercents)) {
    if (score < 60) {
      const def = getPillarById(pillar as ReadinessPillarId)
      detected.add(def.title)
    }
  }

  for (const w of rawWeaknesses) {
    const lower = w.toLowerCase()
    for (const [keyword, info] of Object.entries(WEAKNESS_KEYWORDS)) {
      if (lower.includes(keyword)) {
        detected.add(info.label)
      }
    }
  }

  return [...detected].slice(0, 5)
}

function estimateTimeToImprove(weakestScore: number): string {
  if (weakestScore >= 70) return "1 week"
  if (weakestScore >= 50) return "2 weeks"
  if (weakestScore >= 30) return "3–4 weeks"
  return "4–6 weeks"
}

function nextMilestone(overall: number): string {
  if (overall >= 95) return "Maintain elite readiness"
  if (overall >= 80) return "Reach 95% readiness"
  if (overall >= 60) return "Reach 80% readiness"
  if (overall >= 30) return "Reach 60% readiness"
  return "Complete baseline assessment"
}

export function buildReadinessStats(
  pillarScores: Partial<Record<ReadinessPillarId, number>>,
  assessmentCount: number,
  readinessXP: number,
  allWeaknesses: string[] = []
): TraderReadinessStats {
  const filled: Record<ReadinessPillarId, number> = {
    "market-knowledge": pillarScores["market-knowledge"] ?? 0,
    "chart-reading": pillarScores["chart-reading"] ?? 0,
    "trade-selection": pillarScores["trade-selection"] ?? 0,
    "risk-management": pillarScores["risk-management"] ?? 0,
    psychology: pillarScores.psychology ?? 0,
    "journal-analysis": pillarScores["journal-analysis"] ?? 0,
    "strategy-mastery": pillarScores["strategy-mastery"] ?? 0,
  }

  const hasBaseline = Object.keys(pillarScores).length > 0
  const overall = computeOverallReadiness(pillarScores)
  const level = getTraderLevel(overall)
  const weakest = hasBaseline ? findWeakestPillar(filled) : null
  const strongest = hasBaseline ? findStrongestPillar(filled) : null
  const detected = hasBaseline
    ? detectWeaknesses(filled, allWeaknesses)
    : []

  const rec = weakest
    ? PILLAR_RECOMMENDATIONS[weakest]
    : PILLAR_RECOMMENDATIONS["market-knowledge"]

  return {
    overallScore: overall,
    traderLevel: level,
    traderLevelLabel: traderLevelLabel(level),
    pillarScores: filled,
    weakestPillar: weakest,
    strongestPillar: strongest,
    weakestPillarLabel: weakest ? getPillarById(weakest).title : null,
    strongestPillarLabel: strongest ? getPillarById(strongest).title : null,
    detectedWeaknesses: detected,
    recommendedFocus: rec.focus,
    recommendedHref: rec.href,
    estimatedTimeToImprove: weakest
      ? estimateTimeToImprove(filled[weakest])
      : "2 weeks",
    nextMilestone: nextMilestone(overall),
    suggestedActions: rec.actions,
    assessmentsCompleted: assessmentCount,
    readinessXP,
    hasBaseline,
  }
}

export function getCoachingNote(stats: TraderReadinessStats): string {
  if (!stats.hasBaseline) {
    return "Complete your first Trader Readiness assessment to get a personalised coaching plan."
  }

  const strong = stats.strongestPillarLabel ?? "your strengths"
  const weak = stats.weakestPillarLabel ?? "weak areas"

  return `You show strength in ${strong} (${stats.pillarScores[stats.strongestPillar!]}%) but ${weak} (${stats.pillarScores[stats.weakestPillar!]}%) is holding you back. ${stats.recommendedFocus} is your recommended focus.`
}
