import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import type { EmailOtpType, SupabaseClient } from "@supabase/supabase-js"

import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/config"

function safePath(value: string | null, fallback: string): string {
  if (!value) return fallback
  if (!value.startsWith("/") || value.startsWith("//")) return fallback
  return value
}

function appOrigin(request: NextRequest): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (siteUrl) return siteUrl.replace(/\/$/, "")

  const forwardedHost = request.headers.get("x-forwarded-host")
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https"
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`

  return new URL(request.url).origin
}

function signInRedirect(
  origin: string,
  opts: { error?: string; message?: string; redirect?: string }
) {
  const url = new URL("/sign-in", origin)
  if (opts.error) url.searchParams.set("error", opts.error)
  if (opts.message) url.searchParams.set("message", opts.message)
  if (opts.redirect) url.searchParams.set("redirect", opts.redirect)
  return NextResponse.redirect(url)
}

/**
 * Supabase session cookies must be written onto the redirect response.
 * Using `cookies()` from `next/headers` alone can drop them in production.
 */
function createCallbackClient(
  request: NextRequest,
  getResponse: () => NextResponse,
  setResponse: (response: NextResponse) => void
) {
  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        const response = getResponse()
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
        setResponse(response)
      },
    },
  })
}

async function resolvePostAuthPath(
  supabase: SupabaseClient,
  preferred: string
): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return preferred

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .maybeSingle()

  // New users (or incomplete profiles) always finish onboarding first.
  if (!profile || profile.onboarding_completed === false) {
    return "/onboarding"
  }

  if (preferred === "/onboarding") return "/dashboard"
  return preferred
}

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie)
  })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const origin = appOrigin(request)

  const code = searchParams.get("code")
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const preferredRedirect = safePath(
    searchParams.get("redirect") ?? searchParams.get("next"),
    "/onboarding"
  )

  const oauthError = searchParams.get("error")
  const oauthDescription =
    searchParams.get("error_description") ?? searchParams.get("error_code")

  if (oauthError) {
    console.error("[auth/callback] provider error", {
      error: oauthError,
      description: oauthDescription,
    })

    const likelyAlreadyConfirmed =
      oauthError === "access_denied" ||
      oauthDescription?.toLowerCase().includes("expired") ||
      oauthDescription?.toLowerCase().includes("otp") ||
      oauthDescription?.toLowerCase().includes("invalid")

    return signInRedirect(origin, {
      message: likelyAlreadyConfirmed
        ? "Email confirmed. Please sign in to continue."
        : undefined,
      error: likelyAlreadyConfirmed
        ? undefined
        : oauthDescription ?? "auth_callback_failed",
      redirect: preferredRedirect,
    })
  }

  if (!isSupabaseConfigured()) {
    console.error("[auth/callback] Supabase is not configured")
    return signInRedirect(origin, {
      error: "Authentication is not configured.",
      redirect: preferredRedirect,
    })
  }

  async function establishSession(
    run: (supabase: SupabaseClient) => Promise<{ error: { message: string; status?: number; code?: string } | null }>
  ) {
    let redirectPath = preferredRedirect
    let response = NextResponse.redirect(new URL(redirectPath, origin))

    const supabase = createCallbackClient(
      request,
      () => response,
      (next) => {
        response = next
      }
    )

    const { error } = await run(supabase)
    if (error) return { error, response: null as NextResponse | null }

    redirectPath = await resolvePostAuthPath(supabase, preferredRedirect)
    const finalResponse = NextResponse.redirect(new URL(redirectPath, origin))
    copyCookies(response, finalResponse)

    console.log("[auth/callback] session established", { next: redirectPath })
    return { error: null, response: finalResponse }
  }

  // PKCE / OAuth: ?code=...
  if (code) {
    const result = await establishSession((supabase) =>
      supabase.auth.exchangeCodeForSession(code)
    )

    if (result.response) return result.response

    console.error("[auth/callback] exchangeCodeForSession failed", {
      message: result.error?.message,
      status: result.error?.status,
      code: result.error?.code,
    })

    // Confirmation often succeeds even when the one-time code cannot create a
    // browser session (mail-app prefetch, link opened twice, expired code).
    return signInRedirect(origin, {
      message: "Email confirmed. Please sign in to continue.",
      redirect: preferredRedirect,
    })
  }

  // Email OTP / confirmation: ?token_hash=...&type=signup
  if (tokenHash && type) {
    const result = await establishSession((supabase) =>
      supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    )

    if (result.response) return result.response

    console.error("[auth/callback] verifyOtp failed", {
      type,
      message: result.error?.message,
      status: result.error?.status,
      code: result.error?.code,
    })

    return signInRedirect(origin, {
      message: "Email confirmed. Please sign in to continue.",
      redirect: preferredRedirect,
    })
  }

  console.error("[auth/callback] missing code/token_hash", {
    keys: Array.from(searchParams.keys()),
  })

  return signInRedirect(origin, {
    message: "Email confirmed. Please sign in to continue.",
    redirect: preferredRedirect,
  })
}
