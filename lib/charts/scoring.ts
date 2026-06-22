import type {
  ChartScenario,
  ChartScoreResult,
  ExpectedMarker,
  ScoredMarker,
  UserMarker,
} from "@/lib/charts/types"

const LEVEL_TOOLS = new Set(["support", "resistance"])

/** True when a user marker satisfies an expected marker within tolerances. */
function markerMatches(
  expected: ExpectedMarker,
  marker: UserMarker
): boolean {
  if (marker.tool !== expected.tool) return false

  const priceOk =
    expected.price === undefined ||
    expected.tolerancePrice === undefined ||
    Math.abs(marker.price - expected.price) <= expected.tolerancePrice

  // Level tools (support/resistance) only care about price, not the candle.
  if (LEVEL_TOOLS.has(expected.tool)) return priceOk

  const indexOk =
    expected.index === undefined ||
    expected.toleranceIndex === undefined ||
    Math.abs(marker.index - expected.index) <= expected.toleranceIndex

  return priceOk && indexOk
}

/**
 * Score a learner's markers against a scenario's expected answer and produce
 * beginner-friendly, structured feedback.
 */
export function scoreScenario(
  scenario: ChartScenario,
  markers: UserMarker[]
): ChartScoreResult {
  const expected = scenario.expectedAnswer
  if (!expected || expected.requiredMarkers.length === 0) {
    return {
      score: 100,
      passed: true,
      correct: ["You explored the chart."],
      improvements: [],
      tip: "Keep practising — repetition builds pattern recognition.",
      summary: "Exploration complete.",
      scored: [],
    }
  }

  const totalWeight = expected.requiredMarkers.reduce(
    (acc, m) => acc + (m.weight ?? 1),
    0
  )

  const usedMarkerIds = new Set<string>()
  const scored: ScoredMarker[] = expected.requiredMarkers.map((req) => {
    const match = markers.find(
      (m) => !usedMarkerIds.has(m.id) && markerMatches(req, m)
    )
    if (match) usedMarkerIds.add(match.id)
    return {
      expected: req,
      matched: Boolean(match),
      userMarker: match,
      note: match
        ? `You correctly marked ${req.label}.`
        : `Missing or off-target: ${req.label}.`,
    }
  })

  const earnedWeight = scored.reduce(
    (acc, s) => acc + (s.matched ? s.expected.weight ?? 1 : 0),
    0
  )
  const score = Math.round((earnedWeight / totalWeight) * 100)
  const passed = score >= 60

  const correct = scored.filter((s) => s.matched).map((s) => s.note)
  const improvements = scored.filter((s) => !s.matched).map((s) => s.note)

  // Penalise extra noise markers gently in the tip, not the score.
  const extras = markers.length - usedMarkerIds.size

  let tip: string
  if (passed && improvements.length === 0) {
    tip = "Clean read. Try the same concept on a different scenario to lock it in."
  } else if (improvements.length > 0) {
    tip = `Focus on ${improvements.length === 1 ? "the missing marker" : "the missing markers"} — re-read the hint and look for where price clearly turned.`
  } else {
    tip = "Good start. Tighten your placement closer to where price actually reacted."
  }
  if (extras > 0) {
    tip += ` You also placed ${extras} extra marker${extras > 1 ? "s" : ""} — keep it to what the task asks for.`
  }

  const summary = passed
    ? `You scored ${score}% — you can see this setup on the chart.`
    : `You scored ${score}%. Review the hint and the correct overlay, then try again.`

  return { score, passed, correct, improvements, tip, summary, scored }
}
