"use client"

import { StarIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { JournalEntry } from "@/lib/types"
import { cn } from "@/lib/utils"

interface JournalEntryCardProps {
  entry: JournalEntry
}

const confidenceLabels = ["Very low", "Low", "Okay", "Good", "Great"]

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-medium">{entry.setupPracticed}</h3>
          <p className="text-xs text-muted-foreground">
            {new Date(entry.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <Badge
          variant="secondary"
          className={cn(
            entry.mistakeTag === "None"
              ? "border-primary/20 bg-primary/10 text-primary"
              : "border-destructive/20 bg-destructive/10 text-destructive"
          )}
        >
          {entry.mistakeTag}
        </Badge>
      </div>

      {entry.source === "book-lab" && (
        <Badge variant="outline" className="w-fit text-xs">
          Book Lab · {entry.conceptTitle ?? entry.setupPracticed}
        </Badge>
      )}

      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-muted-foreground">
          What you marked
        </p>
        <p className="font-mono text-sm">{entry.marksSummary}</p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-muted-foreground">
          AI feedback summary
        </p>
        <p className="text-sm text-muted-foreground">
          {entry.aiFeedbackSummary}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Confidence:</span>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <StarIcon
              key={n}
              className={cn(
                "size-3.5",
                n <= entry.confidenceRating
                  ? "fill-primary text-primary"
                  : "text-muted-foreground/30"
              )}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {confidenceLabels[entry.confidenceRating - 1]}
        </span>
      </div>

      {entry.personalNote && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Personal note
          </p>
          <p className="mt-1 text-sm italic">{entry.personalNote}</p>
        </div>
      )}
    </div>
  )
}
