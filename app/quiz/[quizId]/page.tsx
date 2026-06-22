import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/layout/app-shell"
import { CourseQuizEngine } from "@/components/quiz/course-quiz-engine"
import { QuizEngine } from "@/components/quiz/quiz-engine"
import { getAllQuizzes, getQuizById } from "@/content/registry"
import { getQuizById as getLegacyQuiz, quizzes } from "@/lib/mock/quizzes"

interface QuizPageProps {
  params: Promise<{ quizId: string }>
  searchParams: Promise<{ path?: string; lesson?: string }>
}

export async function generateStaticParams() {
  const course = getAllQuizzes().map((q) => ({ quizId: q.id }))
  const legacy = quizzes.map((q) => ({ quizId: q.id }))
  return [...course, ...legacy]
}

export async function generateMetadata({
  params,
}: QuizPageProps): Promise<Metadata> {
  const { quizId } = await params
  const quiz = getQuizById(quizId) ?? getLegacyQuiz(quizId)
  if (!quiz) return { title: "Quiz Not Found" }
  return {
    title: `${quiz.title} — TradeTrainer AI`,
    description: "description" in quiz ? quiz.description : undefined,
  }
}

export default async function QuizPage({
  params,
  searchParams,
}: QuizPageProps) {
  const { quizId } = await params
  const { path, lesson } = await searchParams

  const courseQuiz = getQuizById(quizId)
  const legacyQuiz = getLegacyQuiz(quizId)

  if (!courseQuiz && !legacyQuiz) notFound()

  return (
    <AppShell>
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div>
          <p className="text-sm text-primary">Quiz</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {(courseQuiz ?? legacyQuiz)!.title}
          </h1>
          {"description" in (courseQuiz ?? legacyQuiz)! && (
            <p className="mt-1 text-muted-foreground">
              {(courseQuiz ?? legacyQuiz)!.description}
            </p>
          )}
        </div>

        {courseQuiz ? (
          <CourseQuizEngine
            quiz={courseQuiz}
            pathSlug={path}
            lessonId={lesson}
          />
        ) : (
          legacyQuiz && (
            <QuizEngine quiz={legacyQuiz} pathId={legacyQuiz.pathId} />
          )
        )}
      </div>
    </AppShell>
  )
}
