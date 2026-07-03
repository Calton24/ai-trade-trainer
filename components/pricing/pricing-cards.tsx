import { CheckIcon } from "lucide-react"

import { PricingCheckoutButton } from "@/components/pricing/pricing-checkout-button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { pricingTiers } from "@/lib/pricing/plans"
import { cn } from "@/lib/utils"

interface PricingCardsProps {
  compact?: boolean
}

const BADGE_LABELS = {
  "most-popular": "Most Popular",
  "best-value": "Best Value",
} as const

export function PricingCards({ compact = false }: PricingCardsProps) {
  return (
    <div
      className={cn(
        "grid gap-4 pt-3",
        compact ? "sm:grid-cols-3" : "md:grid-cols-3"
      )}
    >
      {pricingTiers.map((tier) => {
        const badge = tier.badge ?? (tier.highlighted ? "most-popular" : undefined)

        return (
          <Card
            key={tier.id}
            className={cn(
              "relative flex flex-col overflow-visible border-border/60 bg-card/50",
              badge &&
                "z-[1] border-primary/30 pt-4 ring-1 ring-primary/20 shadow-lg shadow-primary/5"
            )}
          >
            {badge && (
              <div className="pointer-events-none absolute -top-3 left-1/2 z-20 -translate-x-1/2">
                <span className="pointer-events-auto rounded-full border border-primary/50 bg-card px-3 py-1 text-xs font-semibold tracking-wide text-primary shadow-md ring-1 ring-background">
                  {BADGE_LABELS[badge]}
                </span>
              </div>
            )}
            <CardHeader className="shrink-0 gap-2">
              <CardTitle>{tier.name}</CardTitle>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <p>{tier.description}</p>
                {tier.studyAlignment && (
                  <p className="text-sm font-semibold text-primary">
                    {tier.studyAlignment}
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-3xl font-semibold tracking-tight text-foreground">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-sm text-muted-foreground">
                    {tier.period}
                  </span>
                )}
              </div>
              <ul className="flex flex-col gap-2.5">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckIcon className="mt-0.5 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <PricingCheckoutButton
                tier={tier}
                variant={badge ? "default" : "outline"}
              />
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
