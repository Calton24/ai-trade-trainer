import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { CourseLessonContent } from "@/components/learn/course-lesson-content"
import { AppShell } from "@/components/layout/app-shell"
import {
  getAllPaths,
  getLessonBySlug,
  getModuleForLesson,
  getPathBySlug,
} from "@/content/registry"

interface LessonPageProps {
  params: Promise<{ pathSlug: string; lessonSlug: string }>
}

export async function generateStaticParams() {
  return getAllPaths().flatMap((path) =>
    path.modules.flatMap((mod) =>
      mod.lessons.map((lesson) => ({
        pathSlug: path.slug,
        lessonSlug: lesson.slug,
      }))
    )
  )
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { pathSlug, lessonSlug } = await params
  const lesson = getLessonBySlug(pathSlug, lessonSlug)
  if (!lesson) return { title: "Lesson Not Found" }
  return {
    title: `${lesson.title} — TradeTrainer AI`,
    description: lesson.description,
  }
}

export default async function CourseLessonPage({ params }: LessonPageProps) {
  const { pathSlug, lessonSlug } = await params
  const path = getPathBySlug(pathSlug)
  const lesson = getLessonBySlug(pathSlug, lessonSlug)
  if (!path || !lesson) notFound()

  const module = getModuleForLesson(lesson.id)
  if (!module) notFound()

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <CourseLessonContent path={path} module={module} lesson={lesson} />
      </div>
    </AppShell>
  )
}
