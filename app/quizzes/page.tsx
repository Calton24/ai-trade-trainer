import type { Metadata } from "next"

import { QuizzesContent } from "@/components/quiz/quizzes-content"

export const metadata: Metadata = {
  title: "Quizzes — TradeTrainer Academy",
}

export default function QuizzesPage() {
  return <QuizzesContent />
}
