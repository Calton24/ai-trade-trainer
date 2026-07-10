import { entryStopTargetDrill } from "@/content/drills/entry-stop-target"
import { spotTheTrendDrill } from "@/content/drills/spot-the-trend"
import { forexBasicsPath } from "@/content/paths/forex-basics"
import { iccStrategyPath } from "@/content/paths/icc-strategy"
import { priceActionPath } from "@/content/paths/price-action"
import { professionalForexPath } from "@/content/paths/professional-forex"
import { riskManagementPath } from "@/content/paths/risk-management"
import { tradingFoundationsPath } from "@/content/paths/trading-foundations"
import { tradingPsychologyPath } from "@/content/paths/trading-psychology"
import { FOREX_BASICS_QUIZZES } from "@/content/quizzes/forex-basics-checks"
import { iccCheckQuiz } from "@/content/quizzes/icc-check"
import { priceActionLevelsCheckQuiz } from "@/content/quizzes/price-action-check"
import { PROFESSIONAL_FOREX_QUIZZES } from "@/content/quizzes/professional-forex-checks"
import { RISK_MANAGEMENT_QUIZZES } from "@/content/quizzes/risk-management-checks"
import { TRADING_PSYCHOLOGY_QUIZZES } from "@/content/quizzes/trading-psychology-checks"
import {
  candlestickBasicsQuiz,
  tradingBasicsCheckQuiz,
} from "@/content/quizzes/trading-basics-check"
import {
  calculateDrillTime,
  calculateLessonTime,
  calculateModuleTime,
  calculatePathTime,
  calculateQuizTime,
  formatApproxDuration,
  formatDuration,
  lessonTypeDefaultMinutes,
} from "@/lib/course/time-estimates"
import type {
  ChartDrill,
  CourseLesson,
  CourseModule,
  CourseQuiz,
  LearningPathContent,
  PathCardData,
  PathContentStats,
} from "@/lib/course/types"

const RAW_PATHS = [
  tradingFoundationsPath,
  forexBasicsPath,
  priceActionPath,
  iccStrategyPath,
  riskManagementPath,
  tradingPsychologyPath,
  professionalForexPath,
]

const RAW_QUIZZES: CourseQuiz[] = [
  tradingBasicsCheckQuiz,
  candlestickBasicsQuiz,
  priceActionLevelsCheckQuiz,
  iccCheckQuiz,
  ...FOREX_BASICS_QUIZZES,
  ...RISK_MANAGEMENT_QUIZZES,
  ...TRADING_PSYCHOLOGY_QUIZZES,
  ...PROFESSIONAL_FOREX_QUIZZES,
]

const RAW_DRILLS: ChartDrill[] = [spotTheTrendDrill, entryStopTargetDrill]

function enrichLesson(
  lesson: CourseLesson,
  quizzes: Map<string, CourseQuiz>,
  drills: Map<string, ChartDrill>
): CourseLesson {
  let minutes = calculateLessonTime(lesson)

  if (lesson.lessonType === "quiz" && lesson.quizId) {
    const quiz = quizzes.get(lesson.quizId)
    minutes = quiz ? calculateQuizTime(quiz) : lessonTypeDefaultMinutes("quiz")
  } else if (lesson.lessonType === "chart-drill" && lesson.drillId) {
    const drill = drills.get(lesson.drillId)
    minutes = drill
      ? calculateDrillTime(drill.drillType)
      : lessonTypeDefaultMinutes("chart-drill")
  } else if (minutes < 1 && lesson.contentBlocks.length === 0) {
    minutes = lessonTypeDefaultMinutes(lesson.lessonType)
  }

  return { ...lesson, estimatedMinutes: Math.max(1, Math.round(minutes)) }
}

function computeStats(modules: CourseModule[]): PathContentStats {
  const lessons = modules.flatMap((m) => m.lessons)
  return {
    moduleCount: modules.length,
    lessonCount: lessons.filter((l) =>
      ["reading", "interactive"].includes(l.lessonType)
    ).length,
    quizCount: lessons.filter((l) => l.lessonType === "quiz").length,
    drillCount: lessons.filter((l) => l.lessonType === "chart-drill").length,
    reflectionCount: lessons.filter((l) => l.lessonType === "reflection").length,
  }
}

function enrichPath(path: LearningPathContent): LearningPathContent {
  const quizMap = new Map(RAW_QUIZZES.map((q) => [q.id, q]))
  const drillMap = new Map(RAW_DRILLS.map((d) => [d.id, d]))

  const modules = path.modules.map((mod) => {
    const lessons = mod.lessons.map((l) =>
      enrichLesson(l, quizMap, drillMap)
    )
    const enrichedMod = { ...mod, lessons }
    return {
      ...enrichedMod,
      estimatedMinutes: Math.round(calculateModuleTime(enrichedMod)),
    }
  })

  const enriched: LearningPathContent = {
    ...path,
    modules,
    stats: computeStats(modules),
  }

  return {
    ...enriched,
    estimatedMinutes: Math.round(calculatePathTime(enriched)),
  }
}

const PATHS: LearningPathContent[] = RAW_PATHS.map(enrichPath)
const QUIZZES: CourseQuiz[] = RAW_QUIZZES
const DRILLS: ChartDrill[] = RAW_DRILLS

export function getAllPaths(): LearningPathContent[] {
  return PATHS
}

export function getPathBySlug(slug: string): LearningPathContent | undefined {
  return PATHS.find((p) => p.slug === slug || p.id === slug)
}

export function getPathById(id: string): LearningPathContent | undefined {
  return getPathBySlug(id)
}

export function getAllLessons(): CourseLesson[] {
  return PATHS.flatMap((p) => p.modules.flatMap((m) => m.lessons))
}

export function getLessonBySlug(
  pathSlug: string,
  lessonSlug: string
): CourseLesson | undefined {
  const path = getPathBySlug(pathSlug)
  if (!path) return undefined
  return path.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.slug === lessonSlug)
}

export function getLessonById(lessonId: string): CourseLesson | undefined {
  return getAllLessons().find((l) => l.id === lessonId)
}

export function getModuleForLesson(lessonId: string): CourseModule | undefined {
  for (const path of PATHS) {
    for (const mod of path.modules) {
      if (mod.lessons.some((l) => l.id === lessonId)) return mod
    }
  }
  return undefined
}

export function getQuizById(quizId: string): CourseQuiz | undefined {
  return QUIZZES.find((q) => q.id === quizId)
}

export function getAllQuizzes(): CourseQuiz[] {
  return QUIZZES
}

export function getDrillById(drillId: string): ChartDrill | undefined {
  return DRILLS.find((d) => d.id === drillId)
}

export function getAllDrills(): ChartDrill[] {
  return DRILLS
}

export function getFlatLessonOrder(pathId: string): CourseLesson[] {
  const path = getPathBySlug(pathId)
  if (!path) return []
  return path.modules
    .slice()
    .sort((a, b) => a.order - b.order)
    .flatMap((m) => m.lessons.slice().sort((a, b) => a.order - b.order))
}

export function getNextLesson(
  pathId: string,
  currentLessonId: string
): CourseLesson | null {
  const order = getFlatLessonOrder(pathId)
  const idx = order.findIndex((l) => l.id === currentLessonId)
  if (idx === -1 || idx === order.length - 1) return null
  return order[idx + 1]
}

export function getPreviousLesson(
  pathId: string,
  currentLessonId: string
): CourseLesson | null {
  const order = getFlatLessonOrder(pathId)
  const idx = order.findIndex((l) => l.id === currentLessonId)
  if (idx <= 0) return null
  return order[idx - 1]
}

export function getFirstLesson(pathId: string): CourseLesson | null {
  const order = getFlatLessonOrder(pathId)
  return order[0] ?? null
}

export function getLessonHref(pathSlug: string, lessonSlug: string): string {
  return `/paths/${pathSlug}/lessons/${lessonSlug}`
}

export function getLessonHrefById(lessonId: string): string {
  const lesson = getLessonById(lessonId)
  if (!lesson) return "/paths"
  const path = getPathBySlug(lesson.pathId)
  return getLessonHref(path?.slug ?? lesson.pathId, lesson.slug)
}

export function getPathCardData(
  path: LearningPathContent,
  progressPercent = 0
): PathCardData {
  return {
    id: path.id,
    slug: path.slug,
    title: path.title,
    description: path.description,
    level: path.level,
    status: path.status,
    locked: path.locked,
    estimatedMinutes: path.estimatedMinutes,
    estimatedTimeLabel: formatApproxDuration(path.estimatedMinutes),
    stats: path.stats,
    progressPercent,
    skillsYouGain: path.skillsYouGain,
    whatYouLearn: path.whatYouLearn,
    relatedPathSlugs: path.relatedPathSlugs,
  }
}

export { formatDuration, formatApproxDuration }

export {
  getNextIncompleteLesson,
  getRecommendedLessonId,
  getPathProgressPercent,
  isLessonUnlocked,
  getUnlockedLessons,
  getLessonCtaLabel,
} from "@/lib/course/unlocks"

export type { UserProgressSnapshot } from "@/lib/course/unlocks"
