import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { BookLabMiniQuiz } from "@/components/book-lab/mini-quiz"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import {
  BOOK_LAB_DISCLAIMER,
  getAllBookLabConcepts,
  getBookLabConcept,
} from "@/content/book-lab"

interface QuizPageProps {
  params: Promise<{ conceptSlug: string }>
}

export async function generateStaticParams() {
  return getAllBookLabConcepts().map((c) => ({ conceptSlug: c.slug }))
}

export async function generateMetadata({
  params,
}: QuizPageProps): Promise<Metadata> {
  const { conceptSlug } = await params
  const concept = getBookLabConcept(conceptSlug)
  if (!concept) return { title: "Quiz Not Found" }
  return { title: `${concept.title} Quiz — Book Lab` }
}

export default async function BookLabQuizPage({ params }: QuizPageProps) {
  const { conceptSlug } = await params
  const concept = getBookLabConcept(conceptSlug)
  if (!concept) notFound()

  return (
    <AppShell>
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          render={<Link href={`/book-lab/${concept.slug}`} />}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          Back to concept
        </Button>
        <div>
          <p className="text-sm text-primary">Book Lab Quiz</p>
          <h1 className="text-2xl font-semibold">{concept.title}</h1>
        </div>
        <BookLabMiniQuiz concept={concept} />
        <p className="text-[11px] text-muted-foreground/70">{BOOK_LAB_DISCLAIMER}</p>
      </div>
    </AppShell>
  )
}
