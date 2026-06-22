export {
  getAllPaths,
  getPathBySlug,
  getPathById,
  getLessonBySlug,
  getLessonById,
  getModuleForLesson,
  getQuizById,
  getAllQuizzes,
  getDrillById,
  getAllDrills,
  getFlatLessonOrder,
  getNextLesson,
  getPreviousLesson,
  getFirstLesson,
  getLessonHref,
  getLessonHrefById,
  getPathCardData,
  formatDuration,
  formatApproxDuration,
} from "@/content/registry"

export {
  calculateLessonTime,
  calculateModuleTime,
  calculatePathTime,
  calculateQuizTime,
  formatDuration as formatCourseDuration,
  formatApproxDuration as formatCourseApproxDuration,
  TIME_ESTIMATE_NOTE,
} from "@/lib/course/time-estimates"

export {
  isLessonCompleted,
  isLessonUnlocked,
  getUnlockedLessons,
  getPathProgressPercent,
  getNextIncompleteLesson,
  getRecommendedLessonId,
  getLessonCtaLabel,
  arePrerequisitesMet,
} from "@/lib/course/unlocks"

export type {
  LearningPathContent,
  CourseModule,
  CourseLesson,
  CourseQuiz,
  CourseQuizQuestion,
  ChartDrill,
  ContentBlock,
  PathCardData,
  PathContentStats,
  SyllabusLessonItem,
  LessonType,
  PathStatus,
} from "@/lib/course/types"

export { calculateXPFromLesson } from "@/lib/course/scoring"
