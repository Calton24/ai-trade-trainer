import type { Metadata } from "next"
import { Suspense } from "react"

import { PrivateBetaNotice } from "@/components/marketing/private-beta-notice"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { PricingCards } from "@/components/pricing/pricing-cards"
import { PricingUpgradeBanner } from "@/components/pricing/pricing-upgrade-banner"
import { isPrivateBetaEnabled } from "@/lib/config/private-beta"
import { FREE_PLAN_FEATURES } from "@/lib/pricing/plans"
import { CheckIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing — TradeTrainer Academy",
}

export default function PricingPage() {
  const privateBeta = isPrivateBetaEnabled()

  return (
    <div className="min-h-svh bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        {privateBeta ? (
          <div className="mx-auto max-w-2xl space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Private beta
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Paid plans are not open yet. Sign up free — invited testers get
                Pro access enabled by our team.
              </p>
            </div>
            <PrivateBetaNotice />
          </div>
        ) : (
          <>
            <Suspense fallback={null}>
              <PricingUpgradeBanner />
            </Suspense>
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
              <Suspense fallback={null}>
                <PricingCards />
              </Suspense>
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
          </>
        )}

        <p className="mx-auto mt-12 max-w-xl text-center text-xs text-muted-foreground">
          TradeTrainer Academy is for education and simulation only. It does not
          provide financial advice or trading signals. Past simulated performance
          does not guarantee future results.
        </p>
      </main>
      <Footer />
    </div>
  )
}
