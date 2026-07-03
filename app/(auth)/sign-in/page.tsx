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
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Sign in with your email to continue learning.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="h-48 animate-pulse rounded-xl bg-muted/40" />
        }
      >
        <SignInForm />
      </Suspense>
    </>
  )
}
