import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PathDetailContent } from "@/components/paths/path-detail-content"
import { getAllPaths, getPathBySlug } from "@/content/registry"

interface PathDetailPageProps {
  params: Promise<{ pathSlug: string }>
}

export async function generateStaticParams() {
  return getAllPaths().map((path) => ({ pathSlug: path.slug }))
}

export async function generateMetadata({
  params,
}: PathDetailPageProps): Promise<Metadata> {
  const { pathSlug } = await params
  const path = getPathBySlug(pathSlug)
  if (!path) return { title: "Path Not Found" }
  return {
    title: `${path.title} — TradeTrainer AI`,
    description: path.description,
  }
}

export default async function PathDetailPage({ params }: PathDetailPageProps) {
  const { pathSlug } = await params
  const path = getPathBySlug(pathSlug)
  if (!path) notFound()

  return <PathDetailContent path={path} />
}
