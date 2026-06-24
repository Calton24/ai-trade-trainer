import type {
  TrendSpotterLesson,
  TrendSpotterQuizQuestion,
} from "@/lib/trend-spotter/types"
import type { Difficulty } from "@/lib/types"

export interface LessonInput {
  slug: string
  moduleId: string
  title: string
  summary: string
  explanation: string
  whyMatters: string
  commonMistake: string
  chartDemoId?: string
  chartPracticeId?: string
  relatedExerciseId?: string
  difficulty?: Difficulty
  quizQuestions: Omit<TrendSpotterQuizQuestion, "id">[]
}

export function buildTrendLesson(input: LessonInput): TrendSpotterLesson {
  const id = `ts-${input.slug}`
  const quizQuestions: TrendSpotterQuizQuestion[] = input.quizQuestions.map(
    (q, i) => ({ ...q, id: `${id}-q${i + 1}` })
  )
  const readMin = Math.max(
    3,
    Math.ceil((input.explanation.length + input.whyMatters.length) / 500)
  )
  return {
    id,
    slug: input.slug,
    moduleId: input.moduleId,
    title: input.title,
    summary: input.summary,
    difficulty: input.difficulty ?? "beginner",
    estimatedMinutes: readMin + quizQuestions.length + (input.chartDemoId ? 3 : 0),
    xpReward: 30,
    explanation: input.explanation,
    whyMatters: input.whyMatters,
    commonMistake: input.commonMistake,
    chartDemoId: input.chartDemoId,
    chartPracticeId: input.chartPracticeId,
    quizQuestions,
    relatedExerciseId: input.relatedExerciseId,
  }
}
