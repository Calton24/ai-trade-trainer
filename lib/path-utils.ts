import Link from "next/link"
import { getSyllabusByPathId } from "@/lib/mock/learning-paths"
import type { SyllabusItem } from "@/lib/types"

export function getSyllabusItemHref(item: SyllabusItem): string {
  if (item.locked) return "#"
  switch (item.type) {
    case "lesson":
      return item.linkedId ? `/learn/${item.linkedId}` : "/learn"
    case "quiz":
      return item.linkedId ? `/quiz/${item.linkedId}` : "/quizzes"
    case "drill":
    case "exercise":
      return "/training"
    case "reflection":
      return "/journal"
    default:
      return "/learn"
  }
}

export function getNextSyllabusHref(
  pathId: string,
  completedIds: string[] = []
): string {
  const syllabus = getSyllabusByPathId(pathId)
  const next = syllabus.find(
    (s) => !completedIds.includes(s.id) && !s.locked
  )
  if (!next) return `/paths/${pathId}`
  return getSyllabusItemHref(next)
}
