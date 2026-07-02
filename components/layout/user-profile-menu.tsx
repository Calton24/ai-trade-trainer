"use client"

import Link from "next/link"
import { useMemo } from "react"

import { useAuth } from "@/components/providers/auth-provider"
import { useUserState } from "@/components/providers/user-state-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  formatGreeting,
  getAvatarColorClass,
  getDisplayName,
  getInitials,
  getTimeGreeting,
} from "@/lib/auth/greeting"
import { cn } from "@/lib/utils"

export function UserProfileMenu() {
  const { profile, user, loading, isAuthenticated } = useAuth()
  const { progression, hydrated } = useUserState()
  const greetingHour = useMemo(() => new Date().getHours(), [])

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="hidden h-9 w-28 rounded-full sm:block" />
        <Skeleton className="size-9 rounded-full" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  const displayName = getDisplayName(profile, profile?.email ?? user?.email)
  const initials = getInitials(displayName)
  const avatarColor = getAvatarColorClass(displayName)
  const timeGreeting = getTimeGreeting(greetingHour)
  const shortGreeting = formatGreeting(displayName, greetingHour)
  const xp = hydrated ? progression.xp : 0
  const rankTier = hydrated ? progression.rank.tier : null
  const xpLine =
    rankTier && rankTier > 1
      ? `Level ${rankTier} · ${xp.toLocaleString()} XP`
      : `${xp.toLocaleString()} XP`

  return (
    <Link
      href="/settings"
      className={cn(
        "flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-2 py-1.5 text-left text-sm shadow-sm transition-all",
        "hover:border-primary/30 hover:bg-card/80 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      )}
      aria-label={`Account settings for ${displayName}`}
    >
      <Avatar size="sm" className="ring-1 ring-border/60">
        {profile?.avatarUrl ? (
          <AvatarImage src={profile.avatarUrl} alt={displayName} />
        ) : null}
        <AvatarFallback
          className={cn("text-xs font-semibold ring-1", avatarColor)}
        >
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="hidden min-w-0 flex-col sm:flex">
        <span className="truncate text-xs font-medium leading-tight">
          <span className="mr-1" aria-hidden>
            {timeGreeting.emoji}
          </span>
          {shortGreeting}
        </span>
        <span className="truncate text-[11px] text-muted-foreground">{xpLine}</span>
      </div>
    </Link>
  )
}
