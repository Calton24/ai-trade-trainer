import Link from "next/link"
import { LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { PathCardData } from "@/lib/course/types"
import { cn } from "@/lib/utils"

interface PathCardProps {
  path: PathCardData
}

const levelLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
}

const statusBadge: Record<string, string> = {
  preview: "Preview",
  coming_soon: "Coming soon",
}

export function PathCard({ path }: PathCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-5 ring-1 ring-white/[0.02]",
        path.locked && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium">{path.title}</h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-primary capitalize">
              {levelLabels[path.level] ?? path.level}
            </span>
            {path.status !== "available" && (
              <span className="text-xs text-muted-foreground">
                {statusBadge[path.status]}
              </span>
            )}
          </div>
        </div>
        {path.locked && (
          <LockIcon className="shrink-0 text-muted-foreground" />
        )}
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {path.description}
      </p>

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span>{path.estimatedTimeLabel}</span>
        <span>{path.stats.moduleCount} modules</span>
        <span>{path.stats.lessonCount} lessons</span>
        <span>{path.stats.quizCount} quizzes</span>
        {path.stats.drillCount > 0 && (
          <span>{path.stats.drillCount} drills</span>
        )}
      </div>

      {path.progressPercent > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-primary">{path.progressPercent}%</span>
          </div>
          <Progress value={path.progressPercent} className="h-1.5" />
        </div>
      )}

      <Button
        className="flex-1"
        variant={path.progressPercent > 0 ? "default" : "outline"}
        disabled={path.status === "coming_soon"}
        render={<Link href={`/paths/${path.slug}`} />}
      >
        {path.status === "coming_soon"
          ? "Coming Soon"
          : path.progressPercent > 0
            ? "Continue Path"
            : path.status === "preview"
              ? "View Preview"
              : "Start Path"}
      </Button>
    </div>
  )
}
