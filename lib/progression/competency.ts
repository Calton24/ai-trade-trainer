import {
  getAllLibraryConcepts,
} from "@/content/library"
import { getAllQuizzes } from "@/content/registry"
import { SIMULATOR_STAGES } from "@/content/simulator/stages"
import { computeSimulatorStats } from "@/lib/user-state/simulator"
import { computeStrategyWikiStats } from "@/lib/user-state/strategy-wiki"
import { computeTrendSpotterStats } from "@/lib/user-state/trend-spotter"
import type { UserState } from "@/lib/user-state/types"

/**
 * Hidden Competency Score (0–100).
 *
 * XP measures effort. Competency measures *demonstrated knowledge*. The two are
 * deliberately decoupled: a learner can have huge XP but low competency if they
 * repeatedly fail assessments.
 *
 * Each pillar is `quality × coverage`:
 *   - quality  = how well you score when assessed (best score per item)
 *   - coverage = how much of the available material you've actually mastered
 *
 * Because coverage is the fraction of ALL available assessments completed, a
 * brand-new learner with a few good quizzes lands at ~1–3%, and high competency
 * genuinely requires mastery across most of the platform.
 *
 * Reading without assessment contributes almost nothing (a small capped floor).
 */

const PSYCHOLOGY_BOOK_ID = "trading-in-the-zone"

// Pillar weights — sum to 1.0. Weighted heavily toward demonstrated knowledge.
const WEIGHTS = {
  knowledge: 0.4,
  simulation: 0.25,
  chart: 0.15,
  strategy: 0.1,
  psychology: 0.05,
  retention: 0.05,
} as const

export type CompetencyPillarKey = keyof typeof WEIGHTS

export interface CompetencyBreakdownItem {
  key: CompetencyPillarKey
  label: string
  weight: number
  /** How well the learner scores when assessed (0–100). */
  quality: number
  /** Fraction of available material mastered (0–100). */
  coverage: number
  /** Points this pillar contributes to the final score. */
  contribution: number
  hasData: boolean
}

export interface CompetencyResult {
  score: number
  hasData: boolean
  breakdown: CompetencyBreakdownItem[]
  label: string
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0
  return Math.max(0, Math.min(1, n))
}

/** Normalise a 0–100 (or 0–1) metric to a 0–1 fraction. */
function toFraction(value: number): number {
  if (!value) return 0
  return clamp01(value > 1 ? value / 100 : value)
}

function competencyLabel(score: number): string {
  if (score >= 95) return "Mastery"
  if (score >= 85) return "Professional readiness"
  if (score >= 70) return "Competent"
  if (score >= 40) return "Intermediate"
  if (score >= 20) return "Foundational"
  if (score >= 5) return "Beginner"
  if (score > 0) return "Just getting started"
  return "Not enough data yet"
}

interface Pillar {
  quality: number // 0..1
  coverage: number // 0..1
  hasData: boolean
}

function pillarValue(p: Pillar): number {
  return clamp01(p.quality) * clamp01(p.coverage)
}

/** Knowledge exams: course quizzes + library concept quizzes. */
function knowledgePillar(state: UserState): Pillar {
  const courseQuizzes = getAllQuizzes()
  const concepts = getAllLibraryConcepts()
  const conceptQuizCount = concepts.filter(
    (c) => c.quizQuestions.length > 0
  ).length
  const totalAvailable = courseQuizzes.length + conceptQuizCount
  if (totalAvailable === 0) return { quality: 0, coverage: 0, hasData: false }

  // Best score per distinct passed assessment (repeats don't add coverage).
  const bestCourse = new Map<string, number>()
  for (const a of state.quizAttempts) {
    if (!a.passed) continue
    bestCourse.set(a.quizId, Math.max(bestCourse.get(a.quizId) ?? 0, a.score))
  }
  const bestBook = new Map<string, number>()
  for (const a of state.bookLab.quizAttempts) {
    if (!a.passed) continue
    bestBook.set(a.conceptId, Math.max(bestBook.get(a.conceptId) ?? 0, a.score))
  }

  const scores = [...bestCourse.values(), ...bestBook.values()]
  if (scores.length === 0) return { quality: 0, coverage: 0, hasData: false }

  const quality = scores.reduce((s, v) => s + toFraction(v), 0) / scores.length
  const coverage = scores.length / totalAvailable
  return { quality, coverage, hasData: true }
}

function simulationPillar(state: UserState): Pillar {
  const stats = computeSimulatorStats(state)
  const total = SIMULATOR_STAGES.length || 5
  if (stats.sessionsCompleted === 0) {
    return { quality: 0, coverage: 0, hasData: false }
  }
  return {
    quality: toFraction(stats.averageScore),
    coverage: clamp01(state.simulator.completedStageIds.length / total),
    hasData: true,
  }
}

function chartPillar(state: UserState): Pillar {
  const stats = computeTrendSpotterStats(state)
  const done = stats.exercisesCompleted + stats.challengesCompleted
  if (done === 0) return { quality: 0, coverage: 0, hasData: false }
  // Coverage saturates after a meaningful number of drills.
  return {
    quality: toFraction(stats.classificationAccuracy),
    coverage: clamp01(done / 20),
    hasData: true,
  }
}

function strategyPillar(state: UserState): Pillar {
  const stats = computeStrategyWikiStats(state.strategyWiki)
  if (stats.practiceSessions === 0) {
    return { quality: 0, coverage: 0, hasData: false }
  }
  const coverage =
    stats.totalStrategies > 0
      ? stats.strategiesStarted / stats.totalStrategies
      : 0
  return {
    quality: toFraction(stats.averageScore),
    coverage: clamp01(coverage),
    hasData: true,
  }
}

function psychologyPillar(state: UserState): Pillar {
  const psychConcepts = getAllLibraryConcepts().filter(
    (c) => c.bookId === PSYCHOLOGY_BOOK_ID && c.quizQuestions.length > 0
  )
  const total = psychConcepts.length
  if (total === 0) return { quality: 0, coverage: 0, hasData: false }
  const psychIds = new Set(psychConcepts.map((c) => c.id))

  const best = new Map<string, number>()
  for (const a of state.bookLab.quizAttempts) {
    if (!a.passed || !psychIds.has(a.conceptId)) continue
    best.set(a.conceptId, Math.max(best.get(a.conceptId) ?? 0, a.score))
  }
  const scores = [...best.values()]
  if (scores.length === 0) return { quality: 0, coverage: 0, hasData: false }
  const quality = scores.reduce((s, v) => s + toFraction(v), 0) / scores.length
  return { quality, coverage: clamp01(scores.length / total), hasData: true }
}

function retentionPillar(state: UserState): Pillar {
  const total = Object.keys(state.flashcards.cardProgress).length
  const mastered = Object.values(state.flashcards.cardProgress).filter(
    (c) => c.mastered
  ).length
  const reviewed = state.flashcards.sessions.length
  if (reviewed === 0 || total === 0) {
    return { quality: 0, coverage: 0, hasData: false }
  }
  // Retention already blends quality (mastered) and coverage (of seen cards).
  return { quality: clamp01(mastered / total), coverage: 1, hasData: true }
}

export function computeCompetencyScore(state: UserState): CompetencyResult {
  const pillars: Record<CompetencyPillarKey, Pillar> = {
    knowledge: knowledgePillar(state),
    simulation: simulationPillar(state),
    chart: chartPillar(state),
    strategy: strategyPillar(state),
    psychology: psychologyPillar(state),
    retention: retentionPillar(state),
  }

  const labels: Record<CompetencyPillarKey, string> = {
    knowledge: "Knowledge exams",
    simulation: "Simulation results",
    chart: "Chart recognition",
    strategy: "Strategy assessments",
    psychology: "Psychology assessments",
    retention: "Long-term retention",
  }

  const breakdown: CompetencyBreakdownItem[] = (
    Object.keys(WEIGHTS) as CompetencyPillarKey[]
  ).map((key) => {
    const p = pillars[key]
    const weight = WEIGHTS[key]
    return {
      key,
      label: labels[key],
      weight,
      quality: Math.round(clamp01(p.quality) * 100),
      coverage: Math.round(clamp01(p.coverage) * 100),
      contribution: pillarValue(p) * weight * 100,
      hasData: p.hasData,
    }
  })

  const pillarTotal = breakdown.reduce((s, b) => s + b.contribution, 0)

  // Reading micro-credit: finishing lessons earns a tiny capped amount so a
  // brand-new learner sees ~1% after their first lesson — but reading alone can
  // never carry competency (hard cap of 4 points).
  const concepts = getAllLibraryConcepts().length
  const read = state.bookLab.completedConceptIds.length + state.lessonProgress.length
  const readingMicro =
    read > 0 ? Math.min(4, 1 + Math.floor((read / Math.max(1, concepts)) * 6)) : 0

  const score = Math.max(0, Math.min(100, Math.round(pillarTotal + readingMicro)))
  const hasData = breakdown.some((b) => b.hasData) || readingMicro > 0

  return {
    score,
    hasData,
    breakdown,
    label: competencyLabel(score),
  }
}
