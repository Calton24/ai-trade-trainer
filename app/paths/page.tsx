import type { Metadata } from "next"

import { PathsContent } from "@/components/paths/paths-content"

export const metadata: Metadata = {
  title: "Learning Paths — TradeTrainer AI",
}

export default function PathsPage() {
  return <PathsContent />
}
