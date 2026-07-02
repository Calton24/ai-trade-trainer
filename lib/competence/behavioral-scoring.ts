import { computeTraderReadinessStats } from "@/lib/user-state/trader-readiness"
import { computeTrendSpotterStats } from "@/lib/user-state/trend-spotter"
import { computeStrategyWikiStats } from "@/lib/user-state/strategy-wiki"
import { computeFlashcardStats } from "@/lib/user-state/flashcards"
import {
  calculateDailyStreak,
  calculateWeeklyTargetProgress,
} from "@/lib/user-state/activity"
import type { UserState } from "@/lib/user-state/types"
import type { CompetencePillar, CompetenceScores } from "./types"

function avg(nums: number[]): number {
  if (nums.length === 0) return 0
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
}

function scoreFromQuizAttempts(state: UserState): number {
  const scores = state.quizAttempts.filter((a) => a.passed).map((a) => a.score)
  const bookScores = state.bookLab.quizAttempts
    .filter((a) => a.passed)
    .map((a) => a.score)
  return avg([...scores, ...bookScores])
}

function scoreChartRecognition(state: UserState): number {
  const drillScores = state.drillSessions.map((d) => d.score)
  const trendStats = computeTrendSpotterStats(state)
  const simScores = state.simulator.attempts
    .filter((a) => a.stageId === "chart-reading" || a.stageId === "support-resistance")
    .map((a) => a.score)
  const exerciseScores = state.trendSpotter.exerciseAttempts.map(
    (a) => a.chartScore
  )
  const components = [
    avg(drillScores),
    trendStats.classificationAccuracy,
    avg(exerciseScores),
    avg(simScores),
  ].filter((s) => s > 0)
  return components.length > 0 ? avg(components) : 0
}

function scoreTradeSelection(state: UserState): number {
  const strategyStats = computeStrategyWikiStats(state.strategyWiki)
  const practiceScores = state.strategyWiki.practiceAttempts.map(
    (a) => a.totalScore
  )
  const skipDiscipline = state.strategyWiki.practiceAttempts.filter(
    (a) => a.tradeDecision === "skip" && a.totalScore >= 70
  ).length
  const base = avg(practiceScores)
  const bonus = skipDiscipline >= 2 ? 10 : skipDiscipline >= 1 ? 5 : 0
  return Math.min(100, Math.max(base, strategyStats.averageScore) + bonus)
}

function scoreRiskManagement(state: UserState): number {
  const riskDrills = state.drillSessions.filter(
    (d) =>
      d.drillType.includes("risk") ||
      d.drillType.includes("stop") ||
      d.drillType.includes("sl")
  )
  const riskFlashcards = Object.keys(state.flashcards.cardProgress).filter(
    (id) => id.includes("risk")
  ).length
  const bookRisk = state.bookLab.completedConceptIds.filter((id) =>
    id.includes("risk")
  ).length
  const drillScore = avg(riskDrills.map((d) => d.score))
  const activityBonus = Math.min(20, riskFlashcards * 4 + bookRisk * 5)
  return Math.min(100, drillScore + activityBonus)
}

function scorePsychology(state: UserState): number {
  const readiness = state.traderReadiness.pillarScores.psychology ?? 0
  const reflections = state.bookLab.reflections.length
  const journalCount = state.journalEntries.length
  const mistakeAwareness = state.journalEntries.filter(
    (j) => j.mistakeTag && j.mistakeTag.length > 0
  ).length
  const behavioral =
    reflections >= 3 ? 15 : reflections >= 1 ? 8 : 0
  const journalBonus = Math.min(15, journalCount * 3)
  const awarenessBonus = Math.min(10, mistakeAwareness * 5)
  return Math.min(100, readiness + behavioral + journalBonus + awarenessBonus)
}

function scoreConsistency(state: UserState): number {
  const streak = calculateDailyStreak(state)
  const weekly = calculateWeeklyTargetProgress(state)
  const activityCount = state.activityLog.length
  const streakScore = Math.min(40, streak * 4)
  const weeklyScore = weekly.met ? 30 : Math.min(30, weekly.completed * 10)
  const volumeScore = Math.min(30, Math.floor(activityCount / 5) * 3)
  return Math.min(100, streakScore + weeklyScore + volumeScore)
}

function scoreExecution(state: UserState): number {
  const strategyStats = computeStrategyWikiStats(state.strategyWiki)
  const simMgmt = state.simulator.attempts
    .filter((a) => a.stageId === "trade-management" || a.stageId === "trade-planning")
    .map((a) => a.score)
  const mastered = Object.values(state.strategyWiki.strategyProgress).filter(
    (p) =>
      p.masteryLevel === "competent" ||
      p.masteryLevel === "strong" ||
      p.masteryLevel === "mastered"
  ).length
  const base = Math.max(strategyStats.averageScore, avg(simMgmt))
  const masteryBonus = Math.min(25, mastered * 8)
  const simBonus = Math.min(15, state.simulator.completedStageIds.length * 3)
  return Math.min(100, base + masteryBonus + simBonus)
}

function findWeakest(
  scores: Record<CompetencePillar, number>
): CompetencePillar | null {
  let weakest: CompetencePillar | null = null
  let lowest = 101
  for (const [pillar, score] of Object.entries(scores)) {
    if (score < lowest) {
      lowest = score
      weakest = pillar as CompetencePillar
    }
  }
  return weakest
}

const PILLAR_ROUTES: Record<CompetencePillar, string> = {
  "market-knowledge": "/library/day-trading-for-a-living",
  "chart-recognition": "/trend-spotter",
  "trade-selection": "/strategy-wiki",
  "risk-management": "/library/day-trading-for-a-living",
  psychology: "/library/trading-in-the-zone",
  consistency: "/settings/goals",
  execution: "/strategy-wiki",
}

/**
 * Computes competence from behavioural signals across the platform —
 * not quizzes alone.
 */
export function computeBehavioralCompetence(
  state: UserState
): CompetenceScores {
  const pillarScores: Record<CompetencePillar, number> = {
    "market-knowledge": scoreFromQuizAttempts(state),
    "chart-recognition": scoreChartRecognition(state),
    "trade-selection": scoreTradeSelection(state),
    "risk-management": scoreRiskManagement(state),
    psychology: scorePsychology(state),
    consistency: scoreConsistency(state),
    execution: scoreExecution(state),
  }

  // Blend assessment pillar scores where available (40% assessment, 60% behaviour)
  const assessment = computeTraderReadinessStats(state)
  if (assessment.hasBaseline) {
    const blend = (behavioral: number, assessed: number) =>
      Math.round(behavioral * 0.6 + assessed * 0.4)
    pillarScores["market-knowledge"] = blend(
      pillarScores["market-knowledge"],
      assessment.pillarScores["market-knowledge"] ?? 0
    )
    pillarScores["chart-recognition"] = blend(
      pillarScores["chart-recognition"],
      assessment.pillarScores["chart-reading"] ?? 0
    )
    pillarScores["trade-selection"] = blend(
      pillarScores["trade-selection"],
      assessment.pillarScores["trade-selection"] ?? 0
    )
    pillarScores["risk-management"] = blend(
      pillarScores["risk-management"],
      assessment.pillarScores["risk-management"] ?? 0
    )
    pillarScores.psychology = blend(
      pillarScores.psychology,
      assessment.pillarScores.psychology ?? 0
    )
    pillarScores.execution = blend(
      pillarScores.execution,
      assessment.pillarScores["strategy-mastery"] ?? 0
    )
  }

  const values = Object.values(pillarScores)
  const overallScore =
    values.length > 0
      ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
      : 0

  const weakest = findWeakest(pillarScores)

  return {
    knowledgeScore: pillarScores["market-knowledge"],
    chartScore: pillarScores["chart-recognition"],
    tradeSelectionScore: pillarScores["trade-selection"],
    riskScore: pillarScores["risk-management"],
    psychologyScore: pillarScores.psychology,
    consistencyScore: pillarScores.consistency,
    executionScore: pillarScores.execution,
    overallScore,
    weakestArea: weakest,
    recommendedNextModule: weakest ? PILLAR_ROUTES[weakest] : "/learning-map",
  }
}

export function hasCriticalWeakness(scores: CompetenceScores): boolean {
  const pillars = [
    scores.knowledgeScore,
    scores.chartScore,
    scores.tradeSelectionScore,
    scores.riskScore,
    scores.psychologyScore,
    scores.consistencyScore,
    scores.executionScore,
  ]
  return pillars.some((s) => s < 50)
}
