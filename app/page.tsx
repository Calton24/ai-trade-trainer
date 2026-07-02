import type { Metadata } from "next"

import { Hero } from "@/components/landing/hero"
import {
  BooksIncluded,
  CompetencySystem,
  EverythingIncluded,
  FinalCtaSection,
  LearningJourney,
  PracticePreview,
  PricingTeaser,
  StudyPlans,
  SuccessRoadmap,
  WhyTradersFail,
} from "@/components/landing/marketing"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"

export const metadata: Metadata = {
  title: "TradeTrainer AI — Become a Competent Trader",
  description:
    "A structured, university-style trading programme: lessons, a book library, chart labs, a market simulator, competency scoring, and live-trading readiness.",
}

export default function LandingPage() {
  return (
    <div className="min-h-svh bg-background">
      <Header />
      <main>
        <Hero />
        <WhyTradersFail />
        <EverythingIncluded />
        <LearningJourney />
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
