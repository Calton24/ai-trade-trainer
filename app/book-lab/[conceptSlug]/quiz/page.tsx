import { redirect } from "next/navigation"

import { findConceptHrefBySlug } from "@/content/library"

interface LegacyQuizPageProps {
  params: Promise<{ conceptSlug: string }>
}

export default async function LegacyBookLabQuizPage({
  params,
}: LegacyQuizPageProps) {
  const { conceptSlug } = await params
  const href = findConceptHrefBySlug(conceptSlug)
  redirect(href ? `${href}/quiz` : "/library")
}
