import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { BookLabMiniQuiz } from "@/components/book-lab/mini-quiz"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import {
  LIBRARY_DISCLAIMER,
  getAllBooks,
  getConceptHref,
  getLibraryConcept,
} from "@/content/library"

interface QuizPageProps {
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
}: QuizPageProps): Promise<Metadata> {
  const { bookSlug, conceptSlug } = await params
  const result = getLibraryConcept(bookSlug, conceptSlug)
  if (!result) return { title: "Quiz Not Found" }
  return { title: `${result.concept.title} Quiz — ${result.book.title}` }
}

export default async function LibraryQuizPage({ params }: QuizPageProps) {
  const { bookSlug, conceptSlug } = await params
  const result = getLibraryConcept(bookSlug, conceptSlug)
  if (!result) notFound()
  const { book, concept } = result

  return (
    <AppShell>
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
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
          <p className="text-sm text-primary">{book.title} Quiz</p>
          <h1 className="text-2xl font-semibold">{concept.title}</h1>
        </div>
        <BookLabMiniQuiz concept={concept} />
        <p className="text-[11px] text-muted-foreground/70">
          {LIBRARY_DISCLAIMER}
        </p>
      </div>
    </AppShell>
  )
}
