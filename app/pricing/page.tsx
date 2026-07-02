import type { Metadata } from "next"

import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { PricingCards } from "@/components/pricing/pricing-cards"
import { FREE_PLAN_FEATURES } from "@/lib/pricing/plans"
import { CheckIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing — TradeTrainer AI",
}

export default function PricingPage() {
  return (
    <div className="min-h-svh bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Choose the pace that matches your learning commitment
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Weekly for trying the platform,{" "}
            <span className="font-medium text-primary">
              6-month for building competency
            </span>
            ,{" "}
            <span className="font-medium text-primary">
              annual for long-term mastery
            </span>
            . All paid plans unlock the same Pro features.
          </p>
        </div>

        <div className="mt-14">
          <PricingCards />
        </div>

        <div className="mx-auto mt-16 max-w-lg">
          <h2 className="text-center text-lg font-semibold">Free plan</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {FREE_PLAN_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CheckIcon className="size-4 shrink-0 text-muted-foreground" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <p className="mx-auto mt-12 max-w-xl text-center text-xs text-muted-foreground">
          TradeTrainer AI is for education and simulation only. It does not
          provide financial advice or trading signals. Past simulated performance
          does not guarantee future results.
        </p>
      </main>
      <Footer />
    </div>
  )
}
