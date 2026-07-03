import type { Metadata } from "next"

import { Hero } from "@/components/landing/hero"
import { InteractiveLearningPath } from "@/components/landing/learning-path"
import {
  BooksIncluded,
  CompetencySystem,
  EverythingIncluded,
  FinalCtaSection,
  PracticePreview,
  PricingTeaser,
  StudyPlans,
  SuccessRoadmap,
  WhyTradersFail,
} from "@/components/landing/marketing"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"

export const metadata: Metadata = {
  title: "TradeTrainer Academy — Become a Competent Trader",
  description:
    "A structured trading programme: interactive lessons, chart labs, a market simulator, competency scoring, and live-trading readiness.",
}

export default function LandingPage() {
  return (
    <div className="min-h-svh overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <WhyTradersFail />
        <EverythingIncluded />
        <InteractiveLearningPath />
        <BooksIncluded />
        <PracticePreview />
        <CompetencySystem />
        <StudyPlans />
        <SuccessRoadmap />
        <PricingTeaser />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  )
}
