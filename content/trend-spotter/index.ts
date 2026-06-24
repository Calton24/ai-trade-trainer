import { ALL_TREND_LESSONS, TREND_SPOTTER_MODULES } from "@/content/trend-spotter/curriculum"
import {
  getAllTrendScenarios,
  getChallengeDeck,
  getTrendScenario,
  TREND_SPOTTER_DISCLAIMER,
} from "@/content/trend-spotter/scenarios"
import type { TrendSpotterLesson, TrendSpotterModule } from "@/lib/trend-spotter/types"

export {
  TREND_SPOTTER_DISCLAIMER,
  getChallengeDeck,
  getAllTrendScenarios,
  getTrendScenario,
  ALL_TREND_LESSONS,
  TREND_SPOTTER_MODULES,
}

const LESSON_MAP = new Map(ALL_TREND_LESSONS.map((l) => [l.slug, l]))

export function getAllTrendModules(): TrendSpotterModule[] {
  return TREND_SPOTTER_MODULES
}

export function getTrendLesson(slug: string): TrendSpotterLesson | undefined {
  return LESSON_MAP.get(slug)
}

export function getRecommendedTrendLessonSlug(completedIds: string[]): string {
  const next = ALL_TREND_LESSONS.find((l) => !completedIds.includes(l.id))
  return next?.slug ?? ALL_TREND_LESSONS[0]?.slug ?? "what-is-a-trend"
}

const CLASSIFICATION_LESSON_SLUG: Record<
  import("@/lib/trend-spotter/types").TrendClassification,
  string
> = {
  uptrend: "uptrend-vs-downtrend",
  downtrend: "uptrend-vs-downtrend",
  range: "trend-vs-range",
  messy: "messy-charts",
}

export function getRecommendedLessonForClassification(
  classification: import("@/lib/trend-spotter/types").TrendClassification
): string {
  return CLASSIFICATION_LESSON_SLUG[classification] ?? "what-is-a-trend"
}

export function getTrendModuleForLesson(
  lesson: TrendSpotterLesson
): TrendSpotterModule | undefined {
  return TREND_SPOTTER_MODULES.find((m) => m.id === lesson.moduleId)
}
