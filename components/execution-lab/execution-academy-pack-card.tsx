"use client"

import Link from "next/link"
import { ArrowRightIcon, TrophyIcon } from "lucide-react"

import type { ExecutionPackDefinition } from "@/content/execution-lab/packs/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { ExecutionMode } from "@/lib/execution-lab/types"
import {
  getPackTierLabel,
  type PackProgress,
} from "@/lib/execution-lab/pack-progress"
import { cn } from "@/lib/utils"

interface ExecutionAcademyPackCardProps {
  pack: ExecutionPackDefinition
  progress: PackProgress
  mode: ExecutionMode
  className?: string
}

const PACK_ACCENTS: Record<string, string> = {
  continuation: "border-emerald-500/30 bg-emerald-500/5",
  reversal: "border-primary/30 bg-primary/5",
  patience: "border-amber-500/30 bg-amber-500/5",
  eod: "border-violet-500/30 bg-violet-500/5",
}

export function ExecutionAcademyPackCard({
  pack,
  progress,
  mode,
  className,
}: ExecutionAcademyPackCardProps) {
  const pct =
    progress.total > 0
      ? Math.round((progress.completed / progress.total) * 100)
      : 0
  const continueHref = progress.nextScenarioId
    ? `/execution-lab/${progress.nextScenarioId}?mode=${mode}`
    : `/execution-lab/${pack.scenarios[0]?.id}?mode=${mode}`

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border p-5",
        PACK_ACCENTS[pack.id] ?? "border-border/60 bg-card/50",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold">{pack.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{pack.description}</p>
        </div>
        {progress.tier !== "none" && (
          <Badge variant="secondary" className="shrink-0 gap-1">
            <TrophyIcon className="size-3" />
            {getPackTierLabel(progress.tier)}
          </Badge>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {progress.completed}/{progress.total} scenarios
          </span>
          <span>{pct}%</span>
        </div>
        <Progress value={pct} className="h-1.5" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <Stat label="Best score" value={progress.bestScore > 0 ? `${progress.bestScore}%` : "—"} />
        <Stat
          label="Avg execution"
          value={progress.averageScore > 0 ? `${progress.averageScore}%` : "—"}
        />
        {progress.weakestSkill && (
          <Stat label="Focus skill" value={progress.weakestSkill} className="col-span-2" />
        )}
      </div>

      <p className="mt-3 text-xs text-muted-foreground italic">{pack.learningObjective}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" render={<Link href={continueHref} />}>
          {progress.completed > 0 ? "Continue" : "Start pack"}
          <ArrowRightIcon data-icon="inline-end" className="size-3.5" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          render={<Link href={`/execution-lab?pack=${pack.id}`} />}
        >
          Browse
        </Button>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium tabular-nums">{value}</p>
    </div>
  )
}
