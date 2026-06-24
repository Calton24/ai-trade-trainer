"use client"

import Link from "next/link"
import { TargetIcon } from "lucide-react"

import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import {
  calculateWeeklyTargetProgress,
  getDateKey,
  getWeekDayLabels,
} from "@/lib/user-state"
import { cn } from "@/lib/utils"

interface WeeklyTargetWidgetProps {
  compact?: boolean
}

export function WeeklyTargetWidget({ compact = false }: WeeklyTargetWidgetProps) {
  const { state } = useUserState()
  const weekly = calculateWeeklyTargetProgress(state)
  const dayLabels = getWeekDayLabels()
  const todayKey = getDateKey()

  if (!weekly.hasTargetSet && compact) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">Set a weekly learning target</p>
        <Button size="sm" variant="outline" render={<Link href="/settings/goals" />}>
          Set target (3 days recommended)
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-3", compact && "gap-2")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TargetIcon className="size-4 text-primary" />
          <span className={cn("font-medium", compact ? "text-xs" : "text-sm")}>
            Weekly target
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {weekly.completed}/{weekly.target} days
        </span>
      </div>

      <div className="flex justify-between gap-1">
        {dayLabels.map((label, i) => {
          const key = weekly.dayKeys[i]
          const active = weekly.activeDays.includes(key)
          const isToday = key === todayKey
          return (
            <div
              key={label}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <span className="text-[10px] text-muted-foreground">{label}</span>
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-[10px] font-medium",
                  active
                    ? "bg-primary/20 text-primary ring-1 ring-primary/30"
                    : "bg-muted/30 text-muted-foreground",
                  isToday && !active && "ring-1 ring-border"
                )}
              >
                {active ? "✓" : "–"}
              </div>
            </div>
          )
        })}
      </div>

      {!compact && (
        <p className="text-xs text-muted-foreground">
          {weekly.met
            ? "Weekly target complete. Strong consistency."
            : weekly.remaining === 1
              ? "1 more learning day to hit your weekly target."
              : `${weekly.remaining} more learning day${weekly.remaining === 1 ? "" : "s"} to hit your weekly target.`}
        </p>
      )}

      {state.weeklyStreak.streak > 0 && (
        <p className="text-xs text-primary">
          {state.weeklyStreak.streak}-week streak
        </p>
      )}

      {!compact && (
        <Button
          size="sm"
          variant="outline"
          className="w-fit"
          render={<Link href="/settings/goals" />}
        >
          {weekly.hasTargetSet ? "Change target" : "Set target"}
        </Button>
      )}
    </div>
  )
}
