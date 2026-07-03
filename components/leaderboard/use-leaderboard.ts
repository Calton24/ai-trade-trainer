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

function rankEntries(
  entries: LeaderboardResult["entries"],
  period: LeaderboardPeriod
): LeaderboardResult["entries"] {
  const metric = (e: (typeof entries)[0]) =>
    period === "all-time" ? e.xp : e.periodXp

  const sorted = [...entries].sort((a, b) => metric(b) - metric(a))
  sorted.forEach((e, i) => {
    e.rank = i + 1
  })
  return sorted
}

export function useLeaderboard(period: LeaderboardPeriod): LeaderboardResult {
  const { state } = useUserState()
  const { profile, user } = useAuth()
  const displayName = profile?.name ?? "You"
  const isAuthenticatedCloud = Boolean(isSupabaseConfigured() && user)
  const [remoteEntries, setRemoteEntries] = useState<
    Awaited<ReturnType<typeof fetchPublicLeaderboard>> | null
  >(null)
  const [remoteLoaded, setRemoteLoaded] = useState(!isAuthenticatedCloud)

  useEffect(() => {
    if (!isAuthenticatedCloud) {
      setRemoteEntries(null)
      setRemoteLoaded(true)
      return
    }

    const supabase = createClientIfConfigured()
    if (!supabase) {
      setRemoteLoaded(true)
      return
    }

    let cancelled = false
    setRemoteLoaded(false)
    void fetchPublicLeaderboard(supabase, period).then((entries) => {
      if (!cancelled) {
        setRemoteEntries(entries)
        setRemoteLoaded(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [period, user?.id, isAuthenticatedCloud])

  return useMemo(() => {
    if (!isAuthenticatedCloud) {
      return getLeaderboard(state, period, displayName, { includeSeeded: true })
    }

    if (!remoteLoaded) {
      const userEntry = buildUserEntry(state, period, displayName)
      if (user?.id) userEntry.id = user.id
      return {
        period,
        entries: [],
        currentUserRank: 1,
        currentUserEntry: userEntry,
        isDemoBoard: false,
      }
    }

    const userEntry = buildUserEntry(state, period, displayName)
    if (user?.id) userEntry.id = user.id
    userEntry.isCurrentUser = true

    const remote = remoteEntries ?? []
    const withoutSelf = remote.filter((e) => e.id !== user?.id)
    const combined = rankEntries([...withoutSelf, userEntry], period)

    const currentUserEntry =
      combined.find((e) => e.isCurrentUser || e.id === user?.id) ?? userEntry

    return {
      period,
      entries: combined,
      currentUserRank: currentUserEntry.rank,
      currentUserEntry,
      isDemoBoard: false,
    }
  }, [
    remoteEntries,
    remoteLoaded,
    state,
    period,
    displayName,
    user?.id,
    isAuthenticatedCloud,
  ])
}
