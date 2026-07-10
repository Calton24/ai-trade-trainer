"use client"

import { memo, useMemo } from "react"
import { HelpCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ACCOUNT_PRESETS,
  type ExecutionScenario,
  type ExecutionTradePlan,
  type OrderMode,
  type PendingOrderType,
  type TradeDirection,
} from "@/lib/execution-lab/types"
import { computeTradeMetrics } from "@/lib/execution-lab/sizing"
import { computeTerminalMetrics } from "@/lib/execution-lab/terminal-metrics"
import type { StrategyChoice } from "@/lib/execution-lab/types"
import { cn } from "@/lib/utils"

const STRATEGY_LABELS: Record<StrategyChoice, string> = {
  continuation: "Continuation",
  reversal: "Reversal",
  "break-retest": "Break & Retest",
  "liquidity-sweep": "Liquidity Sweep",
  range: "Range",
  "no-trade": "No Trade",
}

const PENDING_LABELS: Record<PendingOrderType, string> = {
  "buy-limit": "Buy Limit",
  "sell-limit": "Sell Limit",
  "buy-stop": "Buy Stop",
  "sell-stop": "Sell Stop",
}

const TOOLTIPS: Record<string, string> = {
  market: "Execute at the current price when replay reaches your entry zone.",
  pending: "Order triggers when price reaches your entry level.",
  "buy-limit": "Buy below current price — wait for a pullback.",
  "sell-limit": "Sell above current price — fade into resistance.",
  "buy-stop": "Buy above current price — breakout entry.",
  "sell-stop": "Sell below current price — breakdown entry.",
  lots: "Position size in standard lots. Auto-calculated from risk %.",
  margin: "Simulated margin required (30:1 leverage). Educational only.",
  spread: "Simulated bid/ask spread cost on entry.",
  commission: "Simulated round-turn commission estimate.",
  risk: "Percentage of account risked if stop is hit.",
}

function Tip({ text }: { text: string }) {
  return (
    <span className="group relative ml-1 inline-flex cursor-help align-middle">
      <HelpCircleIcon className="size-3 text-muted-foreground" />
      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 hidden w-48 -translate-x-1/2 rounded-md border border-border bg-popover p-2 text-[10px] text-popover-foreground shadow-md group-hover:block">
        {text}
      </span>
    </span>
  )
}

interface ExecutionTicketProps {
  scenario: ExecutionScenario
  plan: ExecutionTradePlan
  onChange: (patch: Partial<ExecutionTradePlan>) => void
  onSubmit: () => void
  submitted: boolean
  disabled?: boolean
  phase?: "planning" | "managing" | "complete"
  floatingPnL?: number
}

export const ExecutionTicket = memo(function ExecutionTicket({
  scenario,
  plan,
  onChange,
  onSubmit,
  submitted,
  disabled,
  phase = "planning",
  floatingPnL = 0,
}: ExecutionTicketProps) {
  const isTrade = plan.direction === "buy" || plan.direction === "sell"

  const metrics = useMemo(() => {
    if (!isTrade) return null
    const dir = plan.direction as "buy" | "sell"
    return computeTerminalMetrics({
      symbol: scenario.symbol,
      accountSize: plan.accountSize,
      direction: dir,
      entry: plan.entry,
      stop: plan.stop,
      target: plan.target,
      riskPercent: plan.riskPercent,
      pipSize: scenario.pipSize,
      pipValuePerLot: scenario.pipValuePerLot,
      lots: plan.lots,
      floatingPnL: phase === "managing" ? floatingPnL : 0,
    })
  }, [plan, scenario, isTrade, phase, floatingPnL])

  const canSubmit =
    !submitted &&
    !disabled &&
    phase === "planning" &&
    plan.confidence > 0 &&
    (plan.direction === "no-trade" ||
      plan.direction === "wait" ||
      (plan.entry > 0 && plan.stop > 0 && plan.target > 0))

  const submitLabel =
    plan.direction === "no-trade" || plan.direction === "wait"
      ? "Submit No Trade Decision"
      : plan.orderMode === "pending"
        ? "Place Pending Order"
        : "Place Order"

  return (
    <div className="flex h-full max-h-[calc(100vh-8rem)] flex-col rounded-xl border border-border/60 bg-card/80">
      <div className="border-b border-border/60 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Trading Terminal
        </p>
        <p className="font-semibold">{scenario.symbol}</p>
        <p className="text-xs text-muted-foreground">
          {scenario.timeframe} · Simulated · Educational
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {scenario.strategyOptions.length > 0 && (
          <div>
            <Label className="text-xs">Strategy</Label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {scenario.strategyOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={submitted}
                  onClick={() => onChange({ strategy: s })}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs transition-colors",
                    plan.strategy === s
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 text-muted-foreground"
                  )}
                >
                  {STRATEGY_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <Label className="text-xs">Direction</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["buy", "sell", "wait", "no-trade"] as TradeDirection[]).map((d) => (
              <button
                key={d}
                type="button"
                disabled={submitted}
                onClick={() => onChange({ direction: d })}
                className={cn(
                  "rounded-lg border py-2 text-sm font-medium transition-colors",
                  plan.direction === d
                    ? d === "buy"
                      ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                      : d === "sell"
                        ? "border-red-500/50 bg-red-500/10 text-red-400"
                        : "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/60 text-muted-foreground"
                )}
              >
                {d === "no-trade" ? "No Trade" : d.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {isTrade && (
          <>
            <div>
              <Label className="text-xs">
                Order Type
                <Tip text={TOOLTIPS.market} />
              </Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["market", "pending"] as OrderMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    disabled={submitted}
                    onClick={() => onChange({ orderMode: m })}
                    className={cn(
                      "rounded-lg border py-2 text-xs font-medium capitalize",
                      plan.orderMode === m
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 text-muted-foreground"
                    )}
                  >
                    {m === "market" ? "Market" : "Pending"}
                  </button>
                ))}
              </div>
            </div>

            {plan.orderMode === "pending" && (
              <div>
                <Label className="text-xs">
                  Pending Type
                  <Tip text={TOOLTIPS.pending} />
                </Label>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {(Object.keys(PENDING_LABELS) as PendingOrderType[]).map((pt) => (
                    <button
                      key={pt}
                      type="button"
                      disabled={submitted}
                      onClick={() => onChange({ pendingType: pt })}
                      className={cn(
                        "rounded-md border px-2 py-1.5 text-[11px]",
                        plan.pendingType === pt
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/60 text-muted-foreground"
                      )}
                    >
                      {PENDING_LABELS[pt]}
                      <Tip text={TOOLTIPS[pt]} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-sm">
              <Metric label="Entry" value={plan.entry.toFixed(5)} />
              <Metric label="Stop" value={plan.stop.toFixed(5)} accent="danger" />
              <Metric label="Target" value={plan.target.toFixed(5)} accent="success" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Lots
                  <Tip text={TOOLTIPS.lots} />
                </p>
                <Input
                  className="mt-0.5 h-8 font-mono text-sm"
                  value={plan.lots || ""}
                  onChange={(e) => onChange({ lots: Number.parseFloat(e.target.value) || 0 })}
                  disabled={submitted}
                />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Drag entry, SL, and TP on the chart.
            </p>
          </>
        )}

        <div>
          <Label className="text-xs">Account</Label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ACCOUNT_PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                disabled={submitted}
                onClick={() => onChange({ accountSize: p.value })}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  plan.accountSize === p.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 text-muted-foreground"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-xs">
            Risk %
            <Tip text={TOOLTIPS.risk} />
          </Label>
          <Input
            className="mt-1 h-8"
            value={plan.riskPercent}
            onChange={(e) => onChange({ riskPercent: Number.parseFloat(e.target.value) || 1 })}
            disabled={submitted}
          />
        </div>

        {metrics && (
          <div className="space-y-3">
            <div className="rounded-lg border border-border/50 bg-background/40 p-3 text-sm">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Trade Metrics</p>
              <div className="grid grid-cols-2 gap-2">
                <Metric label="Stop pips" value={String(metrics.stopPips)} mono />
                <Metric label="Target pips" value={String(metrics.targetPips)} mono />
                <Metric label="R:R" value={`${metrics.rr}:1`} mono accent="primary" />
                <Metric label="Max loss" value={`£${metrics.expectedLoss}`} mono accent="danger" />
                <Metric label="Target profit" value={`£${metrics.expectedProfit}`} mono accent="success" />
                <Metric label="Spread" value={`${metrics.spreadPips} pips`} mono />
              </div>
            </div>
            <div className="rounded-lg border border-border/50 bg-background/40 p-3 text-sm">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Account (Simulated)</p>
              <div className="grid grid-cols-2 gap-2">
                <Metric label="Balance" value={`£${metrics.balance}`} mono />
                <Metric label="Equity" value={`£${metrics.equity}`} mono />
                <Metric label="Free Margin" value={`£${metrics.freeMargin}`} mono />
                <Metric label="Margin Req." value={`£${metrics.marginRequired}`} mono />
                <Metric label="Commission" value={`£${metrics.commission}`} mono />
                <Metric label="Spread cost" value={`£${metrics.spreadCost}`} mono />
              </div>
            </div>
          </div>
        )}

        <div>
          <Label className="text-xs">Confidence</Label>
          <div className="mt-2 flex gap-2">
            {[25, 50, 75, 100].map((c) => (
              <button
                key={c}
                type="button"
                disabled={submitted}
                onClick={() => onChange({ confidence: c })}
                className={cn(
                  "flex-1 rounded-md border py-1.5 text-xs",
                  plan.confidence === c
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 text-muted-foreground"
                )}
              >
                {c}%
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 p-4">
        <Button className="w-full" disabled={!canSubmit} onClick={onSubmit}>
          {submitted ? (phase === "managing" ? "Order Active" : "Complete") : submitLabel}
        </Button>
      </div>
    </div>
  )
})

function Metric({
  label,
  value,
  mono,
  accent,
}: {
  label: string
  value: string
  mono?: boolean
  accent?: "danger" | "success" | "primary"
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          mono && "font-mono",
          "font-medium",
          accent === "danger" && "text-red-400",
          accent === "success" && "text-green-400",
          accent === "primary" && "text-primary"
        )}
      >
        {value}
      </p>
    </div>
  )
}
