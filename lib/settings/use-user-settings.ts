"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { useMotivation } from "@/components/habits/motivation-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { useUserState } from "@/components/providers/user-state-provider"
import {
  deleteLocalAccount,
  updateLocalProfile,
} from "@/lib/auth/local-session"
import { captureError } from "@/lib/observability/sentry"
import { createClientIfConfigured } from "@/lib/supabase/client"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { getDefaultSettings } from "@/lib/settings/defaults"
import {
  fetchAuthenticatedSettingsBundle,
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

  const isAuthenticatedSupabase =
    isSupabaseConfigured() && authMode === "supabase" && Boolean(user)

  // `setWeeklyTargetDays` and `state` come from `UserStateProvider`, whose
  // action callbacks are re-created (new identity) on every `state` change —
  // including the change caused by calling `setWeeklyTargetDays` itself.
  // Depending on either of them directly in the effect below previously
  // caused an infinite loop: load → hydrate weekly target → new state → new
  // `setWeeklyTargetDays` identity → effect deps changed → reload → repeat,
  // firing a `/api/progress/record-activity` request on every iteration.
  // Reading them via refs lets the effect use their *latest* value without
  // re-running when they merely change identity.
  const setWeeklyTargetDaysRef = useRef(setWeeklyTargetDays)
  setWeeklyTargetDaysRef.current = setWeeklyTargetDays
  const weeklyTargetDaysRef = useRef(state.weeklyTarget.daysPerWeek)
  weeklyTargetDaysRef.current = state.weeklyTarget.daysPerWeek

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)

      if (isAuthenticatedSupabase && user) {
        const supabase = createClientIfConfigured()
        if (supabase) {
          const bundle = await fetchAuthenticatedSettingsBundle(
            supabase,
            user.id
          )
          if (!cancelled) {
            setSettings(bundle)
            // Hydration only — mirrors the server value into local
            // UserState. Never treated as a learner action; the provider's
            // own no-op guard also prevents this from persisting/syncing
            // when the value already matches.
            setWeeklyTargetDaysRef.current(bundle.profile.weeklyTargetDays)
            setLoading(false)
          }
          return
        }
      }

      let bundle = loadSettingsFromStorage()
      bundle = mergeProfileIntoSettings(bundle, profile)
      bundle.profile.weeklyTargetDays =
        weeklyTargetDaysRef.current ?? bundle.profile.weeklyTargetDays

      if (!cancelled) {
        setSettings(bundle)
        setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [isAuthenticatedSupabase, profile, user])

  const save = useCallback(
    async (next: UserSettingsBundle) => {
      setSaving(true)
      setError(null)
      const stamped = { ...next, updatedAt: new Date().toISOString() }
      setSettings(stamped)
      setWeeklyTargetDays(stamped.profile.weeklyTargetDays)

      if (authMode === "local") {
        saveSettingsToStorage(stamped)
        updateLocalProfile({
          name: stamped.profile.displayName,
          country: stamped.profile.country || null,
          tradingExperience: stamped.profile.tradingExperience,
        })
        await refresh()
        setSaving(false)
        toastSaved(pushEvents)
        return true
      }

      if (isAuthenticatedSupabase && user) {
        const supabase = createClientIfConfigured()
        if (supabase) {
          const saveResult = await saveUserSettings(supabase, user.id, stamped)
          if (saveResult.error) {
            captureError(new Error(saveResult.error), {
              flow: "settings-save",
              stage: "user-settings",
              userId: user.id,
            })
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
            captureError(new Error(profileResult.error), {
              flow: "settings-save",
              stage: "profile",
              userId: user.id,
            })
            setError(profileResult.error)
            setSaving(false)
            return false
          }
          await refresh()
          const refreshed = await fetchAuthenticatedSettingsBundle(
            supabase,
            user.id
          )
          setSettings(refreshed)
          setWeeklyTargetDays(refreshed.profile.weeklyTargetDays)
        }
        setSaving(false)
        toastSaved(pushEvents)
        return true
      }

      saveSettingsToStorage(stamped)
      setSaving(false)
      toastSaved(pushEvents)
      return true
    },
    [
      authMode,
      isAuthenticatedSupabase,
      pushEvents,
      refresh,
      setWeeklyTargetDays,
      user,
    ]
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
