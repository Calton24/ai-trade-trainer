"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"
import {
  OAUTH_PROVIDERS_LIST,
  type OAuthProviderId,
} from "@/lib/auth/providers"
import { signInWithOAuth } from "@/lib/auth/oauth"

interface OAuthButtonsProps {
  redirectTo?: string
}

export function OAuthButtons({ redirectTo = "/dashboard" }: OAuthButtonsProps) {
  const { isConfigured } = useAuth()
  const [pending, setPending] = useState<OAuthProviderId | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!isConfigured) return null

  async function handleOAuth(provider: OAuthProviderId) {
    setError(null)
    setPending(provider)
    const result = await signInWithOAuth(provider, redirectTo)
    if (result.error) {
      setError(result.error)
      setPending(null)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {OAUTH_PROVIDERS_LIST.map((provider) => (
        <Button
          key={provider.id}
          type="button"
          variant="outline"
          className="w-full justify-center"
          disabled={pending !== null}
          onClick={() => void handleOAuth(provider.id)}
        >
          {pending === provider.id ? "Redirecting…" : provider.label}
        </Button>
      ))}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export function AuthDivider() {
  return (
    <div className="relative my-2">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border/60" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          Or continue with email
        </span>
      </div>
    </div>
  )
}
