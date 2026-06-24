"use client"

import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const TARGET_OPTIONS = [1, 2, 3, 4, 5, 7]

export function GoalSettingsContent() {
  const { state, setWeeklyTargetDays } = useUserState()
  const current = state.weeklyTarget.daysPerWeek

  return (
    <AppShell>
      <div className="mx-auto flex max-w-lg flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit"
            render={<Link href="/dashboard" />}
          >
            <ArrowLeftIcon data-icon="inline-start" />
            Dashboard
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">Goal settings</h1>
          <p className="text-sm text-muted-foreground">
            Choose how many days per week you want to make learning progress.
            Weeks start Monday at midnight in your local timezone.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {TARGET_OPTIONS.map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setWeeklyTargetDays(days)}
              className={cn(
                "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                current === days
                  ? "border-primary/30 bg-primary/10 ring-1 ring-primary/20"
                  : "border-border/60 bg-card/50 hover:border-primary/20"
              )}
            >
              <span className="font-medium">
                {days} day{days === 1 ? "" : "s"} per week
              </span>
              {days === 3 && (
                <span className="text-xs text-primary">Recommended</span>
              )}
              {current === days && (
                <span className="text-xs text-muted-foreground">Selected</span>
              )}
            </button>
          ))}
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground/70">
          Any meaningful learning activity counts — completing a lesson, quiz,
          Book Lab concept, chart drill, or saving a reflection. Multiple
          activities on the same day count as one learning day.
        </p>
      </div>
    </AppShell>
  )
}
