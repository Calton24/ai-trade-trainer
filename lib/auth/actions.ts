"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import type { TradingExperience } from "@/lib/auth/types"
import {
  getAuthCallbackUrl,
  getAuthSiteUrl,
  mapAuthErrorMessage,
  normalizeAuthEmail,
} from "@/lib/auth/utils"
import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"

export type AuthActionResult = {
  error?: string
  success?: string
}

export async function signUp(formData: FormData): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return { error: "Authentication is not configured yet." }
  }

  const name = String(formData.get("name") ?? "").trim()
  const email = normalizeAuthEmail(String(formData.get("email") ?? ""))
  const password = String(formData.get("password") ?? "")
  const tradingExperience = String(
    formData.get("tradingExperience") ?? ""
  ).trim() as TradingExperience | ""

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required." }
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getAuthCallbackUrl("/onboarding"),
      data: {
        name,
        trading_experience: tradingExperience || null,
      },
    },
  })

  if (error) return { error: mapAuthErrorMessage(error.message) }

  if (data.user && tradingExperience) {
    await supabase
      .from("profiles")
      .update({ trading_experience: tradingExperience })
      .eq("id", data.user.id)
  }

  revalidatePath("/", "layout")

  if (!data.session) {
    redirect(
      `/sign-in?message=${encodeURIComponent("Check your email to confirm your account, then sign in.")}&email=${encodeURIComponent(email)}`
    )
  }

  redirect("/onboarding")
}

/** Only allow same-site relative redirects. */
function safeRedirect(value: FormDataEntryValue | null): string {
  const target = typeof value === "string" ? value : ""
  if (target.startsWith("/") && !target.startsWith("//")) return target
  return "/dashboard"
}

export async function signIn(formData: FormData): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return { error: "Authentication is not configured yet." }
  }

  const email = normalizeAuthEmail(String(formData.get("email") ?? ""))
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { error: mapAuthErrorMessage(error.message) }

  if (!data.session) {
    return {
      error:
        "Sign-in succeeded but no session was created. Try again or reset your password.",
    }
  }

  revalidatePath("/", "layout")
  redirect(safeRedirect(formData.get("redirect")))
}

export async function signOut() {
  if (!isSupabaseConfigured()) return

  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/sign-in")
}

export async function forgotPassword(formData: FormData): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return { error: "Authentication is not configured yet." }
  }

  const email = normalizeAuthEmail(String(formData.get("email") ?? ""))
  if (!email) return { error: "Email is required." }

  const siteUrl = getAuthSiteUrl()

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?redirect=${encodeURIComponent("/reset-password")}`,
  })

  if (error) return { error: error.message }
  return { success: "Check your email for a password reset link." }
}

export async function resetPassword(formData: FormData): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return { error: "Authentication is not configured yet." }
  }

  const password = String(formData.get("password") ?? "")
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function enrollInFeature(featureId: string): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return { error: "Sign in to enroll in courses." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "You must be signed in to enroll." }

  const { error } = await supabase.from("feature_enrollments").upsert(
    { user_id: user.id, feature_id: featureId },
    { onConflict: "user_id,feature_id" }
  )

  if (error) return { error: error.message }
  revalidatePath("/profile")
  return { success: "Enrolled successfully." }
}
