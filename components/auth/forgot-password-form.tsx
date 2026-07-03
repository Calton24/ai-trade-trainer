"use client"

import Link from "next/link"
import { useActionState } from "react"
import { Loader2Icon } from "lucide-react"

import { forgotPassword, type AuthActionResult } from "@/lib/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: AuthActionResult = {}

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: AuthActionResult, formData: FormData) =>
      forgotPassword(formData),
    initialState
  )

  return (
    <form action={formAction} className="flex flex-col gap-5">
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
        />
      </div>
      {state.error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-xl border border-primary/25 bg-primary/10 px-3.5 py-2.5 text-sm text-primary">
          {state.success}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2Icon className="animate-spin" data-icon="inline-start" />
            Sending…
          </>
        ) : (
          "Send reset link"
        )}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/sign-in" className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  )
}
