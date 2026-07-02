import {
  evaluateGoLiveGate,
  evaluateLivePrepGate,
  evaluateSimulatedGate,
  resolveCurrentPhase,
} from "./live-trading-phases"
import type { LivePhaseState } from "./types"
import type { UserState } from "@/lib/user-state/types"

export type GoLiveChecklistField =
  | "riskQuizPassed"
  | "losingStreakScenarioPassed"
  | "strategyClarityPassed"

export function updateLivePhaseState(
  state: UserState,
  patch: Partial<LivePhaseState>
): UserState {
  const nextPhase: LivePhaseState = {
    ...state.liveTradingPhase,
    ...patch,
  }
  nextPhase.currentPhase = resolveCurrentPhase(state, nextPhase)
  return { ...state, liveTradingPhase: nextPhase }
}

export function unlockSimulatedTrading(state: UserState): UserState | null {
  const gate = evaluateSimulatedGate(state)
  if (!gate.unlocked) return null

  return updateLivePhaseState(state, {
    simulatedUnlockedAt: state.liveTradingPhase.simulatedUnlockedAt ?? new Date().toISOString(),
    currentPhase: "simulated",
  })
}

export function unlockLivePrep(state: UserState): UserState | null {
  const gate = evaluateLivePrepGate(state)
  if (!gate.unlocked) return null

  return updateLivePhaseState(state, {
    livePrepUnlockedAt: state.liveTradingPhase.livePrepUnlockedAt ?? new Date().toISOString(),
    currentPhase: "live_prep",
  })
}

export function unlockGoLive(state: UserState): UserState | null {
  const gate = evaluateGoLiveGate(state, state.liveTradingPhase)
  if (!gate.unlocked) return null

  return updateLivePhaseState(state, {
    goLiveUnlockedAt: state.liveTradingPhase.goLiveUnlockedAt ?? new Date().toISOString(),
    currentPhase: "go_live",
  })
}

export function passGoLiveChecklistItem(
  state: UserState,
  field: GoLiveChecklistField
): UserState {
  const patch: Partial<LivePhaseState> = { [field]: true }
  const next = updateLivePhaseState(state, patch)

  const gate = evaluateGoLiveGate(next, next.liveTradingPhase)
  if (gate.unlocked && !next.liveTradingPhase.goLiveUnlockedAt) {
    return updateLivePhaseState(next, {
      goLiveUnlockedAt: new Date().toISOString(),
      currentPhase: "go_live",
    })
  }

  if (
    next.liveTradingPhase.riskQuizPassed &&
    next.liveTradingPhase.losingStreakScenarioPassed &&
    next.liveTradingPhase.strategyClarityPassed
  ) {
    return updateLivePhaseState(next, { currentPhase: "live_active" })
  }

  return next
}
