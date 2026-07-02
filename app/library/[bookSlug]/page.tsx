import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BookDetailContent } from "@/components/library/book-detail-content"
import { getAllBooks, getBook } from "@/content/library"

interface BookPageProps {
  params: Promise<{ bookSlug: string }>
}

export async function generateStaticParams() {
  return getAllBooks().map((b) => ({ bookSlug: b.slug }))
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { bookSlug } = await params
  const book = getBook(bookSlug)
  if (!book) return { title: "Book Not Found" }
  return {
    title: `${book.title} — Trading Library`,
    description: book.description,
  }
}

export default async function LibraryBookPage({ params }: BookPageProps) {
  const { bookSlug } = await params
  const book = getBook(bookSlug)
  if (!book) notFound()

  return <BookDetailContent book={book} />
}
