"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRightIcon, LockIcon, SearchIcon } from "lucide-react"

import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getLessonHref, getPathBySlug } from "@/content/registry"
import type { CourseLesson } from "@/lib/course/types"
import { cn } from "@/lib/utils"

interface LessonLibraryProps {
  allLessons: CourseLesson[]
}

export function LessonLibrary({ allLessons }: LessonLibraryProps) {
  const { isLessonDone, stats } = useUserState()
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    return allLessons.filter((lesson) => {
      if (search === "") return true
      const q = search.toLowerCase()
      return (
        lesson.title.toLowerCase().includes(q) ||
        lesson.description.toLowerCase().includes(q)
      )
    })
  }, [allLessons, search])

  const recommended = allLessons.find(
    (l) => l.id === stats.recommendedLessonId
  )

  return (
    <div className="flex flex-col gap-8">
      {recommended && stats.lessonsCompleted === 0 && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <p className="text-sm font-medium text-primary">
            Recommended first lesson
          </p>
          <h3 className="mt-1 font-medium">{recommended.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {recommended.description}
          </p>
          <Button
            className="mt-4"
            render={
              <Link
                href={getLessonHref(
                  getPathBySlug(recommended.pathId)?.slug ?? recommended.pathId,
                  recommended.slug
                )}
              />
            }
          >
            Start Lesson
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      )}

      <div className="relative">
        <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search lessons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/60 py-12 text-center text-sm text-muted-foreground">
          No lessons match your search.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((lesson) => {
            const done = isLessonDone(lesson.id)
            const path = getPathBySlug(lesson.pathId)
            const locked = path?.locked ?? false
            return (
              <div
                key={lesson.id}
                className={cn(
                  "flex flex-col gap-3 rounded-xl border border-border/60 bg-card/50 p-4",
                  locked && "opacity-60",
                  done && "border-primary/20 bg-primary/5"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-medium">{lesson.title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground capitalize">
                      {path?.title ?? lesson.pathId} · {lesson.difficulty}
                      {done && " · Completed"}
                    </p>
                  </div>
                  {locked && (
                    <LockIcon className="shrink-0 text-muted-foreground" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {lesson.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-primary">
                    +{lesson.xpReward} XP · {lesson.estimatedMinutes} min
                  </span>
                  {!locked && (
                    <Button
                      size="sm"
                      variant="outline"
                      render={
                        <Link
                          href={getLessonHref(
                            path?.slug ?? lesson.pathId,
                            lesson.slug
                          )}
                        />
                      }
                    >
                      {done ? "Review" : "Start"}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
