"use client"

import Link from "next/link"
import { LockIcon } from "lucide-react"

import { LockedContentModal } from "@/components/learning-map/learning-map-modals"
import { Button } from "@/components/ui/button"
import type { AccessLevel, LockInfo } from "@/lib/learning-map/types"
import { useState } from "react"

interface ProgressionGateProps {
  access: AccessLevel
  title: string
  lockInfo: LockInfo
  children: React.ReactNode
  previewContent?: React.ReactNode
}

export function ProgressionGate({
  access,
  title,
  lockInfo,
  children,
  previewContent,
}: ProgressionGateProps) {
  const [open, setOpen] = useState(false)

  if (access === "unlocked") return <>{children}</>

  return (
    <>
      <div className="rounded-xl border border-border/60 bg-muted/20 p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <LockIcon className="size-4" />
          <span className="text-sm font-medium">
            {access === "preview" ? "Preview mode" : "Locked for now"}
          </span>
        </div>
        <h3 className="mt-2 font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {lockInfo.reason ||
            "Complete earlier Learning Map stages to unlock full practice here."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {lockInfo.ctaHref && (
            <Button size="sm" render={<Link href={lockInfo.ctaHref} />}>
              Go to prerequisite
            </Button>
          )}
          <Button size="sm" variant="outline" render={<Link href="/learning-map" />}>
            View Learning Map
          </Button>
          {access === "locked" && (
            <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>
              Why locked?
            </Button>
          )}
        </div>
        {access === "preview" && previewContent && (
          <div className="mt-6 border-t border-border/40 pt-6">{previewContent}</div>
        )}
      </div>
      <LockedContentModal
        open={open}
        onOpenChange={setOpen}
        title={title}
        lockInfo={lockInfo}
      />
    </>
  )
}

interface TopicGuideProps {
  title: string
  summary: string
  whyMatters: string
  prerequisites?: { title: string; href: string; completed?: boolean }[]
  unlocksAfter?: string[]
  lessonHref?: string
  practiceHref?: string
  quizHref?: string
  flashcardsHref?: string
}

export function TopicGuide({
  title,
  summary,
  whyMatters,
  prerequisites = [],
  unlocksAfter = [],
  lessonHref,
  practiceHref,
  quizHref,
  flashcardsHref,
}: TopicGuideProps) {
  return (
    <div className="mb-6 rounded-xl border border-border/60 bg-card/40 p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <p className="font-medium text-foreground">What you will learn</p>
          <p className="mt-1 text-muted-foreground">{summary}</p>
        </div>
        <div>
          <p className="font-medium text-foreground">Why it matters</p>
          <p className="mt-1 text-muted-foreground">{whyMatters}</p>
        </div>
      </div>
      {prerequisites.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-muted-foreground">Prerequisites</p>
          <ul className="mt-1 flex flex-wrap gap-2">
            {prerequisites.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="text-xs text-primary hover:underline"
                >
                  {p.completed ? "✓ " : ""}
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {unlocksAfter.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Unlocks after completion: </span>
          {unlocksAfter.join(", ")}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {lessonHref && (
          <Button size="sm" variant="outline" render={<Link href={lessonHref} />}>
            Lesson
          </Button>
        )}
        {practiceHref && (
          <Button size="sm" variant="outline" render={<Link href={practiceHref} />}>
            Practice
          </Button>
        )}
        {quizHref && (
          <Button size="sm" variant="outline" render={<Link href={quizHref} />}>
            Quiz
          </Button>
        )}
        {flashcardsHref && (
          <Button size="sm" variant="outline" render={<Link href={flashcardsHref} />}>
            Flashcards
          </Button>
        )}
      </div>
    </div>
  )
}
