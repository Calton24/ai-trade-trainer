import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getAllPaths, formatApproxDuration } from "@/lib/course"

export function BeginnerPathPreview() {
  const previewPaths = getAllPaths()
    .slice()
    .sort((a, b) => a.order - b.order)
    .slice(0, 3)

  return (
    <section className="border-y border-border/60 bg-card/20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <p className="text-sm font-medium text-primary">Learning paths</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Structured paths with real course content
            </h2>
            <p className="text-muted-foreground">
              Each path has modules, lessons, quizzes, and drills — with time
              estimates calculated from actual content.
            </p>
            <Button className="w-fit" render={<Link href="/paths" />}>
              Browse All Paths
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {previewPaths.map((path) => (
              <Link
                key={path.id}
                href={`/paths/${path.slug}`}
                className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card/50 p-4 transition-colors hover:border-primary/20 hover:bg-card/80"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{path.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatApproxDuration(path.estimatedMinutes)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {path.stats.moduleCount} modules · {path.stats.lessonCount}{" "}
                  lessons · {path.stats.quizCount} quizzes
                  {path.status !== "available" &&
                    ` · ${path.status === "preview" ? "Preview" : "Coming soon"}`}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
