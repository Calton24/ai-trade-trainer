import type { Metadata } from "next"

import { LibraryContent } from "@/components/library/library-content"

export const metadata: Metadata = {
  title: "Trading Library — TradeTrainer AI",
  description:
    "Build your trading knowledge from the world's best books — interactive lessons, quizzes, practice, and XP.",
}

export default function LibraryPage() {
  return <LibraryContent />
}
