import type { Metadata } from "next"

import { ExecutionLabContent } from "@/components/execution-lab/execution-lab-content"

export const metadata: Metadata = {
  title: "Execution Lab | Trade Trainer",
  description:
    "Simulate real trades — drag entry, stop, and target, size positions, and get execution coaching.",
}

export default function ExecutionLabPage() {
  return <ExecutionLabContent />
}
