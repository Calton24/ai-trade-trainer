import { redirect } from "next/navigation"

import { findConceptHrefBySlug } from "@/content/library"

interface LegacyConceptPageProps {
  params: Promise<{ conceptSlug: string }>
}

export default async function LegacyBookLabConceptPage({
  params,
}: LegacyConceptPageProps) {
  const { conceptSlug } = await params
  redirect(findConceptHrefBySlug(conceptSlug) ?? "/library")
}
