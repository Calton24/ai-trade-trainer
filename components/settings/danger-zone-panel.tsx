"use client"

import { useRouter } from "next/navigation"

import { useUserState } from "@/components/providers/user-state-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TypedConfirmDialog } from "@/components/settings/typed-confirm-dialog"
import { Button } from "@/components/ui/button"
import { useUserSettings } from "@/lib/settings/use-user-settings"

export function DangerZonePanel() {
  const { resetSectionProgress } = useUserState()
  const { logReset, deleteAccount } = useUserSettings()
  const router = useRouter()

  return (
    <div className="space-y-6">
      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-base text-destructive">
            Reset all learning progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Clears XP, streaks, quizzes, flashcards, drills, simulator sessions,
            assessments, achievements, and journal entries. Your account remains
            active.
          </p>
          <TypedConfirmDialog
            title="Reset all progress?"
            description="This permanently deletes all learning data on this device. Type RESET to confirm."
            confirmWord="RESET"
            confirmLabel="Reset everything"
            destructive
            onConfirm={async () => {
              resetSectionProgress("all")
              await logReset("all")
            }}
            trigger={<Button variant="destructive">Reset all progress</Button>}
          />
        </CardContent>
      </Card>

      <Card className="border-destructive/40 bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Delete account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Requests account deletion and signs you out. Learning data will be
            removed or anonymised according to platform policy.
          </p>
          <TypedConfirmDialog
            title="Delete your account?"
            description="This cannot be undone. Type DELETE to confirm account deletion."
            confirmWord="DELETE"
            confirmLabel="Delete account"
            destructive
            onConfirm={async () => {
              resetSectionProgress("all")
              const ok = await deleteAccount()
              if (ok) router.replace("/sign-in")
            }}
            trigger={<Button variant="destructive">Delete account</Button>}
          />
        </CardContent>
      </Card>
    </div>
  )
}
