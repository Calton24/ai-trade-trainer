import type { Metadata } from "next"
import { Suspense } from "react"

import { FlashcardSession } from "@/components/flashcards/flashcard-session"

export const metadata: Metadata = {
  title: "Flashcard Session — TradeTrainer AI",
  description: "Game of 10 flashcard review session.",
}

export default function FlashcardSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
          Loading session…
        </div>
      }
    >
      <FlashcardSession />
    </Suspense>
  )
}
