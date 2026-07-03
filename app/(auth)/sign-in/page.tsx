import type { Metadata } from "next"
import { Suspense } from "react"

import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to TradeTrainer Academy to save your learning progress.",
}

export default function SignInPage() {
  return (
    <>
      <h1 className="text-xl font-semibold">Welcome back</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Sign in to sync your progress across devices.
      </p>
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </>
  )
}
