import { getDefaultSettings } from "./defaults"
import type { UserSettingsBundle } from "./types"

const STORAGE_KEY = "tradetrainer_user_settings"

export function loadSettingsFromStorage(): UserSettingsBundle {
  if (typeof window === "undefined") return getDefaultSettings()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultSettings()
    const parsed = JSON.parse(raw) as Partial<UserSettingsBundle>
    const defaults = getDefaultSettings()
    return {
      ...defaults,
      ...parsed,
      profile: { ...defaults.profile, ...parsed.profile },
      privacy: { ...defaults.privacy, ...parsed.privacy },
      notifications: { ...defaults.notifications, ...parsed.notifications },
    }
  } catch {
    return getDefaultSettings()
  }
}

export function saveSettingsToStorage(settings: UserSettingsBundle): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export function clearSettingsStorage(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
