import { HEALTH_CONFIG, QUALITY_WEIGHTS, type ScenarioHealthLabel } from "./health-config"

export interface ScenarioQualityInput {
  sampleSize: number
  completionRate: number
  abandonmentRate: number
  averageScore: number
  scoreStdDev: number
  averageHints: number
  revealRate: number
  decisionCorrectnessRate: number
  averageConfidenceGap: number
  medianDurationSeconds: number
}

/**
 * Internal content-quality score (0–100). NOT a learner grade.
 *
 * Formula (weighted sum, clamped 0–100):
 * - completionRate: healthy mid-range completion suggests appropriate difficulty
 * - abandonmentInverse: 1 - abandonmentRate
 * - scoreSpread: moderate avg score (~65–78) scores highest; extremes penalized
 * - hintIndependence: fewer hints per completion is better
 * - revealIndependence: lower reveal rate is better
 * - decisionAlignment: % correct decisions vs intended behaviour
 * - calibration: lower confidence gap is better
 *
 * Returns null when sample size < minSampleSize — avoid false confidence.
 */
export function computeScenarioQualityScore(input: ScenarioQualityInput): number | null {
  if (input.sampleSize < HEALTH_CONFIG.minSampleSize) return null

  const completionComponent = clamp01(input.completionRate) * 100
  const abandonmentComponent = clamp01(1 - input.abandonmentRate) * 100

  const scoreSpreadComponent = scoreSpreadQuality(input.averageScore)

  const hintComponent = clamp01(1 - input.averageHints / 4) * 100
  const revealComponent = clamp01(1 - input.revealRate) * 100
  const decisionComponent = clamp01(input.decisionCorrectnessRate) * 100
  const calibrationComponent = clamp01(1 - input.averageConfidenceGap / 40) * 100

  const raw =
    completionComponent * QUALITY_WEIGHTS.completionRate +
    abandonmentComponent * QUALITY_WEIGHTS.abandonmentInverse +
    scoreSpreadComponent * QUALITY_WEIGHTS.scoreSpread +
    hintComponent * QUALITY_WEIGHTS.hintIndependence +
    revealComponent * QUALITY_WEIGHTS.revealIndependence +
    decisionComponent * QUALITY_WEIGHTS.decisionAlignment +
    calibrationComponent * QUALITY_WEIGHTS.calibration

  return Math.round(Math.max(0, Math.min(100, raw)))
}

function scoreSpreadQuality(avg: number): number {
  const ideal = 72
  const distance = Math.abs(avg - ideal)
  return Math.max(0, 100 - distance * 2.5)
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(1, n))
}

export function classifyScenarioHealth(input: ScenarioQualityInput): ScenarioHealthLabel {
  if (input.sampleSize < HEALTH_CONFIG.minSampleSize) return "needs-data"

  const { tooEasy, tooHard, confusing, healthy } = HEALTH_CONFIG

  if (
    input.completionRate >= tooEasy.minCompletionRate &&
    input.averageScore >= tooEasy.minAvgScore &&
    input.averageHints <= tooEasy.maxAvgHints &&
    input.revealRate <= tooEasy.maxRevealRate
  ) {
    return "too-easy"
  }

  if (
    input.completionRate <= tooHard.maxCompletionRate ||
    (input.averageScore <= tooHard.maxAvgScore && input.revealRate >= tooHard.minRevealRate)
  ) {
    return "too-hard"
  }

  if (
    input.abandonmentRate >= confusing.minAbandonmentRate ||
    (input.averageHints >= confusing.minAvgHints &&
      input.medianDurationSeconds >= confusing.minMedianDurationSeconds) ||
    input.decisionCorrectnessRate <= confusing.maxDecisionCorrectness
  ) {
    return "confusing"
  }

  if (
    input.completionRate >= healthy.minCompletionRate &&
    input.completionRate <= healthy.maxCompletionRate &&
    input.averageScore >= healthy.minAvgScore &&
    input.averageScore <= healthy.maxAvgScore &&
    input.revealRate <= healthy.maxRevealRate
  ) {
    return "healthy"
  }

  return "healthy"
}

export const HEALTH_LABEL_DISPLAY: Record<ScenarioHealthLabel, string> = {
  "too-easy": "Too Easy",
  healthy: "Healthy",
  "too-hard": "Too Hard",
  confusing: "Confusing",
  "needs-data": "Needs Data",
}
