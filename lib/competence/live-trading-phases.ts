import {
  computeBehavioralCompetence,
  hasCriticalWeakness,
} from "./behavioral-scoring"
import type { CompetenceScores, LivePhaseState, LiveTradingPhase, PhaseGateResult } from "./types"
import type { UserState } from "@/lib/user-state/types"

export const PHASE_THRESHOLDS = {
  simulated: { overall: 60, minPillar: 40 },
  livePrep: { overall: 75, minPillar: 50, journalRate: 50 },
  goLive: { overall: 80, minPillar: 60, journalRate: 80 },
} as const

export function getDefaultPhaseState(): LivePhaseState {
  return {
    currentPhase: "education",
    simulatedUnlockedAt: null,
    livePrepUnlockedAt: null,
    goLiveUnlockedAt: null,
    riskQuizPassed: false,
    losingStreakScenarioPassed: false,
    strategyClarityPassed: false,
    journalCompletionRate: 0,
    emotionalViolations: 0,
    tradesInPhase: 0,
  }
}

function journalCompletionRate(state: UserState): number {
  const entries = state.journalEntries.length
  const withNotes = state.journalEntries.filter(
    (j) => j.personalNote && j.personalNote.length > 10
  ).length
  if (entries === 0) return 0
  return Math.round((withNotes / entries) * 100)
}

function minPillarScore(scores: CompetenceScores): number {
  return Math.min(
    scores.knowledgeScore,
    scores.chartScore,
    scores.tradeSelectionScore,
    scores.riskScore,
    scores.psychologyScore,
    scores.consistencyScore,
    scores.executionScore
  )
}

export function evaluateSimulatedGate(
  state: UserState,
  scores?: CompetenceScores
): PhaseGateResult {
  const s = scores ?? computeBehavioralCompetence(state)
  const min = minPillarScore(s)
  const foundationDone =
    state.learningMap.foundationCelebrated ||
    state.lessonProgress.length >= 5

  const requirements = [
    {
      label: "Overall competence ≥ 60%",
      met: s.overallScore >= PHASE_THRESHOLDS.simulated.overall,
      detail: `${s.overallScore}%`,
    },
    {
      label: "No pillar below 40%",
      met: min >= PHASE_THRESHOLDS.simulated.minPillar,
      detail: `Lowest: ${min}%`,
    },
    {
      label: "Foundation stage complete",
      met: foundationDone,
    },
  ]

  const blockers = requirements.filter((r) => !r.met).map((r) => r.label)

  return {
    phase: "simulated",
    unlocked: blockers.length === 0,
    requirements,
    blockers,
  }
}

export function evaluateLivePrepGate(
  state: UserState,
  scores?: CompetenceScores
): PhaseGateResult {
  const s = scores ?? computeBehavioralCompetence(state)
  const min = minPillarScore(s)
  const journalRate = journalCompletionRate(state)

  const requirements = [
    {
      label: "Overall competence ≥ 75%",
      met: s.overallScore >= PHASE_THRESHOLDS.livePrep.overall,
      detail: `${s.overallScore}%`,
    },
    {
      label: "No critical weakness (all pillars ≥ 50%)",
      met: !hasCriticalWeakness(s) && min >= PHASE_THRESHOLDS.livePrep.minPillar,
      detail: `Lowest: ${min}%`,
    },
    {
      label: "Journal completion rate ≥ 50%",
      met: journalRate >= PHASE_THRESHOLDS.livePrep.journalRate,
      detail: `${journalRate}%`,
    },
    {
      label: "Completed Trader Readiness assessment",
      met: state.traderReadiness.assessmentAttempts.length >= 1,
    },
  ]

  const blockers = requirements.filter((r) => !r.met).map((r) => r.label)

  return {
    phase: "live_prep",
    unlocked: blockers.length === 0,
    requirements,
    blockers,
  }
}

export function evaluateGoLiveGate(
  state: UserState,
  phaseState: LivePhaseState,
  scores?: CompetenceScores
): PhaseGateResult {
  const s = scores ?? computeBehavioralCompetence(state)
  const journalRate = journalCompletionRate(state)

  const requirements = [
    {
      label: "Overall competence ≥ 80%",
      met: s.overallScore >= PHASE_THRESHOLDS.goLive.overall,
      detail: `${s.overallScore}%`,
    },
    {
      label: "Risk quiz passed (position sizing)",
      met: phaseState.riskQuizPassed,
    },
    {
      label: "Losing streak scenario passed",
      met: phaseState.losingStreakScenarioPassed,
    },
    {
      label: "Strategy clarity check passed",
      met: phaseState.strategyClarityPassed,
    },
    {
      label: "Journal completion rate ≥ 80%",
      met: journalRate >= PHASE_THRESHOLDS.goLive.journalRate,
      detail: `${journalRate}%`,
    },
    {
      label: "No emotional rule violations in phase",
      met: phaseState.emotionalViolations === 0,
      detail:
        phaseState.emotionalViolations > 0
          ? `${phaseState.emotionalViolations} violations`
          : "Clean",
    },
  ]

  const blockers = requirements.filter((r) => !r.met).map((r) => r.label)

  return {
    phase: "go_live",
    unlocked: blockers.length === 0,
    requirements,
    blockers,
  }
}

export function resolveCurrentPhase(
  state: UserState,
  phaseState: LivePhaseState
): LiveTradingPhase {
  if (phaseState.goLiveUnlockedAt && phaseState.riskQuizPassed) {
    return "live_active"
  }
  if (phaseState.goLiveUnlockedAt) return "go_live"
  if (phaseState.livePrepUnlockedAt) return "live_prep"
  if (phaseState.simulatedUnlockedAt) return "simulated"
  return "education"
}

export function getNextPhaseAction(
  state: UserState,
  phaseState: LivePhaseState
): { title: string; href: string; reason: string } {
  const scores = computeBehavioralCompetence(state)
  const current = resolveCurrentPhase(state, phaseState)

  if (current === "education") {
    const gate = evaluateSimulatedGate(state, scores)
    if (!gate.unlocked) {
      return {
        title: scores.recommendedNextModule.includes("psychology")
          ? "Build emotional discipline"
          : "Strengthen weakest skill",
        href: scores.recommendedNextModule,
        reason: gate.blockers[0] ?? "Improve competence scores",
      }
    }
    return {
      title: "Unlock Simulated Trading",
      href: "/progression/live-transition",
      reason: "You've met the requirements for paper trading",
    }
  }

  if (current === "simulated") {
    return {
      title: "Continue simulated practice",
      href: "/training",
      reason: "Build consistency with 1% max risk per trade",
    }
  }

  if (current === "live_prep") {
    const gate = evaluateGoLiveGate(state, phaseState, scores)
    if (!gate.unlocked) {
      return {
        title: "Complete go-live checklist",
        href: "/progression/live-transition",
        reason: gate.blockers[0] ?? "Pass remaining gates",
      }
    }
    return {
      title: "Enter Go Live Gate",
      href: "/progression/live-transition",
      reason: "Final checks before live trading",
    }
  }

  return {
    title: "Maintain discipline",
    href: "/journal",
    reason: "Continue journaling and risk management",
  }
}
