import { redirect } from "next/navigation"

import { findConceptHrefBySlug } from "@/content/library"

interface LegacyPracticePageProps {
  params: Promise<{ conceptSlug: string }>
}

export default async function LegacyBookLabPracticePage({
  params,
}: LegacyPracticePageProps) {
  const { conceptSlug } = await params
  const href = findConceptHrefBySlug(conceptSlug)
  redirect(href ? `${href}/practice` : "/library")
}
