"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { LogOutIcon } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
import { clearOnboardingDraft } from "@/lib/onboarding/draft-storage"
import { Button } from "@/components/ui/button"

export function OnboardingLogoutButton() {
  const { user, signOutClient } = useAuth()
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handleLogout() {
    setPending(true)
    if (user?.id) clearOnboardingDraft(user.id)
    await signOutClient()
    router.replace("/sign-in")
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="text-muted-foreground"
      disabled={pending}
      onClick={() => void handleLogout()}
    >
      <LogOutIcon data-icon="inline-start" />
      {pending ? "Logging out…" : "Log out"}
    </Button>
  )
}
