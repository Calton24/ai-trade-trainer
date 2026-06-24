"use client"

import { cn } from "@/lib/utils"
import type { TrendClassification } from "@/lib/trend-spotter/types"

const OPTIONS: {
  value: TrendClassification
  label: string
  color: string
}[] = [
  { value: "uptrend", label: "Uptrend", color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" },
  { value: "downtrend", label: "Downtrend", color: "border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20" },
  { value: "range", label: "Range", color: "border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" },
  { value: "messy", label: "Messy / No trend", color: "border-zinc-500/40 bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20" },
]

interface ClassificationButtonsProps {
  value: TrendClassification | null
  onChange: (value: TrendClassification) => void
  disabled?: boolean
  size?: "sm" | "md"
}

export function ClassificationButtons({
  value,
  onChange,
  disabled,
  size = "md",
}: ClassificationButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors disabled:opacity-50",
            size === "sm" && "py-2 text-xs",
            value === opt.value
              ? cn(opt.color, "ring-2 ring-primary/30")
              : "border-border/60 bg-card/50 text-muted-foreground hover:bg-muted/50"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
