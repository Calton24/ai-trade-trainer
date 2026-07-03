"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { useAuth } from "@/components/providers/auth-provider"
import { UserProfileMenu } from "@/components/layout/user-profile-menu"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface AuthHeaderActionsProps {
  /** Show "Try a Drill" CTA when logged out (app shell). */
  showDrillCta?: boolean
  /** Marketing landing CTA: "Start Learning Free" instead of "Sign Up". */
  marketingCta?: boolean
}

export function AuthHeaderActions({
  showDrillCta = false,
  marketingCta = false,
}: AuthHeaderActionsProps) {
  const { isAuthenticated, loading } = useAuth()
  const pathname = usePathname()
  const isAuthPage =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password")

  if (isAuthPage) return null

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="hidden h-9 w-28 rounded-full sm:block" />
        <Skeleton className="size-9 rounded-full" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <UserProfileMenu />
  }

  return (
    <>
      {showDrillCta && (
        <Button
          variant="ghost"
          size="sm"
          className="hidden sm:inline-flex"
          render={<Link href="/training" />}
        >
          Try a Drill
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="hidden sm:inline-flex"
        render={<Link href="/sign-in" />}
      >
        Sign In
      </Button>
      <Button size="sm" render={<Link href="/sign-up" />}>
        {marketingCta ? "Start Learning Free" : "Sign Up"}
      </Button>
    </>
  )
}
