import type { Metadata } from "next"

import { ProgressContent } from "@/components/progress/progress-content"

export const metadata: Metadata = {
  title: "Progress — TradeTrainer AI",
}

export default function ProgressPage() {
  return <ProgressContent />
}
