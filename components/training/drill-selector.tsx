"use client"

import type { Drill } from "@/lib/types"
import { cn } from "@/lib/utils"

interface DrillSelectorProps {
  drills: Drill[]
  selectedId: string
  onSelect: (id: string) => void
}

export function DrillSelector({ drills, selectedId, onSelect }: DrillSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">Choose a drill</p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {drills.map((drill) => (
          <button
            key={drill.id}
            type="button"
            onClick={() => onSelect(drill.id)}
            className={cn(
              "flex flex-col gap-1 rounded-lg border px-4 py-3 text-left transition-colors",
              selectedId === drill.id
                ? "border-primary/30 bg-primary/10 ring-1 ring-primary/20"
                : "border-border/60 bg-card/50 hover:border-primary/20 hover:bg-muted/30"
            )}
          >
            <span className="text-sm font-medium">{drill.title}</span>
            <span className="text-xs text-muted-foreground">
              {drill.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
