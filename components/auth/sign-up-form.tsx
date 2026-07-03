"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useActionState, useEffect, useState } from "react"
import { Loader2Icon } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
import { signUp, type AuthActionResult } from "@/lib/auth/actions"
import { trackSignUpStarted } from "@/lib/analytics/events"
import { SIGNUP_PENDING_STORAGE_KEY } from "@/lib/analytics/signup-flag"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: AuthActionResult = {}

/** Marks that a signup just happened so the onboarding page can fire `sign_up_completed` once it lands. */
function markSignupPending() {
  try {
    sessionStorage.setItem(SIGNUP_PENDING_STORAGE_KEY, "1")
  } catch {
    // sessionStorage unavailable — non-critical.
  }
}

export function SignUpForm() {
  const { isConfigured, signUpLocally } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") ?? "/onboarding"
  const selectedPlan = searchParams.get("plan")

  const [state, formAction, pending] = useActionState(
    async (_prev: AuthActionResult, formData: FormData) => signUp(formData),
    initialState
  )

  const [localError, setLocalError] = useState<string | null>(null)
  const [localPending, setLocalPending] = useState(false)

  useEffect(() => {
    trackSignUpStarted({ plan: selectedPlan })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleLocalSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLocalError(null)
    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") ?? "").trim()
    const email = String(form.get("email") ?? "").trim()
    const password = String(form.get("password") ?? "")

    if (!name || !email) {
      setLocalError("Name and email are required.")
      return
    }
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.")
      return
    }

    setLocalPending(true)
    markSignupPending()
    signUpLocally({ name, email, tradingExperience: null })
    router.push(redirectTo.startsWith("/") ? redirectTo : "/onboarding")
  }

  const formProps = isConfigured
    ? { action: formAction, onSubmit: markSignupPending }
    : { onSubmit: handleLocalSubmit }
  const error = isConfigured ? state.error : localError
  const busy = isConfigured ? pending : localPending

  const signInHref =
    redirectTo !== "/dashboard" && redirectTo !== "/onboarding"
      ? `/sign-in?redirect=${encodeURIComponent(redirectTo)}`
      : "/sign-in"

  return (
    <form {...formProps} className="flex flex-col gap-5">
      <input type="hidden" name="redirect" value={redirectTo} />
      {selectedPlan && (
        <input type="hidden" name="plan" value={selectedPlan} />
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          required
          autoComplete="name"
          autoFocus
          placeholder="Your name"
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          className="h-11"
        />
        <p className="text-xs text-muted-foreground">
          Use at least 8 characters.
        </p>
      </div>

      {error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? (
          <>
            <Loader2Icon className="animate-spin" data-icon="inline-start" />
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="text-foreground/80 hover:text-primary">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-foreground/80 hover:text-primary">
          Privacy Policy
        </Link>
        .
      </p>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={signInHref} className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
