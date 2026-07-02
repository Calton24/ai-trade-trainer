import type { Metadata } from "next"

import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password",
}

export default function ResetPasswordPage() {
  return (
    <>
      <h1 className="text-xl font-semibold">Set a new password</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Choose a strong password with at least 8 characters.
      </p>
      <ResetPasswordForm />
    </>
  )
}
