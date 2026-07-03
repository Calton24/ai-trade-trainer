"use client"

import Link from "next/link"
import { FlameIcon, SparklesIcon, TargetIcon } from "lucide-react"

import { WeeklyTargetWidget } from "@/components/habits/weekly-target-widget"
import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import {
  calculateDailyStreak,
  calculateWeeklyTargetProgress,
  getTodayActivity,
  hasMadeProgressToday,
} from "@/lib/user-state"
import { cn } from "@/lib/utils"

export function StreakIndicator() {
  const { state, hydrated, globalSnapshot } = useUserState()

  if (!hydrated) return null

  const streak = calculateDailyStreak(state)
  const hasActivity = state.activityLog.length > 0
  const todayDone = hasMadeProgressToday(state)
  const weekly = calculateWeeklyTargetProgress(state)
  const todayActivity = getTodayActivity(state)

  if (!hasActivity) {
    return (
      <Link
        href="/paths/trading-foundations"
        className="hidden h-[42px] items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 text-xs text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-zinc-100 sm:flex"
      >
        <FlameIcon className="size-3.5 opacity-60" />
        Start your streak
      </Link>
    )
  }

  return (
    <div className="group relative">
      <button
        type="button"
        className={cn(
          "flex h-[42px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 text-sm transition-colors hover:bg-white/[0.08]",
          todayDone ? "text-primary" : "text-zinc-400"
        )}
      >
        <FlameIcon className={cn("size-4", todayDone && "text-primary")} />
        <span className="hidden sm:inline">
          {streak > 0 ? `${streak} day streak` : "Keep streak alive"}
        </span>
        <span className="flex items-center gap-1 border-l border-white/10 pl-2 text-xs text-zinc-500">
          <SparklesIcon className="size-3" />
          {globalSnapshot.xp} XP
        </span>
      </button>

      <div className="invisible absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-white/10 bg-zinc-950/90 p-4 opacity-0 shadow-xl backdrop-blur-2xl transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className="flex items-center gap-2 text-primary">
          <FlameIcon className="size-4" />
          <span className="text-sm font-medium">
            {streak > 0 ? `${streak}-day streak` : "No active streak"}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {todayDone
            ? "You made progress today."
            : "Practice today to keep your streak alive — lessons, drills, flashcards, and Trend Spotter count."}
        </p>

        {todayActivity.length > 0 && (
          <ul className="mt-3 flex flex-col gap-1 border-t border-border/60 pt-3">
            {todayActivity.slice(0, 4).map((a) => (
              <li key={a.id} className="text-xs text-muted-foreground">
                ✓ {a.title}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 border-t border-border/60 pt-4">
          <WeeklyTargetWidget compact />
        </div>

        <Button
          size="sm"
          variant="outline"
          className="mt-3 w-full"
          render={<Link href="/trend-spotter/challenge" />}
        >
          Trend Spotter challenge
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="mt-2 w-full"
          render={<Link href="/flashcards/session?mode=game10" />}
        >
          Quick flashcard review
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="mt-2 w-full"
          render={<Link href="/settings/goals" />}
        >
          <TargetIcon data-icon="inline-start" />
          Goal settings
        </Button>
      </div>
    </div>
  )
}
