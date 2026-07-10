"use client"

import { memo } from "react"
import { ActivityIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ActiveTrade } from "@/lib/execution-lab/trade-management"
import { cn } from "@/lib/utils"

interface TradeStatusPanelProps {
  trade: ActiveTrade | null
  floatingPips: number
  floatingPnL: number
  currentRR: number
  distToSlPips: number
  distToTpPips: number
  phase: "planning" | "managing" | "complete"
  onMoveToBreakeven?: () => void
  onCloseEarly?: () => void
  onLetRun?: () => void
  className?: string
}

export const TradeStatusPanel = memo(function TradeStatusPanel({
  trade,
  floatingPips,
  floatingPnL,
  currentRR,
  distToSlPips,
  distToTpPips,
  phase,
  onMoveToBreakeven,
  onCloseEarly,
  onLetRun,
  className,
}: TradeStatusPanelProps) {
  if (phase !== "managing" || !trade || trade.status === "closed") return null

  const isProfit = floatingPnL >= 0

  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card/90 p-4",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ActivityIcon className="size-4 text-primary" />
          <p className="text-sm font-medium">Live Trade</p>
          <Badge variant="outline">{trade.direction.toUpperCase()}</Badge>
          {trade.movedToBreakeven && (
            <Badge className="bg-primary/10 text-primary">BE</Badge>
          )}
        </div>
        <p
          className={cn(
            "font-mono text-lg font-semibold tabular-nums",
            isProfit ? "text-green-400" : "text-red-400"
          )}
        >
          {isProfit ? "+" : ""}£{floatingPnL.toFixed(2)}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <Stat label="Pips" value={`${floatingPips > 0 ? "+" : ""}${floatingPips}`} />
        <Stat label="R multiple" value={`${currentRR}R`} />
        <Stat label="To SL" value={`${distToSlPips} pips`} accent="danger" />
        <Stat label="To TP" value={`${distToTpPips} pips`} accent="success" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={onMoveToBreakeven} disabled={trade.movedToBreakeven}>
          {trade.movedToBreakeven ? (
            <TrendingUpIcon className="size-3.5" data-icon="inline-start" />
          ) : (
            <TrendingUpIcon className="size-3.5" data-icon="inline-start" />
          )}
          Move to BE
        </Button>
        <Button size="sm" variant="outline" onClick={onCloseEarly}>
          <TrendingDownIcon className="size-3.5" data-icon="inline-start" />
          Close Early
        </Button>
        <Button size="sm" variant="ghost" onClick={onLetRun}>
          Let it run
        </Button>
      </div>

      <p className="mt-2 text-[10px] text-muted-foreground">
        Simulated P/L — educational only. Replay continues until SL, TP, or scenario end.
      </p>
    </div>
  )
})

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: "danger" | "success"
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          "font-mono font-medium",
          accent === "danger" && "text-red-400",
          accent === "success" && "text-green-400"
        )}
      >
        {value}
      </p>
    </div>
  )
}
