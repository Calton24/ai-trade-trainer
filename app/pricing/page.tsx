import type { Metadata } from "next"

import { AppShell } from "@/components/layout/app-shell"
import { PricingCards } from "@/components/pricing/pricing-cards"

export const metadata: Metadata = {
  title: "Pricing — TradeTrainer AI",
}

export default function PricingPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-2 text-muted-foreground">
            Invest in your education, not promises of returns. Stripe checkout
            ready — configure your keys in{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              .env.local
            </code>
            .
          </p>
        </div>

        <PricingCards />

        <p className="mx-auto max-w-xl text-center text-xs text-muted-foreground">
          TradeTrainer AI is for education and simulation only. It does not
          provide financial advice or trading signals. Past simulated
          performance does not guarantee future results.
        </p>
      </div>
    </AppShell>
  )
}
