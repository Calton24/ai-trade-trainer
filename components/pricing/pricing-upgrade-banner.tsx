"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { LockIcon } from "lucide-react"

import { trackPricingViewed } from "@/lib/analytics/events"

/**
 * Shown when the server proxy redirects a signed-in free user here from a
 * Pro-only route (`/pricing?upgrade=1&redirect=...`).
 */
export function PricingUpgradeBanner() {
  const searchParams = useSearchParams()
  const isProGateRedirect = searchParams.get("upgrade") === "1"

  useEffect(() => {
    trackPricingViewed({ source: isProGateRedirect ? "pro_gate_redirect" : "direct" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!isProGateRedirect) return null

  return (
    <div className="mx-auto mb-10 flex max-w-2xl items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
      <LockIcon className="mt-0.5 size-4 shrink-0 text-primary" />
      <p>
        <span className="font-medium text-foreground">
          You need Pro to access this feature.
        </span>{" "}
        Choose a plan below to unlock the full platform.
      </p>
    </div>
  )
}
