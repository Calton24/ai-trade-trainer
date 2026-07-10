import type { StoredExecutionAttempt, ExecutionLabStats } from "@/lib/execution-lab/types"
import type { UserState } from "./types"

export function recordExecutionAttempt(
  state: UserState,
  attempt: Omit<StoredExecutionAttempt, "id" | "completedAt"> & { id?: string }
): UserState {
  const full: StoredExecutionAttempt = {
    ...attempt,
    id: attempt.id ?? crypto.randomUUID(),
    completedAt: new Date().toISOString(),
  }
  return {
    ...state,
    executionAttempts: [...state.executionAttempts, full],
  }
}

export function computeExecutionStats(state: UserState): ExecutionLabStats {
  const attempts = state.executionAttempts
  if (attempts.length === 0) {
    return {
      attempts: 0,
      averageScore: 0,
      winRate: 0,
      averageRR: 0,
      noTradeAccuracy: 0,
    }
  }

  const wins = attempts.filter((a) => a.outcome === "win").length
  const traded = attempts.filter((a) => a.outcome === "win" || a.outcome === "loss")
  const skipped = attempts.filter((a) => a.outcome === "skipped")
  const noTradeCorrect = skipped.filter((a) => a.executionScore >= 70).length

  return {
    attempts: attempts.length,
    averageScore: Math.round(
      attempts.reduce((s, a) => s + a.executionScore, 0) / attempts.length
    ),
    winRate: traded.length > 0 ? Math.round((wins / traded.length) * 100) : 0,
    averageRR:
      Math.round(
        (attempts.reduce((s, a) => s + a.rr, 0) / attempts.length) * 10
      ) / 10,
    noTradeAccuracy:
      skipped.length > 0 ? Math.round((noTradeCorrect / skipped.length) * 100) : 0,
  }
}
