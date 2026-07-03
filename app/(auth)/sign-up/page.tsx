import type { Metadata } from "next"
import { Suspense } from "react"

import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your TradeTrainer Academy account and start your trading education journey.",
}

export default function SignUpPage() {
  return (
    <>
      <h1 className="text-xl font-semibold">Start your trading education</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Create your account to save progress, build streaks, and unlock your
        learning roadmap.
      </p>
      <Suspense fallback={null}>
        <SignUpForm />
      </Suspense>
    </>
  )
}
