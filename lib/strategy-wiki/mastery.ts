import type {
  MasteryLevel,
  StrategyProgressRecord,
} from "@/lib/strategy-wiki/types"

export function calculateMasteryLevel(
  record: StrategyProgressRecord,
  lessonsCompleted: boolean
): MasteryLevel {
  if (!lessonsCompleted && record.practiceAttempts === 0) {
    return "not_started"
  }
  if (record.practiceAttempts === 0 && lessonsCompleted) {
    return "learning"
  }
  if (record.practiceAttempts < 3) {
    return lessonsCompleted ? "learning" : "practising"
  }
  if (record.practiceAttempts < 5 || record.averageScore < 70) {
    return "practising"
  }
  if (record.practiceAttempts < 10 || record.averageScore < 80) {
    return "competent"
  }
  const recentHigh =
    record.recentHighScores.filter((s) => s >= 85).length >= 3
  if (
    record.practiceAttempts >= 20 &&
    record.averageScore >= 85 &&
    recentHigh
  ) {
    return "mastered"
  }
  if (record.practiceAttempts >= 10 && record.averageScore >= 80) {
    return "strong"
  }
  return "competent"
}

export function masteryLabel(level: MasteryLevel): string {
  const labels: Record<MasteryLevel, string> = {
    not_started: "Not Started",
    learning: "Learning",
    practising: "Practising",
    competent: "Competent",
    strong: "Strong",
    mastered: "Mastered",
  }
  return labels[level]
}

export function updateProgressAfterPractice(
  record: StrategyProgressRecord,
  score: number,
  confidence: number,
  lessonsCompleted: boolean
): StrategyProgressRecord {
  const attempts = record.practiceAttempts + 1
  const avg =
    record.practiceAttempts === 0
      ? score
      : Math.round(
          (record.averageScore * record.practiceAttempts + score) / attempts
        )
  const recent = [score, ...record.recentHighScores].slice(0, 5)
  const updated: StrategyProgressRecord = {
    ...record,
    practiceAttempts: attempts,
    averageScore: avg,
    bestScore: Math.max(record.bestScore, score),
    confidenceSum: record.confidenceSum + confidence,
    confidenceCount: record.confidenceCount + 1,
    lastPractisedAt: new Date().toISOString(),
    recentHighScores: recent,
    masteryLevel: "practising",
  }
  updated.masteryLevel = calculateMasteryLevel(updated, lessonsCompleted)
  return updated
}
