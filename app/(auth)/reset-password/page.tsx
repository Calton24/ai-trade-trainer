import type { Metadata } from "next"

import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password",
}

export default function ResetPasswordPage() {
  return (
    <>
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-2xl font-semibold tracking-tight">
          Set a new password
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Choose a strong password with at least 8 characters.
        </p>
      </div>
      <ResetPasswordForm />
    </>
  )
}
