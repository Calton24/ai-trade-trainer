import { type EmailOtpType } from "@supabase/supabase-js"
import { type NextRequest } from "next/server"

/**
 * Legacy email confirmation entrypoint.
 * Forwards token_hash/type to /auth/callback so session cookies are set
 * with the same production-safe redirect handling.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const redirect = searchParams.get("redirect") ?? "/onboarding"

  const callback = new URL("/auth/callback", origin)
  if (tokenHash) callback.searchParams.set("token_hash", tokenHash)
  if (type) callback.searchParams.set("type", type)
  callback.searchParams.set("redirect", redirect)

  // Preserve any provider error params.
  for (const key of ["error", "error_description", "error_code"] as const) {
    const value = searchParams.get(key)
    if (value) callback.searchParams.set(key, value)
  }

  return Response.redirect(callback)
}
