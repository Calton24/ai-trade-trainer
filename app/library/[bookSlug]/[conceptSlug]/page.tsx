import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ConceptDetailContent } from "@/components/book-lab/concept-detail-content"
import { getAllBooks, getLibraryConcept } from "@/content/library"

interface ConceptPageProps {
  params: Promise<{ bookSlug: string; conceptSlug: string }>
}

export async function generateStaticParams() {
  return getAllBooks().flatMap((book) =>
    book.sections.flatMap((section) =>
      section.concepts.map((concept) => ({
        bookSlug: book.slug,
        conceptSlug: concept.slug,
      }))
    )
  )
}

export async function generateMetadata({
  params,
}: ConceptPageProps): Promise<Metadata> {
  const { bookSlug, conceptSlug } = await params
  const result = getLibraryConcept(bookSlug, conceptSlug)
  if (!result) return { title: "Lesson Not Found" }
  return {
    title: `${result.concept.title} — ${result.book.title}`,
    description: result.concept.summary,
  }
}

export default async function LibraryConceptPage({ params }: ConceptPageProps) {
  const { bookSlug, conceptSlug } = await params
  const result = getLibraryConcept(bookSlug, conceptSlug)
  if (!result) notFound()

  return <ConceptDetailContent concept={result.concept} />
}
