"use client"

import type { StoredChartLabSession, UserMarker } from "@/lib/charts/types"

const SESSIONS_KEY = "tt_chart_lab_sessions"

function readSessions(): Record<string, StoredChartLabSession> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(SESSIONS_KEY)
    return raw ? (JSON.parse(raw) as Record<string, StoredChartLabSession>) : {}
  } catch {
    return {}
  }
}

function writeSessions(sessions: Record<string, StoredChartLabSession>) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
  } catch {
    /* storage full or unavailable — ignore, charts still work in-memory */
  }
}

const listeners = new Set<() => void>()

/** Subscribe to chart-lab session changes (for useSyncExternalStore). */
export function subscribeChartLabSessions(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getChartLabSession(
  scenarioId: string
): StoredChartLabSession | null {
  return readSessions()[scenarioId] ?? null
}

/** Read just the saved score for a scenario, or null. Cheap to call in render. */
export function getChartLabScore(scenarioId: string): number | null {
  return readSessions()[scenarioId]?.score ?? null
}

export function saveChartLabSession(session: {
  scenarioId: string
  markers: UserMarker[]
  score: number
  passed: boolean
  summary: string
}) {
  const sessions = readSessions()
  sessions[session.scenarioId] = {
    ...session,
    completedAt: new Date().toISOString(),
  }
  writeSessions(sessions)
  for (const listener of listeners) listener()
}
