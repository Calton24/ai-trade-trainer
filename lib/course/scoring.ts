import type { CourseLesson } from "./types"

export function calculateXPFromLesson(lesson: CourseLesson): number {
  return lesson.xpReward
}
