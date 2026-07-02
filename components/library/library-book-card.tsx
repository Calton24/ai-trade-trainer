"use client"

import Link from "next/link"
import { ArrowRightIcon, BookOpenIcon, CheckCircle2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getBookHref } from "@/content/library"
import type { LibraryBook, LibraryBookStats } from "@/lib/book-lab/types"
import { cn } from "@/lib/utils"

interface LibraryBookCardProps {
  book: LibraryBook
  stats: LibraryBookStats
}

export function LibraryBookCard({ book, stats }: LibraryBookCardProps) {
  const started = stats.conceptsCompleted > 0
  const ctaLabel = stats.completed
    ? "Review Book"
    : started
      ? "Continue Reading"
      : "Start Reading"

  return (
    <Link
      href={getBookHref(book)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/50 ring-1 ring-white/[0.02] transition-all duration-300",
        "hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      )}
    >
      <div
        className={cn(
          "relative flex h-32 items-center justify-center bg-gradient-to-br",
          book.coverGradient
        )}
      >
        <span className="text-5xl drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
          {book.cover}
        </span>
        {stats.completed && (
          <Badge className="absolute right-3 top-3 border-primary/20 bg-primary/15 text-primary">
            <CheckCircle2Icon className="size-3" />
            Completed
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="text-[10px]">
            {book.category}
          </Badge>
          <Badge variant="outline" className="text-[10px] capitalize">
            {book.difficulty}
          </Badge>
        </div>

        <div>
          <h3 className="font-semibold leading-tight">{book.title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            by {book.author}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BookOpenIcon className="size-3" />
            {stats.totalConcepts} lessons
          </span>
          <span>~{book.estimatedHours}h</span>
          {stats.xpEarned > 0 && <span>{stats.xpEarned} XP earned</span>}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {stats.conceptsCompleted}/{stats.totalConcepts} complete
            </span>
            <span className="font-medium text-primary">
              {stats.progressPercent}%
            </span>
          </div>
          <Progress value={stats.progressPercent} className="h-1.5" />
        </div>

        <Button
          size="sm"
          variant={stats.completed ? "outline" : "default"}
          className="mt-1 w-full"
          tabIndex={-1}
        >
          {ctaLabel}
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>
    </Link>
  )
}
