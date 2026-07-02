export {
  computeBehavioralCompetence,
  hasCriticalWeakness,
} from "./behavioral-scoring"
export {
  evaluateSimulatedGate,
  evaluateLivePrepGate,
  evaluateGoLiveGate,
  resolveCurrentPhase,
  getNextPhaseAction,
  getDefaultPhaseState,
  PHASE_THRESHOLDS,
} from "./live-trading-phases"
export { resetWithArchive } from "./reset-with-archive"
export {
  unlockSimulatedTrading,
  unlockLivePrep,
  unlockGoLive,
  passGoLiveChecklistItem,
  updateLivePhaseState,
} from "./phase-actions"
export type { GoLiveChecklistField } from "./phase-actions"
export type {
  CompetencePillar,
  CompetenceScores,
  LiveTradingPhase,
  LivePhaseState,
  PhaseGateResult,
  BehavioralEventInput,
} from "./types"
export { PILLAR_LABELS, PHASE_LABELS } from "./types"
