import type { Metadata } from "next"

import { BookLabContent } from "@/components/book-lab/book-lab-content"

export const metadata: Metadata = {
  title: "Book Lab — TradeTrainer AI",
  description:
    "Interactive day-trading concept companion with charts, quizzes, and practice drills.",
}

export default function BookLabPage() {
  return <BookLabContent />
}
