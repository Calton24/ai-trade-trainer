"use client"

import { useCallback, useEffect, useState } from "react"

import { useMotivation } from "@/components/habits/motivation-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { useUserState } from "@/components/providers/user-state-provider"
import {
  deleteLocalAccount,
  updateLocalProfile,
} from "@/lib/auth/local-session"
import { createClientIfConfigured } from "@/lib/supabase/client"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { getDefaultSettings } from "@/lib/settings/defaults"
import {
  fetchProfileSettings,
  fetchUserSettings,
  mergeProfileIntoSettings,
  recordProgressReset,
  requestAccountDeletion,
  saveUserSettings,
  syncProfileFromSettings,
} from "@/lib/settings/repository"
import {
  loadSettingsFromStorage,
  saveSettingsToStorage,
  clearSettingsStorage,
} from "@/lib/settings/storage"
import type { UserSettingsBundle } from "@/lib/settings/types"

function toastSaved(
  pushEvents: ReturnType<typeof useMotivation>["pushEvents"]
) {
  pushEvents([{ type: "xp-awarded", amount: 0, reason: "Settings saved" }])
}

export function useUserSettings() {
  const { user, profile, authMode, refresh, signOutClient } = useAuth()
  const { state, setWeeklyTargetDays } = useUserState()
  const { pushEvents } = useMotivation()
  const [settings, setSettings] =
    useState<UserSettingsBundle>(getDefaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      let bundle = loadSettingsFromStorage()

      if (isSupabaseConfigured() && user) {
        const supabase = createClientIfConfigured()
        if (supabase) {
          const [remote, profileSettings] = await Promise.all([
            fetchUserSettings(supabase, user.id),
            fetchProfileSettings(supabase, user.id),
          ])
          if (remote) bundle = { ...bundle, ...remote }
          if (profileSettings) {
            bundle = {
              ...bundle,
              profile: { ...bundle.profile, ...profileSettings.profile },
              privacy: { ...bundle.privacy, ...profileSettings.privacy },
            }
          } else {
            bundle = mergeProfileIntoSettings(bundle, profile)
          }
        }
      } else {
        bundle = mergeProfileIntoSettings(bundle, profile)
        bundle.profile.weeklyTargetDays =
          state.weeklyTarget.daysPerWeek ?? bundle.profile.weeklyTargetDays
      }

      if (!cancelled) {
        setSettings(bundle)
        setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [profile, user, state.weeklyTarget.daysPerWeek])

  const save = useCallback(
    async (next: UserSettingsBundle) => {
      setSaving(true)
      setError(null)
      const stamped = { ...next, updatedAt: new Date().toISOString() }
      setSettings(stamped)
      saveSettingsToStorage(stamped)
      setWeeklyTargetDays(stamped.profile.weeklyTargetDays)

      if (authMode === "local") {
        updateLocalProfile({
          name: stamped.profile.displayName,
          country: stamped.profile.country || null,
          tradingExperience: stamped.profile.tradingExperience,
        })
        await refresh()
      }

      if (isSupabaseConfigured() && user) {
        const supabase = createClientIfConfigured()
        if (supabase) {
          const saveResult = await saveUserSettings(supabase, user.id, stamped)
          if (saveResult.error) {
            setError(saveResult.error)
            setSaving(false)
            return false
          }
          const profileResult = await syncProfileFromSettings(
            supabase,
            user.id,
            stamped
          )
          if (profileResult.error) {
            setError(profileResult.error)
            setSaving(false)
            return false
          }
          await refresh()
        }
      }

      setSaving(false)
      toastSaved(pushEvents)
      return true
    },
    [authMode, pushEvents, refresh, setWeeklyTargetDays, user]
  )

  const updateSettings = useCallback((patch: Partial<UserSettingsBundle>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const logReset = useCallback(
    async (section: string) => {
      if (isSupabaseConfigured() && user) {
        const supabase = createClientIfConfigured()
        if (supabase) await recordProgressReset(supabase, user.id, section)
      }
    },
    [user]
  )

  const deleteAccount = useCallback(async () => {
    if (authMode === "local") {
      deleteLocalAccount()
      clearSettingsStorage()
      await signOutClient()
      return true
    }
    if (user) {
      const supabase = createClientIfConfigured()
      if (supabase) {
        const result = await requestAccountDeletion(supabase, user.id)
        if (result.error) {
          setError(result.error)
          return false
        }
      }
      clearSettingsStorage()
      await signOutClient()
      return true
    }
    return false
  }, [authMode, signOutClient, user])

  return {
    settings,
    setSettings,
    updateSettings,
    save,
    loading,
    saving,
    error,
    logReset,
    deleteAccount,
    profile,
    user,
    authMode,
    signOutClient,
    localProfileEmail: profile?.email,
  }
}
