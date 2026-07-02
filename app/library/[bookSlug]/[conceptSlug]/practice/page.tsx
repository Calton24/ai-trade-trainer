import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { BookLabPractice } from "@/components/book-lab/concept-practice"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import {
  LIBRARY_DISCLAIMER,
  getAllBooks,
  getConceptHref,
  getLibraryConcept,
} from "@/content/library"

interface PracticePageProps {
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
}: PracticePageProps): Promise<Metadata> {
  const { bookSlug, conceptSlug } = await params
  const result = getLibraryConcept(bookSlug, conceptSlug)
  if (!result) return { title: "Practice Not Found" }
  return { title: `${result.concept.title} Practice — ${result.book.title}` }
}

export default async function LibraryPracticePage({
  params,
}: PracticePageProps) {
  const { bookSlug, conceptSlug } = await params
  const result = getLibraryConcept(bookSlug, conceptSlug)
  if (!result) notFound()
  const { book, concept } = result

  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          render={<Link href={getConceptHref(concept)} />}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          Back to lesson
        </Button>
        <div>
          <p className="text-sm text-primary">{book.title} Practice</p>
          <h1 className="text-2xl font-semibold">{concept.title}</h1>
          <p className="mt-1 text-muted-foreground">{concept.summary}</p>
        </div>
        <BookLabPractice concept={concept} />
        <p className="text-[11px] text-muted-foreground/70">
          {LIBRARY_DISCLAIMER}
        </p>
      </div>
    </AppShell>
  )
}
