import { STORAGE_KEYS } from "./types"

/** Remove anonymous localStorage progress after cloud account takes over. */
export function clearAnonymousProgress(): void {
  if (typeof window === "undefined") return
  for (const key of Object.values(STORAGE_KEYS)) {
    localStorage.removeItem(key)
  }
  localStorage.removeItem("tradetrainer_user_settings")
}

export function isCloudPersistenceActive(
  supabaseConfigured: boolean,
  userId: string | undefined
): boolean {
  return Boolean(supabaseConfigured && userId)
}
