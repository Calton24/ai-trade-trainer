"use client"

import { useCallback, useRef } from "react"

import { useUserState } from "@/components/providers/user-state-provider"
import type { PatternCategory } from "@/lib/user-state/pattern-recognition"

interface RecordAttemptInput {
  category: PatternCategory
  widgetKind: string
  correct: number
  total: number
  lessonId?: string
  confidence?: number
}

/** Records a single graded widget attempt (deduped per grading session). */
export function usePatternAttemptRecorder(lessonId?: string) {
  const { recordPatternAttempt } = useUserState()
  const sessionKeyRef = useRef<string | null>(null)

  const record = useCallback(
    (input: RecordAttemptInput) => {
      const key = `${input.widgetKind}:${input.correct}:${input.total}:${lessonId ?? ""}`
      if (sessionKeyRef.current === key) return
      sessionKeyRef.current = key

      const score =
        input.total > 0 ? Math.round((input.correct / input.total) * 100) : 0
      recordPatternAttempt({
        category: input.category,
        widgetKind: input.widgetKind,
        correct: input.correct,
        total: input.total,
        score,
        lessonId,
        confidence: input.confidence,
      })
    },
    [lessonId, recordPatternAttempt]
  )

  const resetSession = useCallback(() => {
    sessionKeyRef.current = null
  }, [])

  return { record, resetSession }
}
