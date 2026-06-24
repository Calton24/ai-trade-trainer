import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { BookLabPractice } from "@/components/book-lab/concept-practice"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import {
  BOOK_LAB_DISCLAIMER,
  getAllBookLabConcepts,
  getBookLabConcept,
} from "@/content/book-lab"

interface PracticePageProps {
  params: Promise<{ conceptSlug: string }>
}

export async function generateStaticParams() {
  return getAllBookLabConcepts().map((c) => ({ conceptSlug: c.slug }))
}

export async function generateMetadata({
  params,
}: PracticePageProps): Promise<Metadata> {
  const { conceptSlug } = await params
  const concept = getBookLabConcept(conceptSlug)
  if (!concept) return { title: "Practice Not Found" }
  return { title: `${concept.title} Practice — Book Lab` }
}

export default async function BookLabPracticePage({
  params,
}: PracticePageProps) {
  const { conceptSlug } = await params
  const concept = getBookLabConcept(conceptSlug)
  if (!concept) notFound()

  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
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
          <p className="text-sm text-primary">Book Lab Practice</p>
          <h1 className="text-2xl font-semibold">{concept.title}</h1>
          <p className="mt-1 text-muted-foreground">{concept.summary}</p>
        </div>
        <BookLabPractice concept={concept} />
        <p className="text-[11px] text-muted-foreground/70">{BOOK_LAB_DISCLAIMER}</p>
      </div>
    </AppShell>
  )
}
