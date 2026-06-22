import type {
  ContentBlock,
  CourseLesson,
  CourseModule,
  CourseQuiz,
  CourseQuizQuestion,
  LearningPathContent,
  LessonType,
} from "./types"

const WORDS_PER_MINUTE = 200
const QUIZ_SIMPLE_SECONDS = 45
const QUIZ_SCENARIO_SECONDS = 90
const REFLECTION_MINUTES = 4
const INTERACTIVE_MINUTES = 3
const DRILL_MINUTES: Record<string, number> = {
  "identify-support": 5,
  "identify-resistance": 5,
  "spot-trend": 6,
  "mark-break": 7,
  "mark-retest": 7,
  "entry-stop-target": 8,
  "icc-indication": 8,
  "icc-correction": 8,
  "icc-continuation": 8,
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function blockReadMinutes(block: ContentBlock): number {
  if (block.estimatedReadTime) return block.estimatedReadTime

  const textParts: string[] = [block.content]
  const items = block.metadata?.items
  if (Array.isArray(items)) textParts.push(...items)
  if (typeof block.metadata?.term === "string") textParts.push(block.metadata.term)

  const words = textParts.reduce((sum, t) => sum + countWords(t), 0)
  return words / WORDS_PER_MINUTE
}

export function calculateBlockTime(block: ContentBlock): number {
  switch (block.type) {
    case "checklist":
    case "interactive-question":
      return INTERACTIVE_MINUTES
    case "chart-example":
      return 2
    default:
      return blockReadMinutes(block)
  }
}

export function calculateLessonTime(lesson: CourseLesson): number {
  switch (lesson.lessonType) {
    case "quiz":
      return 0 // quiz time added via quiz object
    case "chart-drill":
      return 6
    case "reflection":
      return REFLECTION_MINUTES
    case "interactive":
      return (
        lesson.contentBlocks.reduce((sum, b) => sum + calculateBlockTime(b), 0) +
        INTERACTIVE_MINUTES
      )
    default:
      return lesson.contentBlocks.reduce(
        (sum, b) => sum + calculateBlockTime(b),
        0
      )
  }
}

export function calculateQuizTime(quiz: CourseQuiz): number {
  return (
    quiz.questions.reduce((sum, q) => sum + calculateQuestionTime(q), 0) / 60
  )
}

function calculateQuestionTime(question: CourseQuizQuestion): number {
  return question.type === "scenario"
    ? QUIZ_SCENARIO_SECONDS
    : QUIZ_SIMPLE_SECONDS
}

export function calculateDrillTime(drillType?: string): number {
  if (!drillType) return 6
  return DRILL_MINUTES[drillType] ?? 6
}

export function calculateModuleTime(module: CourseModule): number {
  return module.lessons.reduce((sum, l) => sum + l.estimatedMinutes, 0)
}

export function calculatePathTime(path: LearningPathContent): number {
  return path.modules.reduce((sum, m) => sum + m.estimatedMinutes, 0)
}

export function formatDuration(minutes: number): string {
  if (minutes < 1) return "< 1 min"
  if (minutes < 60) return `${Math.round(minutes)} min`
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  if (mins === 0) return `${hours} hr`
  if (hours === 1) return `1 hr ${mins} min`
  return `${hours} hrs ${mins} min`
}

export function formatApproxDuration(minutes: number): string {
  if (minutes < 60) return formatDuration(minutes)
  const hours = minutes / 60
  if (hours < 2) return formatDuration(minutes)
  return `Approx. ${Math.round(hours)} hrs`
}

export function lessonTypeDefaultMinutes(type: LessonType): number {
  switch (type) {
    case "quiz":
      return 5
    case "chart-drill":
      return 6
    case "reflection":
      return REFLECTION_MINUTES
    case "interactive":
      return 8
    default:
      return 10
  }
}

export const TIME_ESTIMATE_NOTE =
  "Estimated time is based on lesson length, quizzes, and drills."
