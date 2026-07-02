"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useSubscription } from "@/components/providers/subscription-provider"
import {
  planLabel,
  statusLabel,
} from "@/lib/subscription/access"

export function BillingSettingsPanel() {
  const { subscription, loading, hasPro } = useSubscription()

  if (loading) return <Skeleton className="h-40 w-full rounded-xl" />

  const plan = subscription?.plan ?? "free"
  const status = subscription?.status ?? "inactive"

  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader>
        <CardTitle className="text-base">Subscription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-border/60 bg-background/40 p-4">
          <p className="text-sm text-muted-foreground">Current plan</p>
          <p className="mt-1 text-2xl font-semibold">{planLabel(plan)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Status: {statusLabel(status)}
          </p>
          {subscription?.currentPeriodEnd && hasPro && (
            <p className="mt-1 text-xs text-muted-foreground">
              Renews{" "}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Weekly, 6-month, and annual plans unlock the same Pro features. Stripe
          checkout is coming soon — configure{" "}
          <code className="rounded bg-muted px-1 text-xs">STRIPE_SECRET_KEY</code>{" "}
          when ready.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" disabled>
            Manage subscription
          </Button>
          {!hasPro && (
            <Button render={<Link href="/pricing" />}>Upgrade plan</Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
