import Link from "next/link"
import { ClockIcon, LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Module } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ModuleCardProps {
  module: Module
}

const difficultyLabels = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
}

export function ModuleCard({ module }: ModuleCardProps) {
  const firstLessonId = module.lessonIds[0]

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-5 ring-1 ring-white/[0.02]",
        module.locked && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono text-muted-foreground">
            Module {module.order}
          </span>
          <h3 className="font-medium">{module.title}</h3>
        </div>
        {module.locked ? (
          <LockIcon className="shrink-0 text-muted-foreground" />
        ) : (
          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            {difficultyLabels[module.difficulty]}
          </span>
        )}
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {module.description}
      </p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ClockIcon />
          {module.estimatedMinutes} min
        </span>
        <span>{module.completionPercent}% complete</span>
      </div>

      <Progress value={module.completionPercent} className="h-1.5" />

      {module.locked ? (
        <Button variant="outline" disabled className="w-full">
          <LockIcon data-icon="inline-start" />
          Complete previous modules to unlock
        </Button>
      ) : (
        <Button
          className="w-full"
          render={<Link href={`/learn/${firstLessonId}`} />}
        >
          {module.completionPercent > 0 && module.completionPercent < 100
            ? "Continue Lesson"
            : "Start Lesson"}
        </Button>
      )}
    </div>
  )
}
