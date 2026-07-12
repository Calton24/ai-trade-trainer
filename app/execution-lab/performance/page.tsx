import type { Metadata } from "next"

import { LearnerPerformanceContent } from "@/components/execution-analytics/learner-performance-content"

export const metadata: Metadata = {
  title: "Execution Performance | Trade Trainer",
  description: "Your Execution Lab analytics — process quality, patience, and calibration.",
}

export default function ExecutionPerformancePage() {
  return <LearnerPerformanceContent />
}
