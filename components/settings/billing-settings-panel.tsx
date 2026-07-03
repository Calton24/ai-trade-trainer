"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { AlertTriangleIcon, CheckCircle2Icon, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/components/providers/auth-provider"
import { useSubscription } from "@/components/providers/subscription-provider"
import { planLabel, statusLabel } from "@/lib/subscription/access"
import { isPrivateBetaEnabled } from "@/lib/config/private-beta"
import { fetchSubscriptionStatus } from "@/lib/subscription/client"
import { PrivateBetaNotice } from "@/components/marketing/private-beta-notice"

const POLL_INTERVAL_MS = 2000
const POLL_MAX_ATTEMPTS = 15 // 30 seconds

export function BillingSettingsPanel() {
  const { user } = useAuth()
  const { subscription, loading, hasPro, proSource, adminGrant, refresh } =
    useSubscription()
  const searchParams = useSearchParams()
  const checkoutState = searchParams.get("checkout")
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState<string | null>(null)
  const [activationPending, setActivationPending] = useState(
    checkoutState === "success"
  )
  const [activationDelayed, setActivationDelayed] = useState(false)
  const [webhookWarning, setWebhookWarning] = useState<string | null>(null)
  const polledRef = useRef(false)

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
    if (hasPro) {
      setActivationPending(false)
      setActivationDelayed(false)
    }
  }, [hasPro])

  useEffect(() => {
    if (checkoutState !== "success" || polledRef.current) return
    polledRef.current = true
    setActivationPending(true)

    let attempts = 0

    const pollOnce = async () => {
      const status = await fetchSubscriptionStatus()

      if (process.env.NODE_ENV === "development") {
        console.debug("[billing]", {
          sessionUserId: user?.id ?? null,
          apiUserId: status?.userId ?? null,
          plan: status?.subscription?.plan ?? "free",
          subscriptionStatus: status?.subscription?.status ?? "inactive",
          hasProAccess: status?.hasPro ?? false,
        })
      }

      await refresh()

      if (status?.hasPro) {
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
  }, [checkoutState, refresh, user?.id])

  if (loading) return <Skeleton className="h-40 w-full rounded-xl" />

  const plan =
    proSource === "admin_grant"
      ? "Beta Pro"
      : planLabel(subscription?.plan ?? "free")
  const status =
    proSource === "admin_grant"
      ? "Active"
      : statusLabel(subscription?.status ?? "inactive")
  const canManage =
    proSource === "stripe" &&
    subscription?.provider === "stripe" &&
    subscription.providerCustomerId

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

        {checkoutState === "success" && hasPro && (
          <div className="flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>Your subscription is active. Pro features are now unlocked.</p>
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
              . If the webhook is configured, try refreshing this page. Locally,
              run{" "}
              <code className="text-xs">
                stripe listen --forward-to localhost:3000/api/stripe/webhook
              </code>{" "}
              and set <code className="text-xs">STRIPE_WEBHOOK_SECRET</code> in{" "}
              <code className="text-xs">.env.local</code>, then restart the dev
              server.
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
          <p className="mt-1 text-2xl font-semibold">{plan}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Status: {status}
          </p>
          {proSource === "admin_grant" && adminGrant?.expiresAt && (
            <p className="mt-1 text-xs text-muted-foreground">
              Beta access ends{" "}
              {new Date(adminGrant.expiresAt).toLocaleDateString()}
            </p>
          )}
          {subscription?.currentPeriodEnd && hasPro && proSource === "stripe" && (
            <p className="mt-1 text-xs text-muted-foreground">
              {status === "cancelled" ? "Access ends" : "Renews"}{" "}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {isPrivateBetaEnabled()
            ? "Private beta — Pro access is invite-only. Paid plans open after beta."
            : "Weekly, 6-month, and annual plans unlock the same Pro features. Cancel anytime — you keep access until the end of your current billing period."}
        </p>
        {!hasPro && isPrivateBetaEnabled() && (
          <PrivateBetaNotice compact />
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            disabled={!canManage || portalLoading}
            onClick={() => void handleManage()}
          >
            {portalLoading && (
              <Loader2Icon className="animate-spin" data-icon="inline-start" />
            )}
            Manage subscription
          </Button>
          {!hasPro && !isPrivateBetaEnabled() && (
            <Button render={<Link href="/pricing" />}>Upgrade plan</Button>
          )}
        </div>
        {portalError && (
          <p className="text-xs text-destructive">{portalError}</p>
        )}
      </CardContent>
    </Card>
  )
}
