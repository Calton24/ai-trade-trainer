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
import { fetchUserSubscription } from "@/lib/data/subscription-service"
import { hasProAccess } from "@/lib/subscription/access"
import type { UserSubscription } from "@/lib/subscription/types"
import { createClientIfConfigured } from "@/lib/supabase/client"
import { isSupabaseConfigured } from "@/lib/supabase/config"

interface SubscriptionContextValue {
  subscription: UserSubscription | null
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

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, authMode } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured() || authMode !== "supabase" || !user) {
      setSubscription(isAuthenticated ? DEFAULT_FREE : null)
      setLoading(false)
      return
    }

    const supabase = createClientIfConfigured()
    if (!supabase) {
      setLoading(false)
      return
    }

    const row = await fetchUserSubscription(supabase, user.id)
    setSubscription(row ?? DEFAULT_FREE)
    setLoading(false)
  }, [user, isAuthenticated, authMode])

  useEffect(() => {
    setLoading(true)
    void refresh()
  }, [refresh])

  const value = useMemo(
    () => ({
      subscription,
      loading,
      hasPro: hasProAccess(subscription),
      refresh,
    }),
    [subscription, loading, refresh]
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
