import type { Metadata } from "next"
import { Suspense } from "react"

import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create your TradeTrainer Academy account and start your trading education journey.",
}

export default function SignUpPage() {
  return (
    <>
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Start free — save progress, build streaks, and follow your learning
          path.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="h-56 animate-pulse rounded-xl bg-muted/40" />
        }
      >
        <SignUpForm />
      </Suspense>
    </>
  )
}
