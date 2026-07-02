import type { Metadata } from "next"

import { ProgressionContent } from "@/components/progression/progression-content"

export const metadata: Metadata = {
  title: "Progression",
  description:
    "Your Trader Rank, XP, hidden Competency Score, challenges, and achievements.",
}

export default function ProgressionPage() {
  return <ProgressionContent />
}
