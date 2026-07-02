"use client"

import { useEffect, useMemo, useState } from "react"

import { useAuth } from "@/components/providers/auth-provider"
import { useUserState } from "@/components/providers/user-state-provider"
import {
  buildUserEntry,
  getLeaderboard,
  type LeaderboardPeriod,
  type LeaderboardResult,
} from "@/lib/leaderboard"
import { fetchPublicLeaderboard } from "@/lib/data/leaderboard-service"
import { createClientIfConfigured } from "@/lib/supabase/client"
import { isSupabaseConfigured } from "@/lib/supabase/config"

export function useLeaderboard(period: LeaderboardPeriod): LeaderboardResult {
  const { state } = useUserState()
  const { profile, user } = useAuth()
  const displayName = profile?.name ?? "You"
  const [remoteEntries, setRemoteEntries] = useState<
    Awaited<ReturnType<typeof fetchPublicLeaderboard>> | null
  >(null)

  useEffect(() => {
    if (!isSupabaseConfigured() || !user) {
      setRemoteEntries(null)
      return
    }
    const supabase = createClientIfConfigured()
    if (!supabase) return

    let cancelled = false
    void fetchPublicLeaderboard(supabase, period).then((entries) => {
      if (!cancelled) setRemoteEntries(entries)
    })
    return () => {
      cancelled = true
    }
  }, [period, user?.id])

  return useMemo(() => {
    const localBoard = getLeaderboard(state, period, displayName)
    if (!remoteEntries || remoteEntries.length === 0) {
      return localBoard
    }

    const userEntry = buildUserEntry(state, period, displayName)
    if (user?.id) {
      userEntry.id = user.id
    }
    userEntry.isCurrentUser = true

    const withoutSelf = remoteEntries.filter((e) => e.id !== user?.id)
    const combined = [...withoutSelf, userEntry]

    const metric = (e: (typeof combined)[0]) =>
      period === "all-time" ? e.xp : e.periodXp

    combined.sort((a, b) => metric(b) - metric(a))
    combined.forEach((e, i) => {
      e.rank = i + 1
    })

    const currentUserEntry =
      combined.find((e) => e.isCurrentUser || e.id === user?.id) ?? userEntry

    return {
      period,
      entries: combined,
      currentUserRank: currentUserEntry.rank,
      currentUserEntry,
    }
  }, [remoteEntries, state, period, displayName, user?.id])
}
