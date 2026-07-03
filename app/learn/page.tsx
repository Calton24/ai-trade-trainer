import type { Metadata } from "next"

import { LearnContent } from "@/components/learn/learn-content"
import { getAllLessons } from "@/content/registry"

export const metadata: Metadata = {
  title: "Learn — TradeTrainer Academy",
}

export default function LearnPage() {
  const lessons = getAllLessons().filter(
    (l) => l.lessonType === "reading" || l.lessonType === "interactive"
  )
  return <LearnContent allLessons={lessons} />
}
