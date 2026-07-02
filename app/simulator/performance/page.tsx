import type { Metadata } from "next"

import { SimulatorPerformanceContent } from "@/components/simulator/simulator-performance-content"

export const metadata: Metadata = {
  title: "Simulator Performance",
  description: "Win rate, risk discipline, and setup analytics from simulator sessions.",
}

export default function SimulatorPerformancePage() {
  return <SimulatorPerformanceContent />
}
