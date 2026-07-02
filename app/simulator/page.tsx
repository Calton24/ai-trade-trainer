import type { Metadata } from "next"

import { SimulatorContent } from "@/components/simulator/simulator-content"

export const metadata: Metadata = {
  title: "Trading Simulator",
  description:
    "Prove trading competence with chart replay, trade decisions, and journaling.",
}

export default function SimulatorPage() {
  return <SimulatorContent />
}
