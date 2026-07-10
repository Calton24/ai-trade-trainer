import type { Metadata } from "next"

import { PracticeHubContent } from "@/components/practice/practice-hub-content"

export const metadata: Metadata = {
  title: "Practice | Trade Trainer",
  description:
    "Deliberate chart-reading practice — Structure Replay, Trend Detective, risk drills, and more.",
}

export default function PracticePage() {
  return <PracticeHubContent />
}
