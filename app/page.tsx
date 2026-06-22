import type { Metadata } from "next"

import { AiFeedbackPreview } from "@/components/landing/ai-feedback-preview"
import { BeginnerPathPreview } from "@/components/landing/beginner-path-preview"
import { CommunityPreview } from "@/components/landing/community-preview"
import { FinalCta } from "@/components/landing/final-cta"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { PricingCta } from "@/components/landing/pricing-cta"
import { Problem } from "@/components/landing/problem"
import { ProgressPreview } from "@/components/landing/progress-preview"
import { TrainingPreview } from "@/components/landing/training-preview"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"

export const metadata: Metadata = {
  title: "TradeTrainer AI — Learn Trading Step by Step",
  description:
    "Learn trading by doing interactive chart drills. Guided lessons, quizzes, AI feedback, and progress tracking for beginners.",
}

export default function LandingPage() {
  return (
    <div className="min-h-svh bg-background">
      <Header />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <BeginnerPathPreview />
        <TrainingPreview />
        <AiFeedbackPreview />
        <ProgressPreview />
        <CommunityPreview />
        <PricingCta />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
