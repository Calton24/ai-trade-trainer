"use client"

import Link from "next/link"
import { RotateCcwIcon, SendIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Drill, TradeMarkType } from "@/lib/types"
import { cn } from "@/lib/utils"

const MARK_META: Record<
  TradeMarkType,
  { label: string; color: string }
> = {
  support: { label: "Support", color: "border-[#3b82f6]/30 hover:bg-[#3b82f6]/10" },
  resistance: { label: "Resistance", color: "border-[#f97316]/30 hover:bg-[#f97316]/10" },
  trend: { label: "Trend", color: "border-[#8b5cf6]/30 hover:bg-[#8b5cf6]/10" },
  break: { label: "Mark Break", color: "border-[#22c55e]/30 hover:bg-[#22c55e]/10" },
  retest: { label: "Mark Retest", color: "border-[#06b6d4]/30 hover:bg-[#06b6d4]/10" },
  entry: { label: "Entry", color: "border-[#a855f7]/30 hover:bg-[#a855f7]/10" },
  stop_loss: { label: "Stop Loss", color: "border-[#ef4444]/30 hover:bg-[#ef4444]/10" },
  take_profit: { label: "Take Profit", color: "border-[#eab308]/30 hover:bg-[#eab308]/10" },
}

interface MarkToolbarProps {
  drill: Drill
  activeMarkType: TradeMarkType | null
  onSelectMark: (type: TradeMarkType) => void
  onSubmit: () => void
  onReset: () => void
  isSubmitting: boolean
  markCount: number
}

export function MarkToolbar({
  drill,
  activeMarkType,
  onSelectMark,
  onSubmit,
  onReset,
  isSubmitting,
  markCount,
}: MarkToolbarProps) {
  const buttons = drill.requiredMarks.map((type) => ({
    type,
    ...MARK_META[type],
  }))

  return (
    <div className="flex flex-col gap-3 border-t border-border/60 p-4">
      <p className="text-xs text-muted-foreground">{drill.instructions}</p>
      <div className="flex flex-wrap gap-2">
        {buttons.map((btn) => (
          <Button
            key={btn.type}
            variant="outline"
            size="sm"
            className={cn(
              btn.color,
              activeMarkType === btn.type &&
                "ring-2 ring-primary/40 bg-primary/5"
            )}
            onClick={() => onSelectMark(btn.type)}
          >
            {btn.label}
          </Button>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcwIcon data-icon="inline-start" />
          Reset
        </Button>
        <Button
          size="sm"
          onClick={onSubmit}
          disabled={isSubmitting || markCount < 1}
        >
          <SendIcon data-icon="inline-start" />
          {isSubmitting ? "Reviewing..." : "Submit Answer"}
        </Button>
      </div>
    </div>
  )
}
