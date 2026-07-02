"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useActionState, useState } from "react"

import { AuthDivider, OAuthButtons } from "@/components/auth/oauth-buttons"
import { useAuth } from "@/components/providers/auth-provider"
import { signUp, type AuthActionResult } from "@/lib/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: AuthActionResult = {}

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
    signUpLocally({ name, email, tradingExperience: null })
    router.push(redirectTo.startsWith("/") ? redirectTo : "/onboarding")
  }

  const formProps = isConfigured
    ? { action: formAction }
    : { onSubmit: handleLocalSubmit }
  const error = isConfigured ? state.error : localError
  const busy = isConfigured ? pending : localPending

  return (
    <div className="flex flex-col gap-4">
      <OAuthButtons redirectTo={redirectTo} />
      {isConfigured && <AuthDivider />}

      <form {...formProps} className="flex flex-col gap-4">
        <input type="hidden" name="redirect" value={redirectTo} />
        {selectedPlan && (
          <input type="hidden" name="plan" value={selectedPlan} />
        )}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
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
          />
          <p className="text-xs text-muted-foreground">At least 8 characters</p>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={busy}>
          {busy ? "Creating account..." : "Create account"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={`/sign-in${redirectTo !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            className="text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
