"use client"

import Link from "next/link"
import { CheckIcon, MinusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserSettings } from "@/lib/settings/use-user-settings"
import {
  OAUTH_PROVIDER_CONFIG,
  authProviders,
  normalizeProviderKey,
} from "@/lib/auth/providers"

const AUTH_METHODS = [
  { key: "email" as const, label: "Email" },
  ...authProviders.map((id) => ({
    key: id,
    label: OAUTH_PROVIDER_CONFIG[id].shortLabel,
  })),
]

export function AccountSettingsPanel() {
  const { profile, user, authMode, signOutClient, loading } = useUserSettings()

  if (loading) {
    return <Skeleton className="h-48 w-full rounded-xl" />
  }

  const email = profile?.email ?? user?.email ?? "—"
  const created = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : "—"

  const connectedProviders = new Set<string>()
  if (user?.email) connectedProviders.add("email")
  user?.identities?.forEach((identity) => {
    const key = normalizeProviderKey(identity.provider)
    if (key) connectedProviders.add(key)
  })
  if (authMode === "local") connectedProviders.add("email")

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Account details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-border/40 pb-3">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{email}</span>
          </div>
          <div className="flex justify-between gap-4 border-b border-border/40 pb-3">
            <span className="text-muted-foreground">Member since</span>
            <span>{created}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Connected sign-in methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {AUTH_METHODS.map((method) => {
            const connected =
              method.key === "email"
                ? connectedProviders.has("email")
                : connectedProviders.has(method.key)
            return (
              <div
                key={method.key}
                className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2.5 text-sm"
              >
                <span>{method.label}</span>
                {connected ? (
                  <span className="flex items-center gap-1 text-primary">
                    <CheckIcon className="size-4" />
                    Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MinusIcon className="size-4" />
                    Not connected
                  </span>
                )}
              </div>
            )
          })}
          <p className="pt-2 text-xs text-muted-foreground">
            Link additional providers from the sign-in page. Enterprise SSO is
            not available yet.
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Security</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {authMode === "supabase" && (
            <Button variant="outline" render={<Link href="/forgot-password" />}>
              Change password
            </Button>
          )}
          {authMode === "local" && (
            <p className="text-sm text-muted-foreground">
              Password changes are available when cloud authentication is
              configured.
            </p>
          )}
        </CardContent>
      </Card>

      <Button variant="outline" onClick={() => void signOutClient()}>
        Log out
      </Button>
    </div>
  )
}
