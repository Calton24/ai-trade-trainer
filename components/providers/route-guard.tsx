"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2Icon } from "lucide-react"

import { ProAccessRequired } from "@/components/auth/pro-access-required"
import { useAuth } from "@/components/providers/auth-provider"
import { useSubscription } from "@/components/providers/subscription-provider"
import { isPublicPath, signInWithReturn } from "@/lib/auth/route-access"
import { requiresProSubscription } from "@/lib/subscription/access"
import { isSupabaseConfigured } from "@/lib/supabase/config"

export function isOnboardingPath(pathname: string): boolean {
  return pathname === "/onboarding" || pathname.startsWith("/onboarding/")
}

/**
 * Client-side access gate. Public marketing/auth pages render freely; every
 * educational route requires authentication and redirects to sign-in with a
 * preserved return URL. Pro routes require an active subscription.
 */
export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, profile, user } = useAuth()
  const { hasPro, loading: subLoading } = useSubscription()
  const pathname = usePathname()
  const router = useRouter()
  const allowed = isPublicPath(pathname)
  const onOnboarding = isOnboardingPath(pathname)
  const needsPro = requiresProSubscription(pathname)

  const profileLoading =
    isSupabaseConfigured() &&
    isAuthenticated &&
    user &&
    profile === null &&
    !loading

  useEffect(() => {
    if (loading || profileLoading) return

    if (onOnboarding) {
      if (!isAuthenticated) {
        router.replace(signInWithReturn("/onboarding"))
        return
      }
      if (profile?.onboardingCompleted) {
        router.replace("/dashboard")
      }
      return
    }

    if (!allowed && !isAuthenticated) {
      router.replace(signInWithReturn(pathname))
      return
    }

    if (
      isSupabaseConfigured() &&
      user &&
      profile &&
      profile.onboardingCompleted === false &&
      !pathname.startsWith("/settings")
    ) {
      router.replace("/onboarding")
    }
  }, [
    loading,
    profileLoading,
    allowed,
    isAuthenticated,
    pathname,
    router,
    profile,
    user,
    onOnboarding,
  ])

  if (onOnboarding) {
    if (loading || profileLoading || !isAuthenticated) {
      return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-2">
          <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {loading ? "Checking session…" : "Loading profile…"}
          </p>
        </div>
      )
    }
    if (profile?.onboardingCompleted) {
      return (
        <div className="flex min-h-svh items-center justify-center">
          <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
        </div>
      )
    }
    return <>{children}</>
  }

  if (allowed) return <>{children}</>

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (needsPro && !subLoading && !hasPro) {
    return <ProAccessRequired pathname={pathname} />
  }

  return <>{children}</>
}
