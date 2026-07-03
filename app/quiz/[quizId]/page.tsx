import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/layout/app-shell"
import { CourseQuizEngine } from "@/components/quiz/course-quiz-engine"
import { getAllQuizzes, getQuizById } from "@/content/registry"

interface QuizPageProps {
  params: Promise<{ quizId: string }>
  searchParams: Promise<{ path?: string; lesson?: string }>
}

export async function generateStaticParams() {
  return getAllQuizzes().map((q) => ({ quizId: q.id }))
}

export async function generateMetadata({
  params,
}: QuizPageProps): Promise<Metadata> {
  const { quizId } = await params
  const quiz = getQuizById(quizId)
  if (!quiz) return { title: "Quiz Not Found" }
  return {
    title: `${quiz.title} — TradeTrainer Academy`,
    description: quiz.description,
  }
}

export default async function QuizPage({
  params,
  searchParams,
}: QuizPageProps) {
  const { quizId } = await params
  const { path, lesson } = await searchParams

  const quiz = getQuizById(quizId)
  if (!quiz) notFound()

  return (
    <AppShell>
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div>
          <p className="text-sm text-primary">Quiz</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {quiz.title}
          </h1>
          {quiz.description && (
            <p className="mt-1 text-muted-foreground">{quiz.description}</p>
          )}
        </div>

        <CourseQuizEngine quiz={quiz} pathSlug={path} lessonId={lesson} />
      </div>
    </AppShell>
  )
}
