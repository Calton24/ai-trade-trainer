"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LockIcon } from "lucide-react"

import { UpgradeModal } from "@/components/auth/upgrade-modal"
import { Button } from "@/components/ui/button"
import { useSubscription } from "@/components/providers/subscription-provider"
import { trackProGateHit } from "@/lib/analytics/events"
import { requiresProSubscription } from "@/lib/subscription/access"

export function ProAccessRequired({ pathname }: { pathname: string }) {
  const router = useRouter()
  const { loading, hasPro } = useSubscription()

  useEffect(() => {
    if (!loading && !hasPro) trackProGateHit({ pathname })
  }, [loading, hasPro, pathname])

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (hasPro) return null

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
          <LockIcon className="size-6 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold">Pro feature</h1>
        <p className="mt-2 text-muted-foreground">
          <span className="font-medium text-foreground">{pathname}</span> requires
          an active subscription. Choose weekly, 6-month, or annual to unlock
          the full programme.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button render={<Link href="/pricing" />}>View Plans</Button>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ProGatedLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  const { hasPro, loading } = useSubscription()
  const [open, setOpen] = useState(false)

  if (loading) {
    return <span className={className}>{children}</span>
  }

  if (hasPro || !requiresProSubscription(href)) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      <UpgradeModal open={open} onOpenChange={setOpen} />
    </>
  )
}
