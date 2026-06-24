import type { TraderLevel } from "./types"

export function getTraderLevel(score: number): TraderLevel {
  if (score >= 96) return "elite"
  if (score >= 81) return "consistent"
  if (score >= 61) return "structured"
  if (score >= 31) return "developing"
  return "beginner"
}

export function traderLevelLabel(level: TraderLevel): string {
  const labels: Record<TraderLevel, string> = {
    beginner: "Beginner Trader",
    developing: "Developing Trader",
    structured: "Structured Trader",
    consistent: "Consistent Trader",
    elite: "Elite Trader",
  }
  return labels[level]
}

export function traderLevelDescription(level: TraderLevel): string {
  const descriptions: Record<TraderLevel, string> = {
    beginner:
      "Building foundational knowledge. Focus on core concepts before live practice.",
    developing:
      "Growing skills with gaps to close. Targeted practice will accelerate progress.",
    structured:
      "Solid framework in place. Refine weak areas to move toward consistency.",
    consistent:
      "Strong across most pillars. Fine-tune psychology and edge cases.",
    elite:
      "Exceptional readiness. Maintain discipline and continue journaling.",
  }
  return descriptions[level]
}

export function traderLevelRange(level: TraderLevel): string {
  const ranges: Record<TraderLevel, string> = {
    beginner: "0–30%",
    developing: "31–60%",
    structured: "61–80%",
    consistent: "81–95%",
    elite: "96–100%",
  }
  return ranges[level]
}
