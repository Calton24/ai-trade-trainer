import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { TrendLessonContent } from "@/components/trend-spotter/trend-lesson-content"
import { getTrendLesson } from "@/content/trend-spotter"

interface PageProps {
  params: Promise<{ lessonSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lessonSlug } = await params
  const lesson = getTrendLesson(lessonSlug)
  return {
    title: lesson
      ? `${lesson.title} — Trend Spotter`
      : "Trend Spotter Lesson",
  }
}

export default async function TrendLessonPage({ params }: PageProps) {
  const { lessonSlug } = await params
  const lesson = getTrendLesson(lessonSlug)
  if (!lesson) notFound()
  return <TrendLessonContent lesson={lesson} />
}
