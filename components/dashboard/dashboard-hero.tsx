"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  FlameIcon,
  SparklesIcon,
  TargetIcon,
  ZapIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SurfaceCard } from "@/components/shared/surface-card"
import type { DailyTrainingPlan } from "@/lib/skills/types"
import { cn } from "@/lib/utils"

interface DashboardHeroProps {
  displayName: string
  isNewUser: boolean
  streak: number
  xp: number
  dailyStreak: number
  nextActionTitle: string
  nextActionHref: string
  nextActionReason: string
  dailyTrainingPlan: DailyTrainingPlan
  rankTitle: string
  percentToNext: number
  xpToNext: number
  isMaxRank: boolean
}

function greetingForHour(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export function DashboardHero({
  displayName,
  isNewUser,
  streak,
  xp,
  dailyStreak,
  nextActionTitle,
  nextActionHref,
  nextActionReason,
  dailyTrainingPlan,
  rankTitle,
  percentToNext,
  xpToNext,
  isMaxRank,
}: DashboardHeroProps) {
  const greeting = greetingForHour()
  const primaryTask = dailyTrainingPlan.items.find((i) => !i.completed) ?? dailyTrainingPlan.items[0]

  return (
    <SurfaceCard variant="primary" padding="lg" className="overflow-hidden">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <p className="text-sm font-medium text-primary">
              {isNewUser ? "Welcome aboard" : greeting}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {isNewUser ? `Let's build your edge, ${displayName}` : displayName}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              {nextActionReason}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatPill
              icon={FlameIcon}
              label={dailyStreak > 0 ? `${dailyStreak}-day streak` : "Start your streak"}
              accent={dailyStreak > 0}
            />
            <StatPill icon={ZapIcon} label={`${xp.toLocaleString()} XP`} />
            <StatPill icon={TargetIcon} label={rankTitle} />
            {streak > 0 && dailyStreak !== streak && (
              <StatPill icon={FlameIcon} label={`${streak}d learning streak`} />
            )}
          </div>

          {!isMaxRank && (
            <div className="max-w-md space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Rank progress</span>
                <span>{xpToNext > 0 ? `${xpToNext.toLocaleString()} XP to next` : "Max rank"}</span>
              </div>
              <Progress value={percentToNext} className="h-1.5" />
            </div>
          )}
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 lg:max-w-sm">
          <div className="rounded-lg border border-border/50 bg-background/40 p-4">
            <div className="flex items-center gap-2 text-primary">
              <SparklesIcon className="size-4" aria-hidden />
              <p className="text-sm font-medium">Today&apos;s plan</p>
            </div>
            {primaryTask ? (
              <>
                <p className="mt-2 text-sm font-medium">{primaryTask.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {primaryTask.description}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Your coach will suggest the next best drill after your first session.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <Button className="w-full" render={<Link href={nextActionHref} />}>
              {isNewUser ? "Start first session" : nextActionTitle}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              className="w-full"
              render={<Link href="/execution-lab" />}
            >
              Open Execution Lab
            </Button>
          </div>
        </div>
      </div>
    </SurfaceCard>
  )
}

function StatPill({
  icon: Icon,
  label,
  accent = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  accent?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        accent
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border/60 bg-background/40 text-muted-foreground"
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
      {label}
    </span>
  )
}
