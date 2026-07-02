"use client"

import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  getNextRoadmapStep,
  getRoadmapLevel,
  getRoadmapTitle,
  TRADER_ROADMAP,
} from "@/lib/progression/roadmap"

interface TraderRoadmapWidgetProps {
  xp: number
  compact?: boolean
}

export function TraderRoadmapWidget({ xp, compact }: TraderRoadmapWidgetProps) {
  const level = getRoadmapLevel(xp)
  const title = getRoadmapTitle(xp)
  const next = getNextRoadmapStep(xp)
  const currentStep = TRADER_ROADMAP.find((s) => s.level === level)
  const nextStep = TRADER_ROADMAP.find((s) => s.level === level + 1)
  const progress =
    nextStep && currentStep
      ? Math.min(
          100,
          Math.round(
            ((xp - currentStep.minXp) / (nextStep.minXp - currentStep.minXp)) * 100
          )
        )
      : 100

  if (compact) {
    return (
      <div className="rounded-lg border border-border/60 bg-card/50 px-4 py-3">
        <p className="text-xs text-muted-foreground">Roadmap Level {level}</p>
        <p className="font-medium">{title}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/80 to-primary/5 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Trader Development Roadmap</p>
          <p className="text-2xl font-bold">
            Level {level} — {title}
          </p>
          {next && (
            <p className="mt-1 text-sm text-muted-foreground">
              {next.xpNeeded} XP to {next.title}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" render={<Link href="/learning-map" />}>
          What&apos;s next?
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>
      <div className="mt-4">
        <Progress value={progress} className="h-2" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {TRADER_ROADMAP.map((step) => (
          <span
            key={step.level}
            className={
              step.level <= level
                ? "rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary"
                : "rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
            }
          >
            L{step.level}
          </span>
        ))}
      </div>
    </div>
  )
}
