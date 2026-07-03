"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2Icon } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
import { signInWithEmailClient } from "@/lib/auth/client-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignInForm() {
  const { isConfigured, signInLocally, refresh } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") ?? "/dashboard"
  const queryMessage = searchParams.get("message")
  const queryError = searchParams.get("error")
  const prefilledEmail = searchParams.get("email") ?? ""

  const [email, setEmail] = useState(prefilledEmail)
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(queryMessage)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!queryError) return
    const decoded = decodeURIComponent(queryError)
    if (
      decoded === "auth_callback_failed" ||
      decoded.toLowerCase().includes("email confirmed")
    ) {
      setError(null)
      setInfo("Email confirmed. Please sign in to continue.")
      return
    }
    setError(decoded)
  }, [queryError])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setInfo(null)

    if (!isConfigured) {
      if (!email.trim()) {
        setError("Email is required.")
        return
      }
      setPending(true)
      signInLocally(email.trim())
      router.push(redirectTo.startsWith("/") ? redirectTo : "/dashboard")
      return
    }

    if (!email.trim() || !password) {
      setError("Email and password are required.")
      return
    }

    setPending(true)
    const result = await signInWithEmailClient(email, password)
    if (result.error) {
      setError(result.error)
      setPending(false)
      return
    }

    await refresh()
    router.refresh()
    router.push(redirectTo.startsWith("/") ? redirectTo : "/dashboard")
  }

  const signUpHref =
    redirectTo !== "/dashboard"
      ? `/sign-up?redirect=${encodeURIComponent(redirectTo)}`
      : "/sign-up"

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="flex flex-col gap-5"
    >
      {info && (
        <p className="rounded-xl border border-primary/25 bg-primary/10 px-3.5 py-2.5 text-sm text-primary">
          {info}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          placeholder="you@example.com"
          className="h-11"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          required={isConfigured}
          autoComplete="current-password"
          placeholder="••••••••"
          className="h-11"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      {error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2Icon className="animate-spin" data-icon="inline-start" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        No account?{" "}
        <Link href={signUpHref} className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  )
}
