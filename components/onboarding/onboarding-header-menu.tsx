"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LogOutIcon, TrendingUpIcon } from "lucide-react"

import { onboardingGlass } from "@/components/onboarding/onboarding-styles"
import { useAuth } from "@/components/providers/auth-provider"
import { clearOnboardingDraft } from "@/lib/onboarding/draft-storage"
import { getDisplayName } from "@/lib/auth/greeting"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function OnboardingHeaderMenu() {
  const { user, profile, signOutClient, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [pending, setPending] = useState(false)

  if (loading || !isAuthenticated) {
    return (
      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-muted-foreground backdrop-blur-sm">
        Account setup
      </span>
    )
  }

  const displayName = getDisplayName(profile, user?.email)
  const emailPrefix = user?.email?.split("@")[0] ?? "your account"

  async function handleLogout() {
    setPending(true)
    if (user?.id) clearOnboardingDraft(user.id)
    await signOutClient()
    router.replace("/sign-in")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        Account setup
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-xs text-muted-foreground">Logged in as</p>
          <p className="truncate font-medium text-foreground">
            {displayName || emailPrefix}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Account setup in progress</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={pending}
          onClick={() => void handleLogout()}
        >
          <LogOutIcon className="size-4" />
          {pending ? "Logging out…" : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function OnboardingShellHeader() {
  return (
    <header className={onboardingGlass.header}>
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-primary/15 backdrop-blur-sm ring-1 ring-primary/25">
            <TrendingUpIcon className="size-4 text-primary" />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            TradeTrainer <span className="text-primary">AI</span>
          </span>
        </Link>
        <OnboardingHeaderMenu />
      </div>
    </header>
  )
}
