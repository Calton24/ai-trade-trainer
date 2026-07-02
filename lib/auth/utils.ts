import type { SupabaseClient } from "@supabase/supabase-js"

export function getAuthSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
}

export function getAuthCallbackUrl(redirect = "/dashboard"): string {
  const safe =
    redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/dashboard"
  return `${getAuthSiteUrl()}/auth/callback?redirect=${encodeURIComponent(safe)}`
}

export function normalizeAuthEmail(value: string): string {
  return value.trim().toLowerCase()
}

export function mapAuthErrorMessage(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes("invalid login credentials")) {
    return "Email or password is incorrect. If you just signed up, confirm your email first or use Forgot password."
  }

  if (lower.includes("email not confirmed")) {
    return "Please confirm your email before signing in. Check your inbox for the confirmation link."
  }

  return message
}

export async function getAuthenticatedUser(supabase: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}
