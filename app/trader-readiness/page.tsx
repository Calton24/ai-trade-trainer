import type { Metadata } from "next"

import { TraderReadinessContent } from "@/components/trader-readiness/trader-readiness-content"

export const metadata: Metadata = {
  title: "Trader Readiness",
  description:
    "Diagnostic assessment to identify your trading strengths, weaknesses, and personalised learning roadmap.",
}

export default function TraderReadinessPage() {
  return <TraderReadinessContent />
}
