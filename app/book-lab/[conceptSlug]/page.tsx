import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ConceptDetailContent } from "@/components/book-lab/concept-detail-content"
import {
  getAllBookLabConcepts,
  getBookLabConcept,
} from "@/content/book-lab"

interface ConceptPageProps {
  params: Promise<{ conceptSlug: string }>
}

export async function generateStaticParams() {
  return getAllBookLabConcepts().map((c) => ({ conceptSlug: c.slug }))
}

export async function generateMetadata({
  params,
}: ConceptPageProps): Promise<Metadata> {
  const { conceptSlug } = await params
  const concept = getBookLabConcept(conceptSlug)
  if (!concept) return { title: "Concept Not Found" }
  return {
    title: `${concept.title} — Book Lab`,
    description: concept.summary,
  }
}

export default async function BookLabConceptPage({ params }: ConceptPageProps) {
  const { conceptSlug } = await params
  const concept = getBookLabConcept(conceptSlug)
  if (!concept) notFound()

  return <ConceptDetailContent concept={concept} />
}
