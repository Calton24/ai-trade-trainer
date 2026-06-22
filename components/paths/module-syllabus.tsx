"use client"

import Link from "next/link"
import {
  BookOpenIcon,
  BrainIcon,
  CalculatorIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  ClockIcon,
  LockIcon,
  PenLineIcon,
} from "lucide-react"

import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import {
  formatDuration,
  getLessonCtaLabel,
  getLessonHref,
} from "@/lib/course"
import type { CourseModule, LearningPathContent } from "@/lib/course/types"
import { cn } from "@/lib/utils"

interface ModuleSyllabusProps {
  path: LearningPathContent
  modules: CourseModule[]
}

const typeConfig = {
  reading: { icon: BookOpenIcon, label: "Lesson", color: "text-blue-400" },
  interactive: {
    icon: CalculatorIcon,
    label: "Exercise",
    color: "text-cyan-400",
  },
  quiz: { icon: BrainIcon, label: "Quiz", color: "text-purple-400" },
  "chart-drill": {
    icon: PenLineIcon,
    label: "Chart Drill",
    color: "text-primary",
  },
  reflection: {
    icon: ClipboardListIcon,
    label: "Reflection",
    color: "text-amber-400",
  },
}

export function ModuleSyllabus({ path, modules }: ModuleSyllabusProps) {
  const { isLessonDone, isLessonUnlocked } = useUserState()

  if (path.status !== "available") {
    return (
      <div className="rounded-xl border border-dashed border-border/60 bg-card/30 p-8 text-center">
        <p className="font-medium">
          {path.status === "coming_soon" ? "Coming soon" : "Preview syllabus"}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {path.status === "coming_soon"
            ? "This path is not available yet. Complete Trading Foundations while you wait."
            : "Full lessons are still being built. Explore the preview modules below."}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {modules
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((mod) => (
          <div key={mod.id} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h3 className="font-medium">{mod.title}</h3>
              <p className="text-sm text-muted-foreground">{mod.description}</p>
              <p className="text-xs text-muted-foreground">
                {formatDuration(mod.estimatedMinutes)} · {mod.lessons.length}{" "}
                steps
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {mod.lessons
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((lesson) => {
                  const config = typeConfig[lesson.lessonType]
                  const Icon = config.icon
                  const completed = isLessonDone(lesson.id)
                  const unlocked = isLessonUnlocked(lesson.id, path.locked)
                  const href = getLessonHref(path.slug, lesson.slug)
                  const cta = getLessonCtaLabel(lesson, completed, unlocked)

                  return (
                    <div
                      key={lesson.id}
                      className={cn(
                        "flex items-center gap-4 rounded-lg border border-border/60 bg-card/30 px-4 py-3",
                        completed && "border-primary/20 bg-primary/5",
                        !unlocked && "opacity-50"
                      )}
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/50 text-xs font-mono text-muted-foreground">
                        {lesson.order}
                      </span>

                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <Icon className={cn("shrink-0", config.color)} />
                          <span className="truncate text-sm font-medium">
                            {lesson.title}
                          </span>
                          {completed && (
                            <CheckCircle2Icon className="shrink-0 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{config.label}</span>
                          <span className="flex items-center gap-0.5">
                            <ClockIcon className="size-3" />
                            {formatDuration(lesson.estimatedMinutes)}
                          </span>
                        </div>
                      </div>

                      {!unlocked ? (
                        <LockIcon className="shrink-0 text-muted-foreground" />
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          render={<Link href={href} />}
                        >
                          {cta}
                        </Button>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        ))}
    </div>
  )
}
