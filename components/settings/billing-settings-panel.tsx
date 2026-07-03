"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { AlertTriangleIcon, CheckCircle2Icon, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/components/providers/auth-provider"
import { useSubscription } from "@/components/providers/subscription-provider"
import { isPrivateBetaEnabled } from "@/lib/config/private-beta"
import {
  fetchSubscriptionStatus,
  type BillingStatus,
} from "@/lib/subscription/client"
import { PrivateBetaNotice } from "@/components/marketing/private-beta-notice"

const POLL_INTERVAL_MS = 2000
const POLL_MAX_ATTEMPTS = 15

export function BillingSettingsPanel() {
  const { user } = useAuth()
  const { refresh: refreshProvider } = useSubscription()
  const searchParams = useSearchParams()
  const checkoutState = searchParams.get("checkout")

  // Local server snapshot — never fall back to a stale provider Free state.
  const [billing, setBilling] = useState<BillingStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState<string | null>(null)
  const [activationPending, setActivationPending] = useState(
    checkoutState === "success"
  )
  const [activationDelayed, setActivationDelayed] = useState(false)
  const [webhookWarning, setWebhookWarning] = useState<string | null>(null)
  const polledRef = useRef(false)

  const loadBilling = useCallback(async () => {
    const status = await fetchSubscriptionStatus()
    if (!status?.billing) {
      setLoadError("Could not load billing status.")
      setBilling(null)
      return null
    }
    setLoadError(null)
    setBilling(status.billing)
    void refreshProvider()
    return status
  }, [refreshProvider])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    void loadBilling().finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [loadBilling, user?.id])

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return
    void fetch("/api/stripe/status")
      .then((res) => res.json() as Promise<{ webhookConfigured?: boolean }>)
      .then((data) => {
        if (data.webhookConfigured === false) {
          setWebhookWarning(
            "Stripe webhook is not configured. Payments will not activate Pro locally. Run: stripe listen --forward-to localhost:3000/api/stripe/webhook"
          )
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (billing?.isPro) {
      setActivationPending(false)
      setActivationDelayed(false)
    }
  }, [billing?.isPro])

  useEffect(() => {
    if (checkoutState !== "success" || polledRef.current) return
    polledRef.current = true
    setActivationPending(true)

    let attempts = 0

    const pollOnce = async () => {
      const status = await loadBilling()
      if (status?.billing?.isPro) {
        setActivationPending(false)
        setActivationDelayed(false)
        return true
      }
      return false
    }

    const interval = setInterval(() => {
      attempts += 1
      void pollOnce().then((activated) => {
        if (activated || attempts >= POLL_MAX_ATTEMPTS) {
          clearInterval(interval)
          if (!activated) {
            setActivationPending(false)
            setActivationDelayed(true)
          }
        }
      })
    }, POLL_INTERVAL_MS)

    void pollOnce().then((activated) => {
      if (activated) clearInterval(interval)
    })

    return () => clearInterval(interval)
  }, [checkoutState, loadBilling])

  if (loading) return <Skeleton className="h-40 w-full rounded-xl" />

  if (!billing) {
    return (
      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-destructive">
            {loadError ?? "Could not load billing status."}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setLoading(true)
              void loadBilling().finally(() => setLoading(false))
            }}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const hasPro = billing.isPro
  const isBetaGrant = billing.source === "admin_grant"
  const isStripe = billing.source === "stripe"
  const canManage = billing.canManageStripe

  const handleManage = async () => {
    setPortalLoading(true)
    setPortalError(null)
    try {
      const res = await fetch("/api/billing-portal", { method: "POST" })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        setPortalError(data.error ?? "Could not open the billing portal.")
        setPortalLoading(false)
        return
      }
      window.location.href = data.url
    } catch {
      setPortalError("Could not open the billing portal.")
      setPortalLoading(false)
    }
  }

  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader>
        <CardTitle className="text-base">Subscription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {webhookWarning && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
            <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
            <p>{webhookWarning}</p>
          </div>
        )}

        {checkoutState === "success" && activationPending && !hasPro && (
          <div className="flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
            <Loader2Icon className="mt-0.5 size-4 shrink-0 animate-spin text-primary" />
            <p>
              Payment received — your subscription is being activated. This
              usually takes a few seconds.
            </p>
          </div>
        )}

        {checkoutState === "success" && hasPro && isStripe && (
          <div className="flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>Your subscription is active. Pro features are now unlocked.</p>
          </div>
        )}

        {isBetaGrant && (
          <div className="flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>
              Private beta access is active. Pro features are unlocked for your
              account.
            </p>
          </div>
        )}

        {activationDelayed && !hasPro && (
          <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
            <p>
              Payment succeeded, but your subscription is not showing as active
              yet. Confirm you are signed in as the same account used at
              checkout
              {user?.id && (
                <>
                  {" "}
                  (session: <code className="text-xs">{user.id}</code>)
                </>
              )}
              . Try refreshing this page.
            </p>
          </div>
        )}

        {checkoutState === "cancelled" && (
          <div className="rounded-xl border border-border/60 bg-background/40 p-4 text-sm text-muted-foreground">
            Checkout was cancelled. No charge was made.
          </div>
        )}

        <div className="rounded-xl border border-border/60 bg-background/40 p-4">
          <p className="text-sm text-muted-foreground">Current plan</p>
          <p className="mt-1 text-2xl font-semibold">{billing.planLabel}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Status: {billing.statusLabel}
          </p>
          {billing.sourceLabel && (
            <p className="mt-1 text-xs text-muted-foreground">
              Source: {billing.sourceLabel}
            </p>
          )}
          {isBetaGrant && billing.grantExpiresAt && (
            <p className="mt-1 text-xs text-muted-foreground">
              Expires{" "}
              {new Date(billing.grantExpiresAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
          {isBetaGrant && billing.grantReason && (
            <p className="mt-1 text-xs text-muted-foreground">
              {billing.grantReason}
            </p>
          )}
          {isStripe && billing.currentPeriodEnd && (
            <p className="mt-1 text-xs text-muted-foreground">
              {billing.cancelAtPeriodEnd ? "Access ends" : "Renews"}{" "}
              {new Date(billing.currentPeriodEnd).toLocaleDateString()}
            </p>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          {isBetaGrant
            ? "Your Pro access was granted for private beta. No payment is required."
            : isPrivateBetaEnabled()
              ? "Private beta — Pro access is invite-only. Paid plans open after beta."
              : "Weekly, 6-month, and annual plans unlock the same Pro features. Cancel anytime — you keep access until the end of your current billing period."}
        </p>

        {!hasPro && isPrivateBetaEnabled() && <PrivateBetaNotice compact />}

        <div className="flex flex-wrap items-center gap-2">
          {canManage && (
            <Button
              variant="outline"
              disabled={portalLoading}
              onClick={() => void handleManage()}
            >
              {portalLoading && (
                <Loader2Icon className="animate-spin" data-icon="inline-start" />
              )}
              Manage subscription
            </Button>
          )}
          {!hasPro && !isPrivateBetaEnabled() && (
            <Button render={<Link href="/pricing" />}>Upgrade plan</Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setLoading(true)
              void loadBilling().finally(() => setLoading(false))
            }}
          >
            Refresh
          </Button>
        </div>
        {portalError && (
          <p className="text-xs text-destructive">{portalError}</p>
        )}
      </CardContent>
    </Card>
  )
}
