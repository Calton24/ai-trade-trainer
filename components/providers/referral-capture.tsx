"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

import { useAuth } from "@/components/providers/auth-provider"
import {
  clearStoredReferral,
  readStoredReferral,
  storeReferral,
} from "@/lib/referral/storage"

/**
 * Captures ?ref=slug and ?promo=CODE on first visit, persists to localStorage,
 * and attributes the signed-in user once after signup.
 */
export function ReferralCapture() {
  const searchParams = useSearchParams()
  const { isAuthenticated, authMode } = useAuth()
  const attributedRef = useRef(false)

  useEffect(() => {
    const ref = searchParams.get("ref")?.trim().toLowerCase()
    const promo = searchParams.get("promo")?.trim().toUpperCase()
    if (!ref && !promo) return

    storeReferral({
      partnerSlug: ref ?? null,
      promoCode: promo ?? null,
      firstSeenAt: new Date().toISOString(),
      landingUrl: window.location.href,
    })
  }, [searchParams])

  useEffect(() => {
    if (!isAuthenticated || authMode !== "supabase" || attributedRef.current) {
      return
    }

    const capture = readStoredReferral()
    if (!capture) return

    attributedRef.current = true

    void fetch("/api/referral/attribute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(capture),
    })
      .then((res) => {
        if (res.ok) clearStoredReferral()
      })
      .catch(() => {
        attributedRef.current = false
      })
  }, [isAuthenticated, authMode])

  return null
}
