import type { ReferralCapture } from "./types"

export const REFERRAL_STORAGE_KEY = "tradetrainer_referral"

export function readStoredReferral(): ReferralCapture | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(REFERRAL_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ReferralCapture
    if (!parsed.firstSeenAt) return null
    return parsed
  } catch {
    return null
  }
}

export function storeReferral(capture: ReferralCapture): void {
  if (typeof window === "undefined") return
  try {
    const existing = readStoredReferral()
    if (existing) return
    localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(capture))
  } catch {
    // localStorage unavailable — non-critical.
  }
}

export function clearStoredReferral(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(REFERRAL_STORAGE_KEY)
  } catch {
    // ignore
  }
}
