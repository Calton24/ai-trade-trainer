import { computeTradeMetrics } from "./sizing"

/** Simulated broker metrics for educational Execution Lab. */

export interface TerminalAccountMetrics {
  spreadPips: number
  spreadCost: number
  commission: number
  marginRequired: number
  equity: number
  freeMargin: number
  floatingPnL: number
  balance: number
}

const DEFAULT_LEVERAGE = 30

/** Approximate spread by symbol (educational). */
export function estimateSpreadPips(symbol: string): number {
  if (symbol.includes("XAU")) return 2.5
  if (symbol.includes("JPY")) return 1.2
  if (symbol.includes("GBP")) return 1.5
  return 1.0
}

export function estimateCommission(lots: number): number {
  return Math.round(lots * 3.5 * 100) / 100
}

export function estimateMarginRequired(
  symbol: string,
  lots: number,
  price: number
): number {
  const contractSize = symbol.includes("XAU") ? 100 : 100_000
  const notional = lots * contractSize * price
  return Math.round((notional / DEFAULT_LEVERAGE) * 100) / 100
}

export function computeTerminalMetrics({
  symbol,
  accountSize,
  direction,
  entry,
  stop,
  target,
  riskPercent,
  pipSize,
  pipValuePerLot,
  lots,
  currentPrice,
  floatingPnL = 0,
}: {
  symbol: string
  accountSize: number
  direction: "buy" | "sell"
  entry: number
  stop: number
  target: number
  riskPercent: number
  pipSize: number
  pipValuePerLot: number
  lots: number
  currentPrice?: number
  floatingPnL?: number
}): TerminalAccountMetrics & ReturnType<typeof computeTradeMetrics> {
  const trade = computeTradeMetrics({
    direction,
    entry,
    stop,
    target,
    accountSize,
    riskPercent,
    pipSize,
    pipValuePerLot,
    lotsOverride: lots,
  })

  const spreadPips = estimateSpreadPips(symbol)
  const spreadCost = Math.round(spreadPips * pipValuePerLot * trade.lots * 100) / 100
  const commission = estimateCommission(trade.lots)
  const marginRequired = estimateMarginRequired(symbol, trade.lots, entry)
  const balance = accountSize
  const equity = Math.round((balance + floatingPnL) * 100) / 100
  const freeMargin = Math.round((equity - marginRequired) * 100) / 100

  return {
    ...trade,
    spreadPips,
    spreadCost,
    commission,
    marginRequired,
    equity,
    freeMargin,
    floatingPnL,
    balance,
  }
}

export function computeFloatingPnL({
  direction,
  entry,
  currentPrice,
  lots,
  pipSize,
  pipValuePerLot,
}: {
  direction: "buy" | "sell"
  entry: number
  currentPrice: number
  lots: number
  pipSize: number
  pipValuePerLot: number
}): { pips: number; pnl: number; rr: number; distToSlPips: number; distToTpPips: number } {
  const rawPips =
    direction === "buy"
      ? (currentPrice - entry) / pipSize
      : (entry - currentPrice) / pipSize
  const pips = Math.round(rawPips * 10) / 10
  const pnl = Math.round(pips * pipValuePerLot * lots * 100) / 100
  return {
    pips,
    pnl,
    rr: 0,
    distToSlPips: 0,
    distToTpPips: 0,
  }
}

export function computeFloatingWithLevels({
  direction,
  entry,
  stop,
  target,
  currentPrice,
  lots,
  pipSize,
  pipValuePerLot,
}: {
  direction: "buy" | "sell"
  entry: number
  stop: number
  target: number
  currentPrice: number
  lots: number
  pipSize: number
  pipValuePerLot: number
}) {
  const base = computeFloatingPnL({
    direction,
    entry,
    currentPrice,
    lots,
    pipSize,
    pipValuePerLot,
  })
  const stopPips = Math.abs(entry - stop) / pipSize
  const targetPips = Math.abs(target - entry) / pipSize
  const distToSlPips =
    direction === "buy"
      ? Math.round(((currentPrice - stop) / pipSize) * 10) / 10
      : Math.round(((stop - currentPrice) / pipSize) * 10) / 10
  const distToTpPips =
    direction === "buy"
      ? Math.round(((target - currentPrice) / pipSize) * 10) / 10
      : Math.round(((currentPrice - target) / pipSize) * 10) / 10
  const rr = stopPips > 0 ? Math.round((base.pips / stopPips) * 10) / 10 : 0
  return { ...base, rr, distToSlPips, distToTpPips, stopPips, targetPips }
}
