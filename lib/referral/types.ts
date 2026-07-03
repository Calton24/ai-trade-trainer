export interface ReferralCapture {
  promoCode: string | null
  partnerSlug: string | null
  firstSeenAt: string
  landingUrl: string
}

export interface ReferralPartner {
  id: string
  name: string
  slug: string
  promoCode: string
  commissionPercent: number
  status: string
  createdAt: string
}

export interface ReferralAttribution {
  id: string
  userId: string
  partnerId: string
  promoCode: string
  sourceUrl: string | null
  firstSeenAt: string
  signedUpAt: string | null
  convertedAt: string | null
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  plan: string | null
  amountGbp: number | null
  commissionPercent: number | null
  commissionDueGbp: number | null
  createdAt: string
}
