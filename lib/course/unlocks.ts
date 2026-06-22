import {
  getAllLessons,
  getFlatLessonOrder,
  getPathBySlug,
} from "@/content/registry"
import type { CourseLesson } from "@/lib/course/types"

export interface UserProgressSnapshot {
  completedLessonIds: string[]
  activePathId: string | null
}

export function isLessonCompleted(
  lessonId: string,
  progress: UserProgressSnapshot
): boolean {
  return progress.completedLessonIds.includes(lessonId)
}

export function arePrerequisitesMet(
  lesson: CourseLesson,
  progress: UserProgressSnapshot
): boolean {
  return lesson.prerequisites.every((id) =>
    progress.completedLessonIds.includes(id)
  )
}

export function isLessonUnlocked(
  lesson: CourseLesson,
  progress: UserProgressSnapshot,
  pathLocked: boolean
): boolean {
  if (pathLocked) return false
  if (lesson.prerequisites.length === 0) return true
  return arePrerequisitesMet(lesson, progress)
}

export function getUnlockedLessons(
  pathId: string,
  progress: UserProgressSnapshot
): CourseLesson[] {
  const path = getPathBySlug(pathId)
  if (!path) return []
  return getFlatLessonOrder(pathId).filter((l) =>
    isLessonUnlocked(l, progress, path.locked)
  )
}

export function getPathProgressPercent(
  pathId: string,
  progress: UserProgressSnapshot
): number {
  const path = getPathBySlug(pathId)
  if (!path || path.status !== "available") return 0

  const lessons = getFlatLessonOrder(pathId).filter(
    (l) => l.xpReward > 0 || l.lessonType !== "reading" || l.contentBlocks.length > 0
  )
  if (lessons.length === 0) return 0

  const completed = lessons.filter((l) =>
    progress.completedLessonIds.includes(l.id)
  ).length
  return Math.round((completed / lessons.length) * 100)
}

export function getNextIncompleteLesson(
  pathId: string,
  progress: UserProgressSnapshot
): CourseLesson | null {
  const path = getPathBySlug(pathId)
  if (!path) return null

  for (const lesson of getFlatLessonOrder(pathId)) {
    if (progress.completedLessonIds.includes(lesson.id)) continue
    if (isLessonUnlocked(lesson, progress, path.locked)) return lesson
  }
  return null
}

export function getRecommendedLessonId(
  progress: UserProgressSnapshot
): string {
  const activePath = progress.activePathId ?? "trading-foundations"
  const next = getNextIncompleteLesson(activePath, progress)
  if (next) return next.id

  const firstIncomplete = getAllLessons().find(
    (l) => !progress.completedLessonIds.includes(l.id)
  )
  return firstIncomplete?.id ?? "tf-m1-what-is-trading"
}

export function getLessonCtaLabel(
  lesson: CourseLesson,
  completed: boolean,
  unlocked: boolean
): string {
  if (!unlocked) return "Locked"
  if (completed) return "Review"
  switch (lesson.lessonType) {
    case "quiz":
      return "Start Quiz"
    case "chart-drill":
      return "Start Drill"
    case "reflection":
      return "Reflect"
    case "interactive":
      return "Start Exercise"
    default:
      return "Start"
  }
}
