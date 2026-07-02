"use client"

import {
  AwardIcon,
  BookMarkedIcon,
  FlameIcon,
  GraduationCapIcon,
  InfoIcon,
  LibraryBigIcon,
  SparklesIcon,
  TrendingUpIcon,
} from "lucide-react"

import { LibraryBookCard } from "@/components/library/library-book-card"
import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { getAllBooks, LIBRARY_DISCLAIMER } from "@/content/library"

const FUTURE_ASSET_TYPES = [
  { icon: "📄", label: "Research Papers" },
  { icon: "🧠", label: "Psychology Guides" },
  { icon: "📊", label: "Trading Playbooks" },
  { icon: "📈", label: "Strategy Manuals" },
  { icon: "🎥", label: "Premium Courses" },
  { icon: "📝", label: "Case Studies" },
]

export function LibraryContent() {
  const { libraryStats, libraryBookStats, stats } = useUserState()
  const books = getAllBooks()

  const summaryCards = [
    {
      label: "Books Completed",
      value: `${libraryStats.booksCompleted}/${libraryStats.booksOwned}`,
      icon: GraduationCapIcon,
    },
    {
      label: "Current Streak",
      value: stats.streak > 0 ? `${stats.streak} days` : "—",
      icon: FlameIcon,
    },
    {
      label: "Lessons Completed",
      value: `${libraryStats.lessonsCompleted}/${libraryStats.totalLessons}`,
      icon: BookMarkedIcon,
    },
    {
      label: "Reading Progress",
      value: `${libraryStats.readingProgressPercent}%`,
      icon: TrendingUpIcon,
    },
    {
      label: "Total XP",
      value: libraryStats.totalXP.toLocaleString(),
      icon: SparklesIcon,
    },
    {
      label: "Avg Quiz Score",
      value:
        libraryStats.averageQuizScore > 0
          ? `${libraryStats.averageQuizScore}%`
          : "—",
      icon: AwardIcon,
    },
    {
      label: "Reading Hours",
      value: `${libraryStats.estimatedReadingHours}h`,
      icon: LibraryBigIcon,
    },
  ]

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-primary">
            <LibraryBigIcon className="size-5" />
            <span className="text-sm font-medium">Trading Library</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Trading Library
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Build your trading knowledge from the world&apos;s best books — each
            one an interactive course with lessons, quizzes, practice, and XP.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/50 p-4 ring-1 ring-white/[0.02]"
            >
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <card.icon className="size-3.5" />
                <span className="text-xs">{card.label}</span>
              </div>
              <span className="text-xl font-semibold">{card.value}</span>
            </div>
          ))}
        </div>

        <section className="flex flex-col gap-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold">Your Books</h2>
              <p className="text-sm text-muted-foreground">
                {libraryStats.booksOwned} books · {libraryStats.totalLessons}{" "}
                lessons
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <LibraryBookCard
                key={book.id}
                book={book}
                stats={libraryBookStats[book.id]}
              />
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-dashed border-border/60 bg-card/30 p-6">
          <div className="flex items-center gap-2 text-primary">
            <SparklesIcon className="size-4" />
            <p className="text-sm font-medium">More learning assets coming</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            The library will grow beyond books to include other ways to learn.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {FUTURE_ASSET_TYPES.map((asset) => (
              <span
                key={asset.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs text-muted-foreground"
              >
                <span>{asset.icon}</span>
                {asset.label}
              </span>
            ))}
          </div>
        </section>

        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground/70">
          <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
          {LIBRARY_DISCLAIMER}
        </p>
      </div>
    </AppShell>
  )
}
