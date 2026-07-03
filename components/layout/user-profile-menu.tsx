"use client"

import Link from "next/link"

import { useAuth } from "@/components/providers/auth-provider"
import { useUserState } from "@/components/providers/user-state-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { getDisplayName, getInitials } from "@/lib/auth/greeting"
import {
  levelFromXP,
  xpForLevel,
  xpProgressPercent,
  xpToNextLevel,
} from "@/lib/progression/levels"
import { cn } from "@/lib/utils"

export function UserProfileMenu() {
  const { profile, user, loading, isAuthenticated } = useAuth()
  const { progression, hydrated } = useUserState()

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="hidden h-[42px] w-36 rounded-full sm:block" />
        <Skeleton className="size-8 rounded-full" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  const displayName = getDisplayName(profile, profile?.email ?? user?.email)
  const firstName = displayName.split(/\s+/)[0] ?? displayName
  const initials = getInitials(displayName)

  const xp = hydrated ? progression.xp : 0
  const level = levelFromXP(xp)
  const progressPct = hydrated ? xpProgressPercent(xp, level) : 0
  const xpIntoLevel = Math.max(0, xp - xpForLevel(level))
  const xpNeeded = xpToNextLevel(xp, level)
  const nextLevelXp = xpIntoLevel + xpNeeded

  return (
    <Link
      href="/settings"
      className={cn(
        "group flex h-[42px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-2.5 text-left backdrop-blur-md transition-all",
        "hover:border-white/15 hover:bg-white/[0.08]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      )}
      aria-label={`Account settings for ${displayName}. Level ${level}, ${xp.toLocaleString()} XP`}
    >
      <Avatar className="size-7 ring-1 ring-white/10">
        {profile?.avatarUrl ? (
          <AvatarImage src={profile.avatarUrl} alt={displayName} />
        ) : null}
        <AvatarFallback className="bg-zinc-500/20 text-[10px] font-medium text-zinc-300 ring-1 ring-white/10">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="hidden min-w-[6.5rem] flex-col justify-center gap-0.5 sm:flex">
        <div className="flex items-center justify-between gap-2 leading-none">
          <span className="truncate text-[12px] font-medium text-zinc-100">
            {firstName}
          </span>
          <span className="shrink-0 text-[10px] font-semibold tabular-nums text-primary">
            Lv {level}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div
            className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Level progress ${progressPct}%`}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="shrink-0 text-[9px] tabular-nums text-zinc-500">
            {xpNeeded > 0 ? `${xpIntoLevel}/${nextLevelXp}` : xp.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  )
}
