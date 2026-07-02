import { SIMULATOR_STAGES } from "@/content/simulator/stages"
import { recordLearningActivity } from "@/lib/user-state/activity"
import type { UserState } from "@/lib/user-state/types"
import type {
  SimulatorSessionAttempt,
  SimulatorStageId,
  SimulatorStats,
  StoredSimulatorState,
} from "@/lib/simulator/types"
import { getInitialSimulatorState } from "@/lib/simulator/types"

export { getInitialSimulatorState }

const STAGE_UNLOCK_CHAIN: SimulatorStageId[] = [
  "chart-reading",
  "support-resistance",
  "trade-selection",
  "trade-planning",
  "trade-management",
]

function unlockNextStage(
  unlocked: SimulatorStageId[],
  completedStageId: SimulatorStageId
): SimulatorStageId[] {
  const idx = STAGE_UNLOCK_CHAIN.indexOf(completedStageId)
  if (idx < 0 || idx >= STAGE_UNLOCK_CHAIN.length - 1) return unlocked
  const next = STAGE_UNLOCK_CHAIN[idx + 1]
  return unlocked.includes(next) ? unlocked : [...unlocked, next]
}

export function recordSimulatorAttempt(
  state: UserState,
  attempt: Omit<SimulatorSessionAttempt, "id" | "completedAt"> & { id?: string }
): { state: UserState; sessionId: string } {
  const sessionId = attempt.id ?? crypto.randomUUID()
  const full: SimulatorSessionAttempt = {
    ...attempt,
    id: sessionId,
    completedAt: new Date().toISOString(),
  }

  const sim = state.simulator
  const stagePassed = attempt.passed
  const stageAlreadyDone = sim.completedStageIds.includes(attempt.stageId)
  const completedStageIds =
    stagePassed && !stageAlreadyDone
      ? [...sim.completedStageIds, attempt.stageId]
      : sim.completedStageIds

  const unlockedStageIds =
    stagePassed && !stageAlreadyDone
      ? unlockNextStage(sim.unlockedStageIds, attempt.stageId)
      : sim.unlockedStageIds

  let next: UserState = {
    ...state,
    simulator: {
      ...sim,
      attempts: [full, ...sim.attempts],
      completedStageIds,
      unlockedStageIds,
      simulatorXP: sim.simulatorXP + attempt.xpEarned,
      chartsReviewed: sim.chartsReviewed + 1,
      tradesJournaled:
        sim.tradesJournaled + (attempt.thesis && attempt.thesis.length > 5 ? 1 : 0),
    },
  }

  const stageMeta = SIMULATOR_STAGES.find((s) => s.id === attempt.stageId)
  const { state: withActivity } = recordLearningActivity(next, {
    type: "simulator-session-complete",
    source: "simulator",
    title: stageMeta?.title ?? "Simulator session",
    entityId: attempt.scenarioId,
    xpAwarded: attempt.xpEarned,
  })

  return { state: withActivity, sessionId }
}

export function computeSimulatorStats(state: UserState): SimulatorStats {
  const sim = state.simulator
  const attempts = sim.attempts
  const wins = attempts.filter((a) => a.outcome === "win").length
  const losses = attempts.filter((a) => a.outcome === "loss").length
  const closed = wins + losses

  const rrValues = attempts
    .map((a) => a.plan?.riskReward)
    .filter((v): v is number => typeof v === "number" && v > 0)

  const mistakeTags = attempts
    .filter((a) => !a.passed)
    .map((a) => a.stageId)
  const mistakeCounts = mistakeTags.reduce<Record<string, number>>((acc, id) => {
    acc[id] = (acc[id] ?? 0) + 1
    return acc
  }, {})
  const mostCommonMistake = Object.entries(mistakeCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0]

  const stageScores = attempts.reduce<Record<string, number[]>>((acc, a) => {
    if (!acc[a.stageId]) acc[a.stageId] = []
    acc[a.stageId].push(a.score)
    return acc
  }, {})

  const avg = (nums: number[]) =>
    nums.length ? Math.round(nums.reduce((s, n) => s + n, 0) / nums.length) : 0

  const stageAvgs = Object.entries(stageScores).map(([id, scores]) => ({
    id,
    avg: avg(scores),
  }))
  const best = stageAvgs.sort((a, b) => b.avg - a.avg)[0]
  const worst = stageAvgs.sort((a, b) => a.avg - b.avg)[0]

  const mgmtAttempts = attempts.filter((a) => a.stageId === "trade-management")
  const mgmtScore = avg(mgmtAttempts.map((a) => a.score))
  const planAttempts = attempts.filter((a) => a.stageId === "trade-planning")
  const planScore = avg(planAttempts.map((a) => a.score))

  const nextStage = STAGE_UNLOCK_CHAIN.find(
    (id) => !sim.completedStageIds.includes(id)
  )

  return {
    sessionsCompleted: attempts.length,
    stagesCompleted: sim.completedStageIds.length,
    totalStages: STAGE_UNLOCK_CHAIN.length,
    averageScore: avg(attempts.map((a) => a.score)),
    winRate: closed > 0 ? Math.round((wins / closed) * 100) : 0,
    averageRR:
      rrValues.length > 0
        ? Math.round((rrValues.reduce((s, n) => s + n, 0) / rrValues.length) * 10) / 10
        : 0,
    bestSetup: best ? best.id : null,
    worstSetup: worst ? worst.id : null,
    mostCommonMistake: mostCommonMistake ?? null,
    psychologyScore: mgmtScore,
    riskScore: planScore,
    chartsReviewed: sim.chartsReviewed,
    tradesJournaled: sim.tradesJournaled,
    currentStageId: nextStage ?? null,
    nextStageId: nextStage ?? null,
  }
}

export function isSimulatorStageUnlocked(
  state: UserState,
  stageId: SimulatorStageId
): boolean {
  return state.simulator.unlockedStageIds.includes(stageId)
}
