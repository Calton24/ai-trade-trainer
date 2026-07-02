"use client"

import type { AuthError } from "@supabase/supabase-js"

import { createClientIfConfigured } from "@/lib/supabase/client"
import { mapAuthErrorMessage, normalizeAuthEmail } from "./utils"

export async function signInWithEmailClient(
  email: string,
  password: string
): Promise<{ error?: string }> {
  const supabase = createClientIfConfigured()
  if (!supabase) {
    return { error: "Authentication is not configured yet." }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: normalizeAuthEmail(email),
    password,
  })

  if (error) {
    return { error: mapAuthErrorMessage(error.message) }
  }

  return {}
}

export function formatAuthError(error: AuthError | null): string | undefined {
  if (!error) return undefined
  return mapAuthErrorMessage(error.message)
}
