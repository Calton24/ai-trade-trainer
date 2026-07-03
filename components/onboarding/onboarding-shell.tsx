import { onboardingGlass } from "@/components/onboarding/onboarding-styles"
import { OnboardingShellHeader } from "@/components/onboarding/onboarding-header-menu"

export function OnboardingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={onboardingGlass.shell}>
      <OnboardingShellHeader />

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>
    </div>
  )
}
