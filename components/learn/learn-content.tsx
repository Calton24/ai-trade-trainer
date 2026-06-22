"use client"

import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { LessonLibrary } from "@/components/learn/lesson-library"
import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getPathBySlug } from "@/content/registry"
import type { CourseLesson } from "@/lib/course/types"
import { BookOpenIcon } from "lucide-react"

interface LearnContentProps {
  allLessons: CourseLesson[]
}

export function LearnContent({ allLessons }: LearnContentProps) {
  const { stats, state, pathProgress } = useUserState()
  const activePath = state.progress.activePathId
    ? getPathBySlug(state.progress.activePathId)
    : null
  const overallProgress =
    stats.totalLessons > 0
      ? Math.round((stats.lessonsCompleted / stats.totalLessons) * 100)
      : 0
  const hasStarted = stats.lessonsCompleted > 0

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Lesson Library
            </h1>
            <p className="text-muted-foreground">
              Browse all lessons by topic — or follow a structured path in{" "}
              <Link href="/paths" className="text-primary hover:underline">
                Learning Paths
              </Link>
            </p>
          </div>
          <Button variant="outline" render={<Link href="/paths" />}>
            View Paths
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>

        {!hasStarted && (
          <EmptyState
            icon={BookOpenIcon}
            title="Continue learning"
            description="You haven't completed any lessons yet. Start with Trading Foundations or browse below."
            action={
              <Button render={<Link href="/paths/trading-foundations" />}>
                Start Trading Foundations
              </Button>
            }
          />
        )}

        {activePath && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <p className="text-sm font-medium text-primary">
              Active learning path
            </p>
            <h3 className="mt-1 font-medium">{activePath.title}</h3>
            <Progress
              value={pathProgress(activePath.id)}
              className="mt-3 h-2"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {pathProgress(activePath.id)}% complete
            </p>
          </div>
        )}

        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Lessons completed</p>
              <p className="font-medium">
                {stats.lessonsCompleted} of {stats.totalLessons}
              </p>
            </div>
            <span className="text-2xl font-semibold text-primary">
              {overallProgress}%
            </span>
          </div>
          <Progress value={overallProgress} className="mt-4 h-2" />
        </div>

        <LessonLibrary allLessons={allLessons} />
      </div>
    </AppShell>
  )
}
