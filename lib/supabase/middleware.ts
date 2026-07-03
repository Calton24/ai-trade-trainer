import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

import { isProtectedPath, isAuthEntryPath } from "@/lib/auth/route-access"
import { fetchActiveAdminGrant } from "@/lib/data/admin-grant-service"
import { fetchUserSubscription } from "@/lib/data/subscription-service"
import {
  hasProAccess,
  isDevProUnlockEnabled,
  requiresProSubscription,
} from "@/lib/subscription/access"
import { isPrivateBetaEnabled } from "@/lib/config/private-beta"
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "./config"

/**
 * Refresh the Supabase session on every matched request and enforce route
 * protection server-side when credentials are configured.
 *
 * This is the source of truth for access control — the client-side
 * `RouteGuard`/`UpgradeModal` only exist to avoid UI flicker, never to
 * enforce anything. Unauthenticated or non-Pro requests are redirected here
 * before any protected page renders.
 *
 * Subscription checks use the request-scoped Supabase client (anon key +
 * the user's session cookies), so lookups are bound by the
 * "Users select own subscription" RLS policy on `user_subscriptions`. No
 * service-role key is ever loaded in this file, so nothing sensitive is at
 * risk of leaking into the proxy/edge bundle.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  if (!isSupabaseConfigured()) {
    return supabaseResponse
  }

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  if (user && isAuthEntryPath(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    url.search = ""
    return NextResponse.redirect(url)
  }

  if (!user && isProtectedPath(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = "/sign-in"
    url.search = ""
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  if (user && requiresProSubscription(pathname)) {
    const devUnlock = isDevProUnlockEnabled()
    const [subscription, adminGrant] = await Promise.all([
      fetchUserSubscription(supabase, user.id),
      fetchActiveAdminGrant(supabase, user.id),
    ])
    const proAccess = hasProAccess(subscription, adminGrant)

    if (process.env.NODE_ENV === "development") {
      console.debug("[proxy] pro gate", {
        pathname,
        devUnlock,
        proAccess,
        requiresPro: requiresProSubscription(pathname),
        ENABLE_DEV_PRO_UNLOCK: process.env.ENABLE_DEV_PRO_UNLOCK,
        NEXT_PUBLIC_ENABLE_DEV_PRO_UNLOCK:
          process.env.NEXT_PUBLIC_ENABLE_DEV_PRO_UNLOCK,
      })
    }

    if (!proAccess) {
      const url = request.nextUrl.clone()
      if (isPrivateBetaEnabled()) {
        url.pathname = "/dashboard"
        url.search = ""
        url.searchParams.set("beta", "limited")
      } else {
        url.pathname = "/pricing"
        url.search = ""
        url.searchParams.set("upgrade", "1")
        url.searchParams.set("redirect", pathname)
      }
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
