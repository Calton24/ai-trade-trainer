import type { Metadata } from "next"

import { ReadinessAssessmentWorkspace } from "@/components/trader-readiness/readiness-assessment-workspace"

export const metadata: Metadata = {
  title: "Trader Readiness Assessment",
  description: "Complete the multi-pillar Trader Readiness diagnostic assessment.",
}

export default function TraderReadinessAssessmentPage() {
  return <ReadinessAssessmentWorkspace />
}
