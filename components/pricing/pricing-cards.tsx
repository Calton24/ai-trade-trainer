import { CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { pricingTiers } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface PricingCardsProps {
  compact?: boolean
}

export function PricingCards({ compact = false }: PricingCardsProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        compact ? "sm:grid-cols-3" : "md:grid-cols-3"
      )}
    >
      {pricingTiers.map((tier) => (
        <Card
          key={tier.id}
          className={cn(
            "relative flex flex-col border-border/60 bg-card/50",
            tier.highlighted &&
              "border-primary/30 ring-1 ring-primary/20 shadow-lg shadow-primary/5"
          )}
        >
          {tier.highlighted && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                Most Popular
              </span>
            </div>
          )}
          <CardHeader>
            <CardTitle>{tier.name}</CardTitle>
            <CardDescription>{tier.description}</CardDescription>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-semibold tracking-tight">
                {tier.price}
              </span>
              {tier.period && (
                <span className="text-sm text-muted-foreground">
                  {tier.period}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1">
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
            {/* Wire to /api/checkout with Stripe when STRIPE_SECRET_KEY is set */}
            <Button
              className="w-full"
              variant={tier.highlighted ? "default" : "outline"}
            >
              {tier.cta}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
