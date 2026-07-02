"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { AuthDivider, OAuthButtons } from "@/components/auth/oauth-buttons"
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
    if (queryError) {
      setError(decodeURIComponent(queryError))
    }
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

  return (
    <div className="flex flex-col gap-4">
      <OAuthButtons redirectTo={redirectTo} />
      {isConfigured && <AuthDivider />}

      <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required={isConfigured}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {info && (
          <p className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-primary">
            {info}
          </p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Signing in..." : "Sign in"}
        </Button>
        <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
          <Link href="/forgot-password" className="hover:text-foreground">
            Forgot password?
          </Link>
          <p>
            No account?{" "}
            <Link
              href={`/sign-up${redirectTo !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
              className="text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
