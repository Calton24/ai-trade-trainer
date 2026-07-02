import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { PricingCards } from "@/components/pricing/pricing-cards"
import { Button } from "@/components/ui/button"

export function PricingCta() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Pricing</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Choose the pace that matches your learning commitment
          </h2>
          <p className="mt-4 text-muted-foreground">
            Weekly to try the platform, 6-month to build competency, annual to
            master over time. No lifetime plans — your subscription grows with
            the product.
          </p>
        </div>

        <div className="mt-12">
          <PricingCards compact />
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" render={<Link href="/pricing" />}>
            View full pricing
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </section>
  )
}
