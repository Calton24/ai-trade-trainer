"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Loader2Icon } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
import { useSubscription } from "@/components/providers/subscription-provider"
import { Button } from "@/components/ui/button"
import { trackCheckoutStarted } from "@/lib/analytics/events"
import type { PricingTier } from "@/lib/types"

interface PricingCheckoutButtonProps {
  tier: PricingTier
  variant: "default" | "outline"
}

export function PricingCheckoutButton({
  tier,
  variant,
}: PricingCheckoutButtonProps) {
  const { isAuthenticated, authMode } = useAuth()
  const { hasPro, loading: subLoading } = useSubscription()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  // Set by the proxy when it redirects a signed-in free user here from a
  // Pro-only route — carried through checkout so they land back where they
  // were headed instead of a generic billing page.
  const redirectTo = searchParams.get("redirect")

  // Already subscribed (any active plan) — send to billing instead of
  // starting a second checkout.
  if (isAuthenticated && !subLoading && hasPro) {
    return (
      <Button
        className="w-full"
        variant="outline"
        render={<Link href="/settings/billing" />}
      >
        Manage Plan
      </Button>
    )
  }

  // Local/no-Supabase auth mode has no Stripe customer to attach to — send
  // to sign-up so the user gets a real account first.
  if (!isAuthenticated || authMode !== "supabase") {
    const signUpHref = `/sign-up?plan=${encodeURIComponent(tier.id)}${
      redirectTo ? `&redirect=${encodeURIComponent(redirectTo)}` : ""
    }`
    return (
      <Button
        className="w-full"
        variant={variant}
        render={<Link href={signUpHref} />}
      >
        {tier.cta}
      </Button>
    )
  }

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)
    trackCheckoutStarted({ plan: tier.id })
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: tier.id,
          ...(redirectTo ? { redirectTo } : {}),
        }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        setError(data.error ?? "Could not start checkout. Please try again.")
        setLoading(false)
        return
      }
      window.location.href = data.url
    } catch {
      setError("Could not start checkout. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <Button
        className="w-full"
        variant={variant}
        disabled={loading}
        onClick={() => void handleCheckout()}
      >
        {loading && <Loader2Icon className="animate-spin" data-icon="inline-start" />}
        {loading ? "Redirecting…" : tier.cta}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
