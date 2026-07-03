"use client"

import { useEffect } from "react"

import { useAuth } from "@/components/providers/auth-provider"
import { identifyUser, initPostHog, resetAnalytics } from "@/lib/analytics/posthog"

/**
 * Initializes PostHog (client-only, no-ops if `NEXT_PUBLIC_POSTHOG_KEY` is
 * unset) and keeps analytics identity in sync with the Supabase auth
 * session. Users are identified by Supabase user id only — never email or
 * name. See docs/observability.md.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    initPostHog()
  }, [])

  useEffect(() => {
    if (isAuthenticated && user) {
      identifyUser(user.id)
    } else {
      resetAnalytics()
    }
  }, [isAuthenticated, user])

  return <>{children}</>
}
