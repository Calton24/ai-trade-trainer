"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  AwardIcon,
  BookOpenIcon,
  BrainIcon,
  ClockIcon,
  LockIcon,
  PenLineIcon,
} from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { ModuleSyllabus } from "@/components/paths/module-syllabus"
import { PathCard } from "@/components/paths/path-card"
import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  formatApproxDuration,
  getFirstLesson,
  getLessonHref,
  getPathBySlug,
  getPathCardData,
  TIME_ESTIMATE_NOTE,
} from "@/lib/course"
import type { LearningPathContent } from "@/lib/course/types"

interface PathDetailContentProps {
  path: LearningPathContent
}

const difficultyLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
}

const statusLabels: Record<string, string> = {
  available: "",
  preview: "Preview syllabus",
  coming_soon: "Coming soon",
}

export function PathDetailContent({ path }: PathDetailContentProps) {
  const { pathProgress, startLearningPath } = useUserState()
  const progress = pathProgress(path.id)
  const hasProgress = progress > 0
  const firstLesson = getFirstLesson(path.id)
  const nextHref = firstLesson
    ? getLessonHref(path.slug, firstLesson.slug)
    : `/paths/${path.slug}`

  const handleStart = () => {
    if (path.status === "available") startLearningPath(path.id)
  }

  const relatedPaths = path.relatedPathSlugs
    .map((slug) => getPathBySlug(slug))
    .filter(Boolean) as LearningPathContent[]

  return (
    <AppShell>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-primary capitalize">
                {difficultyLabels[path.level] ?? path.level}
              </span>
              {path.status !== "available" && (
                <span className="rounded-full border border-border/60 bg-muted/30 px-2.5 py-0.5 text-xs text-muted-foreground">
                  {statusLabels[path.status]}
                </span>
              )}
              {path.locked && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <LockIcon className="size-3" /> Pro
                </span>
              )}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {path.title}
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              {path.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ClockIcon />
              {formatApproxDuration(path.estimatedMinutes)}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpenIcon />
              {path.stats.moduleCount} modules
            </span>
            <span className="flex items-center gap-1.5">
              <BrainIcon />
              {path.stats.quizCount} quizzes
            </span>
            <span className="flex items-center gap-1.5">
              <PenLineIcon />
              {path.stats.drillCount} drills
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{TIME_ESTIMATE_NOTE}</p>

          {hasProgress && (
            <div className="max-w-md">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Your progress</span>
                <span className="text-primary">{progress}%</span>
              </div>
              <Progress value={progress} className="mt-2 h-2" />
            </div>
          )}

          {path.status === "available" && !path.locked && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                size="lg"
                onClick={handleStart}
                render={<Link href={nextHref} />}
              >
                {hasProgress ? "Continue Learning" : "Start Path"}
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold">Syllabus</h2>
            <ModuleSyllabus path={path} modules={path.modules} />
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-border/60 bg-card/50 p-5">
              <h3 className="font-medium">What you&apos;ll learn</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {path.whatYouLearn.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border/60 bg-card/50 p-5">
              <h3 className="font-medium">Skills you&apos;ll gain</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {path.skillsYouGain.map((skill) => (
                  <li key={skill} className="text-sm text-muted-foreground">
                    ✓ {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex items-center gap-2 text-primary">
                <AwardIcon />
                <h3 className="font-medium">Certificate of Completion</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Complete all syllabus items to earn your path certificate.
                Coming soon.
              </p>
            </div>

            {!path.isFree && (
              <Button variant="outline" render={<Link href="/pricing" />}>
                Upgrade to Pro for full access
              </Button>
            )}
          </div>
        </div>

        {relatedPaths.length > 0 && (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Related paths</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedPaths.map((related) => (
                <PathCard
                  key={related.id}
                  path={getPathCardData(related, pathProgress(related.id))}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
