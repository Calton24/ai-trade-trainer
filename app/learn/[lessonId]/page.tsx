import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { getAllLessons, getPathBySlug } from "@/content/registry"

interface LessonPageProps {
  params: Promise<{ lessonId: string }>
}

export async function generateStaticParams() {
  return getAllLessons().map((l) => ({ lessonId: l.slug }))
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { lessonId } = await params
  const courseLesson =
    getAllLessons().find((l) => l.id === lessonId || l.slug === lessonId) ??
    null
  if (!courseLesson) return { title: "Lesson Not Found" }
  return { title: `${courseLesson.title} — TradeTrainer Academy` }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params
  const courseLesson = getAllLessons().find(
    (l) => l.id === lessonId || l.slug === lessonId
  )

  if (!courseLesson) notFound()

  redirect(
    `/paths/${getPathBySlug(courseLesson.pathId)?.slug ?? courseLesson.pathId}/lessons/${courseLesson.slug}`
  )
}
