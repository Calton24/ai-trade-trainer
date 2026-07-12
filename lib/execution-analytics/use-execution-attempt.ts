"use client"

import { useCallback, useEffect, useRef } from "react"

import type { AttemptCompletePayload } from "@/lib/execution-analytics/types"
import type { ExecutionMode } from "@/lib/execution-lab/types"

interface UseExecutionAttemptTrackingOptions {
  scenarioId: string
  mode: ExecutionMode
  enabled?: boolean
}

export function useExecutionAttemptTracking({
  scenarioId,
  mode,
  enabled = true,
}: UseExecutionAttemptTrackingOptions) {
  const attemptIdRef = useRef<string | null>(null)
  const startedRef = useRef(false)
  const completedRef = useRef(false)
  const meaningfulRef = useRef(false)
  const startPromiseRef = useRef<Promise<string | null> | null>(null)

  const markInteraction = useCallback(() => {
    meaningfulRef.current = true
  }, [])

  const ensureStarted = useCallback(async (): Promise<string | null> => {
    if (!enabled || completedRef.current) return attemptIdRef.current
    if (attemptIdRef.current) return attemptIdRef.current
    if (startPromiseRef.current) return startPromiseRef.current

    startPromiseRef.current = (async () => {
      try {
        const res = await fetch("/api/execution/attempt/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenarioId, mode }),
        })
        if (!res.ok) return null
        const data = (await res.json()) as { attemptId: string }
        attemptIdRef.current = data.attemptId
        startedRef.current = true
        return data.attemptId
      } catch {
        return null
      } finally {
        startPromiseRef.current = null
      }
    })()

    return startPromiseRef.current
  }, [enabled, scenarioId, mode])

  const completeAttempt = useCallback(
    async (payload: Omit<AttemptCompletePayload, "attemptId">) => {
      if (!enabled || completedRef.current) return null
      const attemptId = await ensureStarted()
      if (!attemptId) return null

      completedRef.current = true
      try {
        const res = await fetch("/api/execution/attempt/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, attemptId }),
        })
        if (!res.ok) return null
        return (await res.json()) as {
          executionScore: number
          mistakeCodes: string[]
        }
      } catch {
        return null
      }
    },
    [enabled, ensureStarted]
  )

  const abandonAttempt = useCallback(async () => {
    if (!enabled || completedRef.current || !attemptIdRef.current) return
    const attemptId = attemptIdRef.current
    attemptIdRef.current = null
    try {
      await fetch("/api/execution/attempt/abandon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId,
          meaningfulInteraction: meaningfulRef.current,
        }),
      })
    } catch {
      // best-effort
    }
  }, [enabled])

  useEffect(() => {
    return () => {
      void abandonAttempt()
    }
  }, [abandonAttempt])

  useEffect(() => {
    attemptIdRef.current = null
    startedRef.current = false
    completedRef.current = false
    meaningfulRef.current = false
    startPromiseRef.current = null
  }, [scenarioId, mode])

  return {
    markInteraction,
    ensureStarted,
    completeAttempt,
    abandonAttempt,
  }
}
