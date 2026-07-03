"use client"

import { useActionState } from "react"
import { Loader2Icon } from "lucide-react"

import { resetPassword, type AuthActionResult } from "@/lib/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: AuthActionResult = {}

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: AuthActionResult, formData: FormData) =>
      resetPassword(formData),
    initialState
  )

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          autoFocus
          placeholder="At least 8 characters"
          className="h-11"
        />
      </div>
      {state.error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
          {state.error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2Icon className="animate-spin" data-icon="inline-start" />
            Updating…
          </>
        ) : (
          "Update password"
        )}
      </Button>
    </form>
  )
}
