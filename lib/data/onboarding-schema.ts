import type { PostgrestError } from "@supabase/supabase-js"

import { ONBOARDING_PROFILE_UPDATE_KEYS } from "./onboarding-profile-update"

export function isMissingColumnError(error: PostgrestError | null): boolean {
  if (!error?.message) return false
  const msg = error.message.toLowerCase()
  return (
    msg.includes("schema cache") ||
    msg.includes("could not find") ||
    (msg.includes("column") && msg.includes("does not exist"))
  )
}

export function columnFromSchemaError(message: string): string | null {
  const match =
    message.match(/'([^']+)'\s+column/i) ??
    message.match(/column\s+"([^"]+)"/i)
  return match?.[1] ?? null
}

/** Map PostgREST schema errors to actionable messages. */
export function formatOnboardingSaveError(error: PostgrestError | { message: string }): string {
  if (isMissingColumnError(error as PostgrestError)) {
    const column = columnFromSchemaError(error.message)
    if (process.env.NODE_ENV === "development") {
      return (
        `Database schema mismatch: profiles.${column ?? "unknown column"} is missing. ` +
        `Run supabase/migrations/012_onboarding_schema_complete.sql on project njsvozqbgirsikscaxbq, ` +
        `then restart the dev server (rm -rf .next && npm run dev).`
      )
    }
    return "We couldn't save your profile right now. Please try again in a moment."
  }

  if ("code" in error && error.code === "23505") {
    return "Username is already taken."
  }

  return error.message
}

/** Dev-only: warn if a column error references a field onboarding should own. */
export function isOnboardingColumnMissing(message: string): boolean {
  const column = columnFromSchemaError(message)
  if (!column) return false
  return ONBOARDING_PROFILE_UPDATE_KEYS.includes(
    column as (typeof ONBOARDING_PROFILE_UPDATE_KEYS)[number]
  )
}
