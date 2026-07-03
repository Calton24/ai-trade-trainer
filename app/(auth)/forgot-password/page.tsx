import type { Metadata } from "next"

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot Password",
}

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset your password
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>
      <ForgotPasswordForm />
    </>
  )
}
