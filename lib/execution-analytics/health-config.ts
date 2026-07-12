/**
 * Central thresholds for scenario health labels and quality scoring.
 * Adjust here — do not scatter magic numbers across UI.
 */

export type ScenarioHealthLabel =
  | "too-easy"
  | "healthy"
  | "too-hard"
  | "confusing"
  | "needs-data"

export const HEALTH_CONFIG = {
  /** Minimum completed attempts before assigning a strong health verdict. */
  minSampleSize: 8,

  tooEasy: {
    minCompletionRate: 0.85,
    minAvgScore: 88,
    maxAvgHints: 0.8,
    maxRevealRate: 0.1,
  },
  tooHard: {
    maxCompletionRate: 0.45,
    maxAvgScore: 55,
    minRevealRate: 0.35,
  },
  confusing: {
    minAbandonmentRate: 0.4,
    minAvgHints: 2.5,
    minMedianDurationSeconds: 900,
    maxDecisionCorrectness: 0.55,
  },
  healthy: {
    minCompletionRate: 0.55,
    maxCompletionRate: 0.82,
    minAvgScore: 58,
    maxAvgScore: 85,
    maxRevealRate: 0.3,
  },
} as const

export const QUALITY_WEIGHTS = {
  completionRate: 0.22,
  abandonmentInverse: 0.18,
  scoreSpread: 0.15,
  hintIndependence: 0.15,
  revealIndependence: 0.1,
  decisionAlignment: 0.1,
  calibration: 0.1,
} as const
