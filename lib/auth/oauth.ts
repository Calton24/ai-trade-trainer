"use client"

import { createClientIfConfigured } from "@/lib/supabase/client"
import {
  OAUTH_PROVIDER_CONFIG,
  type OAuthProviderId,
} from "./providers"
import { getAuthCallbackUrl } from "./utils"

export async function signInWithOAuth(
  provider: OAuthProviderId,
  redirectTo = "/dashboard"
): Promise<{ error?: string }> {
  const supabase = createClientIfConfigured()
  if (!supabase) {
    return { error: "Authentication is not configured yet." }
  }

  const safeRedirect =
    redirectTo.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : "/dashboard"

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getAuthCallbackUrl(safeRedirect),
    },
  })

  if (error) return { error: error.message }
  return {}
}

export function getOAuthButtonLabel(provider: OAuthProviderId): string {
  return OAUTH_PROVIDER_CONFIG[provider].label
}
