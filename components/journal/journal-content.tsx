"use client"

import Link from "next/link"
import { BookOpenIcon, PenLineIcon } from "lucide-react"

import { JournalEntryCard } from "@/components/journal/journal-entry-card"
import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import type { JournalEntry } from "@/lib/types"

export function JournalContent() {
  const { state } = useUserState()
  const entries = state.journalEntries

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Practice Journal
          </h1>
          <p className="text-muted-foreground">
            Reflect on what you practiced and what you learned — entries appear
            only after you complete drills or add reflections
          </p>
        </div>

        {entries.length === 0 ? (
          <EmptyState
            icon={BookOpenIcon}
            title="Your practice journal is empty"
            description="Complete a chart drill or reflection to create your first entry."
            action={
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button render={<Link href="/training" />}>
                  <PenLineIcon data-icon="inline-start" />
                  Start a Drill
                </Button>
                <Button variant="outline" render={<Link href="/learn" />}>
                  Add Reflection
                </Button>
              </div>
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {entries.map((entry: JournalEntry) => (
              <JournalEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
