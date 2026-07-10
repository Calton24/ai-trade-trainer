export interface TradeMetrics {
  stopPips: number
  targetPips: number
  riskAmount: number
  rewardAmount: number
  rr: number
  lots: number
  expectedLoss: number
  expectedProfit: number
}

export function priceToPips(
  entry: number,
  price: number,
  pipSize: number
): number {
  if (pipSize <= 0) return 0
  return Math.round((Math.abs(entry - price) / pipSize) * 10) / 10
}

export function computeTradeMetrics({
  direction,
  entry,
  stop,
  target,
  accountSize,
  riskPercent,
  pipSize,
  pipValuePerLot,
  lotsOverride,
}: {
  direction: "buy" | "sell"
  entry: number
  stop: number
  target: number
  accountSize: number
  riskPercent: number
  pipSize: number
  pipValuePerLot: number
  lotsOverride?: number
}): TradeMetrics {
  const stopPips = priceToPips(entry, stop, pipSize)
  const targetPips = priceToPips(entry, target, pipSize)
  const riskAmount = accountSize * (riskPercent / 100)

  const autoLots =
    stopPips > 0 && pipValuePerLot > 0
      ? riskAmount / (stopPips * pipValuePerLot)
      : 0
  const lots =
    lotsOverride && lotsOverride > 0
      ? lotsOverride
      : Math.round(autoLots * 100) / 100

  const expectedLoss = stopPips * pipValuePerLot * lots
  const expectedProfit = targetPips * pipValuePerLot * lots
  const rr =
    stopPips > 0 ? Math.round((targetPips / stopPips) * 10) / 10 : 0

  return {
    stopPips,
    targetPips,
    riskAmount: Math.round(riskAmount * 100) / 100,
    rewardAmount: Math.round(expectedProfit * 100) / 100,
    rr,
    lots,
    expectedLoss: Math.round(expectedLoss * 100) / 100,
    expectedProfit: Math.round(expectedProfit * 100) / 100,
  }
}
