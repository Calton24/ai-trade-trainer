import type { Metadata } from "next"

import { JournalContent } from "@/components/journal/journal-content"

export const metadata: Metadata = {
  title: "Journal — TradeTrainer AI",
}

export default function JournalPage() {
  return <JournalContent />
}
