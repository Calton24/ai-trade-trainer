"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import { useAuth } from "@/components/providers/auth-provider"
import {
  fetchSubscriptionStatus,
  type BillingStatus,
} from "@/lib/subscription/client"
import type { ProAccessSource } from "@/lib/subscription/access"
import type { AdminGrant } from "@/lib/subscription/admin-grant-types"
import type { UserSubscription } from "@/lib/subscription/types"
import { isSupabaseConfigured } from "@/lib/supabase/config"

interface SubscriptionContextValue {
  subscription: UserSubscription | null
  adminGrant: AdminGrant | null
  billing: BillingStatus | null
  proSource: ProAccessSource
  loading: boolean
  hasPro: boolean
  refresh: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null)

const DEFAULT_FREE: UserSubscription = {
  id: "local",
  userId: "local",
  plan: "free",
  status: "inactive",
  currentPeriodStart: null,
  currentPeriodEnd: null,
  provider: "manual",
  providerCustomerId: null,
  providerSubscriptionId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const DEFAULT_BILLING: BillingStatus = {
  planLabel: "Free",
  statusLabel: "Inactive",
  isPro: false,
  source: "free",
  currentPeriodEnd: null,
  grantExpiresAt: null,
  grantReason: null,
  cancelAtPeriodEnd: false,
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  canManageStripe: false,
  sourceLabel: null,
  subscription: DEFAULT_FREE,
  adminGrant: null,
  proSource: "none",
}

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, authMode } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [adminGrant, setAdminGrant] = useState<AdminGrant | null>(null)
  const [billing, setBilling] = useState<BillingStatus | null>(null)
  const [proSource, setProSource] = useState<ProAccessSource>("none")
  const [hasPro, setHasPro] = useState(false)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured() || authMode !== "supabase" || !user) {
      setSubscription(isAuthenticated ? DEFAULT_FREE : null)
      setAdminGrant(null)
      setBilling(isAuthenticated ? DEFAULT_BILLING : null)
      setProSource("none")
      setHasPro(false)
      setLoading(false)
      return
    }

    try {
      const status = await fetchSubscriptionStatus()
      if (!status) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[subscription] status API unavailable — showing free tier")
        }
        setSubscription(DEFAULT_FREE)
        setAdminGrant(null)
        setBilling(DEFAULT_BILLING)
        setProSource("none")
        setHasPro(false)
        return
      }

      if (process.env.NODE_ENV === "development") {
        console.debug("[subscription] provider refresh", {
          sessionUserId: user.id,
          apiUserId: status.userId,
          source: status.billing?.source,
          planLabel: status.billing?.planLabel,
          hasPro: status.hasPro,
          proSource: status.proSource,
        })
      }

      setSubscription(status.subscription ?? DEFAULT_FREE)
      setAdminGrant(status.adminGrant)
      setBilling(status.billing ?? DEFAULT_BILLING)
      setProSource(status.proSource)
      setHasPro(status.hasPro)
    } catch (error) {
      console.error("[subscription] refresh failed", error)
      setSubscription(DEFAULT_FREE)
      setAdminGrant(null)
      setBilling(DEFAULT_BILLING)
      setProSource("none")
      setHasPro(false)
    } finally {
      setLoading(false)
    }
  }, [user, isAuthenticated, authMode])

  useEffect(() => {
    setLoading(true)
    void refresh()
  }, [refresh])

  const value = useMemo(
    () => ({
      subscription,
      adminGrant,
      billing,
      proSource,
      loading,
      hasPro,
      refresh,
    }),
    [subscription, adminGrant, billing, proSource, loading, hasPro, refresh]
  )

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) {
    throw new Error("useSubscription must be used within SubscriptionProvider")
  }
  return ctx
}
