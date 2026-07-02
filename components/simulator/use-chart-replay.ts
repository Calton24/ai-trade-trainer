"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { REPLAY_INTERVAL_MS } from "@/lib/simulator/replay"
import type { ReplaySpeed } from "@/lib/simulator/types"

interface UseChartReplayOptions {
  minIndex?: number
  maxIndex: number
  initialIndex?: number
  autoPlay?: boolean
}

export function useChartReplay({
  minIndex = 0,
  maxIndex,
  initialIndex,
  autoPlay = false,
}: UseChartReplayOptions) {
  const start = initialIndex ?? minIndex
  const [currentIndex, setCurrentIndex] = useState(start)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [speed, setSpeed] = useState<ReplaySpeed>(1)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsPlaying(false)
  }, [])

  const play = useCallback(() => {
    if (currentIndex >= maxIndex) {
      setCurrentIndex(minIndex)
    }
    setIsPlaying(true)
  }, [currentIndex, maxIndex, minIndex])

  const pause = useCallback(() => stop(), [stop])

  const next = useCallback(() => {
    setCurrentIndex((i) => Math.min(maxIndex, i + 1))
  }, [maxIndex])

  const prev = useCallback(() => {
    setCurrentIndex((i) => Math.max(minIndex, i - 1))
  }, [minIndex])

  const reset = useCallback(() => {
    stop()
    setCurrentIndex(start)
  }, [start, stop])

  useEffect(() => {
    if (!isPlaying) return
    timerRef.current = setInterval(() => {
      setCurrentIndex((i) => {
        if (i >= maxIndex) {
          stop()
          return i
        }
        return i + 1
      })
    }, REPLAY_INTERVAL_MS[speed])
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, speed, maxIndex, stop])

  useEffect(() => {
    setCurrentIndex((i) => Math.min(Math.max(i, minIndex), maxIndex))
  }, [minIndex, maxIndex])

  return {
    currentIndex,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    next,
    prev,
    reset,
    setCurrentIndex,
    atEnd: currentIndex >= maxIndex,
    atStart: currentIndex <= minIndex,
  }
}
