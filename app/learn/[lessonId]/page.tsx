import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { AppShell } from "@/components/layout/app-shell"
import { LessonContent } from "@/components/learn/lesson-content"
import { getAllLessons, getPathBySlug } from "@/content/registry"
import { getLessonById as getLegacyLesson } from "@/lib/mock/lessons"

interface LessonPageProps {
  params: Promise<{ lessonId: string }>
}

export async function generateStaticParams() {
  const course = getAllLessons().map((l) => ({ lessonId: l.slug }))
  return course
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { lessonId } = await params
  const courseLesson =
    getAllLessons().find((l) => l.id === lessonId || l.slug === lessonId) ??
    null
  const legacy = getLegacyLesson(lessonId)
  const title = courseLesson?.title ?? legacy?.title
  if (!title) return { title: "Lesson Not Found" }
  return { title: `${title} — TradeTrainer AI` }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params
  const courseLesson = getAllLessons().find(
    (l) => l.id === lessonId || l.slug === lessonId
  )

  if (courseLesson) {
    redirect(
      `/paths/${getPathBySlug(courseLesson.pathId)?.slug ?? courseLesson.pathId}/lessons/${courseLesson.slug}`
    )
  }

  const legacy = getLegacyLesson(lessonId)
  if (!legacy) redirect("/learn")

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <LessonContent lesson={legacy} />
      </div>
    </AppShell>
  )
}
