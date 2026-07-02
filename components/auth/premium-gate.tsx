"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowRightIcon,
  BarChart3Icon,
  BookOpenIcon,
  CheckIcon,
  FlameIcon,
  GaugeIcon,
  LockIcon,
  TrophyIcon,
} from "lucide-react"

import { UpgradeModal } from "@/components/auth/upgrade-modal"
import { useAuth } from "@/components/providers/auth-provider"
import { useSubscription } from "@/components/providers/subscription-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { signInWithReturn, signUpWithReturn } from "@/lib/auth/route-access"
import { requiresProSubscription } from "@/lib/subscription/access"

const AUTH_BENEFITS = [
  { icon: BookOpenIcon, label: "Structured courses & book library" },
  { icon: BarChart3Icon, label: "Interactive chart labs & simulator" },
  { icon: GaugeIcon, label: "Competency score & progress tracking" },
  { icon: TrophyIcon, label: "Trader ranks & achievements" },
  { icon: FlameIcon, label: "Daily challenges & streaks" },
  { icon: CheckIcon, label: "Public leaderboards" },
]

export function PremiumGateModal({
  open,
  onOpenChange,
  redirectTo,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  redirectTo: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <LockIcon className="size-5 text-primary" />
          </div>
          <DialogTitle className="text-xl">
            Unlock your trading journey
          </DialogTitle>
          <DialogDescription>
            Create a free account to start your structured trading education.
          </DialogDescription>
        </DialogHeader>

        <ul className="grid gap-2.5 py-2">
          {AUTH_BENEFITS.map((b) => (
            <li key={b.label} className="flex items-center gap-3 text-sm">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <b.icon className="size-4" />
              </span>
              {b.label}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2">
          <Button render={<Link href={signUpWithReturn(redirectTo)} />}>
            Create free account
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button
            variant="outline"
            render={<Link href={signInWithReturn(redirectTo)} />}
          >
            Sign in
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * A link that navigates when allowed; otherwise opens auth or upgrade modal.
 */
export function GatedLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuth()
  const { hasPro, loading } = useSubscription()
  const [authOpen, setAuthOpen] = useState(false)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const needsPro = requiresProSubscription(href)

  if (!loading && isAuthenticated && (!needsPro || hasPro)) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => {
          if (!isAuthenticated) setAuthOpen(true)
          else setUpgradeOpen(true)
        }}
      >
        {children}
      </button>
      <PremiumGateModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        redirectTo={href}
      />
      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </>
  )
}
