import type { Metadata } from "next"

import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { onboardingGlass } from "@/components/onboarding/onboarding-styles"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"

export const metadata: Metadata = {
  title: "Welcome — TradeTrainer AI",
  description: "Set up your trader profile and learning plan.",
}

export default function OnboardingPage() {
  return (
    <OnboardingShell>
      <div className={onboardingGlass.heroCard}>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome to TradeTrainer AI
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tell us about yourself so we can personalise your learning path.
        </p>
      </div>
      <div className="mt-6">
        <OnboardingWizard />
      </div>
    </OnboardingShell>
  )
}
