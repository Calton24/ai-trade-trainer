import type { Metadata } from "next"

import { LiveTransitionContent } from "@/components/progression/live-transition-content"

export const metadata: Metadata = {
  title: "Live Trading Progression",
  description:
    "Behavioural competence gates from education through simulated trading to live readiness.",
}

export default function LiveTransitionPage() {
  return <LiveTransitionContent />
}
