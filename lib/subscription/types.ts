export type SubscriptionPlan = "free" | "weekly" | "six_month" | "annual"

export type SubscriptionStatus =
  | "inactive"
  | "active"
  | "cancelled"
  | "expired"
  | "trialing"

export type SubscriptionProvider = "stripe" | "manual" | "test"

export interface UserSubscription {
  id: string
  userId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  provider: SubscriptionProvider
  providerCustomerId: string | null
  providerSubscriptionId: string | null
  createdAt: string
  updatedAt: string
}

export const PAID_PLANS: SubscriptionPlan[] = ["weekly", "six_month", "annual"]

export const ACTIVE_STATUSES: SubscriptionStatus[] = ["active", "trialing"]
