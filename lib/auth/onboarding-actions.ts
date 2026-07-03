"use server"

import { revalidatePath } from "next/cache"

import {
  checkUsernameAvailable,
  completeOnboarding,
  getOnboardingState,
  saveOnboardingStep,
} from "@/lib/data/onboarding-service"
import type { OnboardingData, OnboardingStep } from "@/lib/onboarding/types"
import { captureError } from "@/lib/observability/sentry"
import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"

export type OnboardingActionResult = {
  error?: string
  updatedAt?: string
  profile?: Awaited<ReturnType<typeof getOnboardingState>>
}

async function requireUser() {
  if (!isSupabaseConfigured()) {
    return {
      error: "Supabase is not configured." as const,
      supabase: null,
      userId: null,
    }
  }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return {
      error: "You must be signed in." as const,
      supabase: null,
      userId: null,
    }
  }
  return { error: null, supabase, userId: user.id }
}

export async function fetchOnboardingStateAction(): Promise<{
  state?: Awaited<ReturnType<typeof getOnboardingState>>
  error?: string
}> {
  const ctx = await requireUser()
  if (ctx.error || !ctx.supabase || !ctx.userId)
    return { error: ctx.error ?? "Unauthorized" }

  const state = await getOnboardingState(ctx.supabase, ctx.userId)
  return { state: state ?? undefined }
}

export async function saveOnboardingStepAction(
  step: OnboardingStep,
  data: OnboardingData,
  advanceTo?: OnboardingStep
): Promise<OnboardingActionResult> {
  const ctx = await requireUser()
  if (ctx.error || !ctx.supabase || !ctx.userId)
    return { error: ctx.error ?? "Unauthorized" }

  const nextStep = advanceTo ?? step
  let result: OnboardingActionResult
  try {
    result = await saveOnboardingStep(ctx.supabase, ctx.userId, nextStep, data)
  } catch (error) {
    captureError(error, { flow: "onboarding-save", step: nextStep, userId: ctx.userId })
    return { error: "Could not save your progress. Please try again." }
  }
  if (result.error) return result

  revalidatePath("/onboarding")
  revalidatePath("/", "layout")
  return result
}

export async function checkUsernameAction(
  username: string
): Promise<{ available: boolean; error?: string }> {
  const ctx = await requireUser()
  if (ctx.error || !ctx.supabase || !ctx.userId) {
    return { available: false, error: ctx.error ?? "Unauthorized" }
  }
  return checkUsernameAvailable(ctx.supabase, ctx.userId, username)
}

export async function finalizeOnboardingAction(
  data: OnboardingData
): Promise<OnboardingActionResult> {
  const ctx = await requireUser()
  if (ctx.error || !ctx.supabase || !ctx.userId)
    return { error: ctx.error ?? "Unauthorized" }

  let result: OnboardingActionResult
  try {
    result = await completeOnboarding(ctx.supabase, ctx.userId, data)
  } catch (error) {
    captureError(error, { flow: "onboarding-finalize", userId: ctx.userId })
    return { error: "Could not complete onboarding. Please try again." }
  }
  if (result.error) return result

  const profile = await getOnboardingState(ctx.supabase, ctx.userId)
  if (process.env.NODE_ENV === "development") {
    console.debug("[onboarding] refetched profile after completion", profile)
  }

  revalidatePath("/onboarding")
  revalidatePath("/dashboard")
  revalidatePath("/", "layout")
  return { ...result, profile }
}
