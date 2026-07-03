export type AdminGrantStatus = "active" | "revoked" | "expired"

export type AdminGrantType = "beta_pro"

export interface AdminGrant {
  id: string
  userId: string
  grantedBy: string | null
  grantType: AdminGrantType
  plan: string
  status: AdminGrantStatus
  startsAt: string
  expiresAt: string | null
  reason: string | null
  createdAt: string
  revokedAt: string | null
}
