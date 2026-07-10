"use client"

import Link from "next/link"
import { ArrowRightIcon, BrainIcon, LineChartIcon } from "lucide-react"

import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getLessonById, getPathBySlug } from "@/content/registry"
import type { UserState } from "@/lib/user-state/types"

const MS_PATH_ID = "market-structure-mastery"
const MS_LESSON_ORDER = [
  "ms-what-is-structure",
  "ms-bullish-structure",
  "ms-bearish-structure",
  "ms-four-point-rule",
  "ms-trend-detection",
  "ms-continuation-reversal",
  "ms-structure-replay",
  "ms-phases",
  "ms-trend-builder",
  "ms-trend-quality",
  "ms-capstone",
  "ms-quiz",
] as const

function getMarketStructurePracticeTarget(state: UserState) {
  const completed = new Set(state.lessonProgress.map((l) => l.lessonId))

  if (
    completed.has("ms-continuation-reversal") &&
    !completed.has("ms-structure-replay")
  ) {
    const lesson = getLessonById("ms-structure-replay")
    return {
      lessonId: "ms-structure-replay",
      title: lesson?.title ?? "Structure Replay",
      slug: lesson?.slug ?? "structure-replay",
      isReplay: true,
      headline: "Structure Replay — Train your market reading",
      subline:
        "Reveal candles one at a time, then classify the trend before hindsight makes it easy.",
    }
  }

  for (const lessonId of MS_LESSON_ORDER) {
    if (!completed.has(lessonId)) {
      const lesson = getLessonById(lessonId)
      if (!lesson) continue
      const isReplay = lessonId === "ms-structure-replay"
      return {
        lessonId,
        title: lesson.title,
        slug: lesson.slug,
        isReplay,
        headline: isReplay
          ? "Structure Replay — Train your market reading"
          : "Market Structure Mastery — Start here",
        subline: isReplay
          ? "The strongest practice loop in Trade Trainer: Trend Detective → Continuation → Replay."
          : lesson.description,
      }
    }
  }

  const lesson = getLessonById("ms-structure-replay")
  return {
    lessonId: "ms-structure-replay",
    title: lesson?.title ?? "Structure Replay",
    slug: lesson?.slug ?? "structure-replay",
    isReplay: true,
    headline: "Structure Replay — Keep sharpening your reads",
    subline:
      "Run replay drills again. Pattern recognition only sticks with hundreds of reps.",
  }
}

export function MarketStructurePracticeCard() {
  const { state, patternRecognitionStats } = useUserState()
  const target = getMarketStructurePracticeTarget(state)
  const path = getPathBySlug(MS_PATH_ID)
  const href = `/paths/${path?.slug ?? MS_PATH_ID}/lessons/${target.slug}`
  const completedCount = MS_LESSON_ORDER.filter((id) =>
    state.lessonProgress.some((l) => l.lessonId === id)
  ).length
  const pathPercent = Math.round((completedCount / MS_LESSON_ORDER.length) * 100)
  const hasPatternScore =
    patternRecognitionStats.totalAttempts > 0 || patternRecognitionStats.overall > 0

  return (
    <div className="rounded-xl border border-primary/40 bg-gradient-to-br from-primary/15 via-primary/5 to-card/80 p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Recommended next
          </p>
          <div className="flex items-center gap-2">
            {target.isReplay ? (
              <LineChartIcon className="size-5 text-primary" />
            ) : (
              <BrainIcon className="size-5 text-primary" />
            )}
            <h2 className="text-xl font-semibold tracking-tight">{target.headline}</h2>
          </div>
          <p className="max-w-xl text-sm text-muted-foreground">{target.subline}</p>
          {completedCount > 0 && (
            <div className="max-w-xs pt-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Market Structure path</span>
                <span>
                  {completedCount}/{MS_LESSON_ORDER.length} lessons
                </span>
              </div>
              <Progress value={pathPercent} className="mt-1.5 h-1.5" />
            </div>
          )}
          {hasPatternScore && (
            <p className="text-xs text-primary">
              Pattern Recognition: {patternRecognitionStats.overall}% overall
              {patternRecognitionStats.weakestArea
                ? ` · focus: ${patternRecognitionStats.weakestArea.replace("-", " ")}`
                : ""}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button size="lg" render={<Link href={href} />}>
            {target.isReplay ? "Start Structure Replay" : "Start Market Structure"}
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          {completedCount > 0 && !target.isReplay && (
            <Button
              size="lg"
              variant="outline"
              render={
                <Link href="/paths/market-structure-mastery/lessons/structure-replay" />
              }
            >
              Jump to Replay
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
