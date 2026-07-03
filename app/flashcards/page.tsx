import type { Metadata } from "next"

import { FlashcardsContent } from "@/components/flashcards/flashcards-content"

export const metadata: Metadata = {
  title: "Flashcards — TradeTrainer Academy",
  description:
    "Review trading concepts in quick 10-card practice rounds with spaced repetition.",
}

export default function FlashcardsPage() {
  return <FlashcardsContent />
}
