"use client"

import { Suspense } from "react"

import { TrainingContent } from "@/components/training/training-content"

export default function TrainingPage() {
  return (
    <Suspense fallback={null}>
      <TrainingContent />
    </Suspense>
  )
}
