import type { ScenarioCandle } from "@/lib/charts/types"

export interface CsvParseResult {
  ok: boolean
  candles: ScenarioCandle[]
  errors: string[]
  warnings: string[]
}

function parseNum(value: string): number | null {
  const n = Number.parseFloat(value.trim())
  return Number.isFinite(n) ? n : null
}

function detectDelimiter(line: string): "," | ";" | "\t" {
  if (line.includes("\t")) return "\t"
  if (line.split(";").length > line.split(",").length) return ";"
  return ","
}

function normalizeHeader(cell: string): string {
  return cell.trim().toLowerCase().replace(/\s+/g, "")
}

export function parseOhlcCsv(text: string): CsvParseResult {
  const errors: string[] = []
  const warnings: string[] = []
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length < 2) {
    return { ok: false, candles: [], errors: ["Need a header row and at least one data row."], warnings }
  }

  const delim = detectDelimiter(lines[0])
  const headerCells = lines[0].split(delim).map(normalizeHeader)

  const col = (names: string[]) => headerCells.findIndex((h) => names.includes(h))

  const timeCol = col(["time", "date", "datetime", "timestamp"])
  const openCol = col(["open", "o"])
  const highCol = col(["high", "h"])
  const lowCol = col(["low", "l"])
  const closeCol = col(["close", "c"])

  if (openCol < 0 || highCol < 0 || lowCol < 0 || closeCol < 0) {
    return {
      ok: false,
      candles: [],
      errors: [
        "Missing required columns. Expected: time (optional), open, high, low, close.",
        `Found headers: ${headerCells.join(", ")}`,
      ],
      warnings,
    }
  }

  const candles: ScenarioCandle[] = []

  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(delim)
    const open = parseNum(cells[openCol] ?? "")
    const high = parseNum(cells[highCol] ?? "")
    const low = parseNum(cells[lowCol] ?? "")
    const close = parseNum(cells[closeCol] ?? "")

    if (open === null || high === null || low === null || close === null) {
      errors.push(`Row ${i + 1}: invalid numeric OHLC values.`)
      continue
    }

    if (high < Math.max(open, close) - 1e-9 || high < low) {
      errors.push(`Row ${i + 1}: high must be >= open, close, and low.`)
      continue
    }
    if (low > Math.min(open, close) + 1e-9 || low > high) {
      errors.push(`Row ${i + 1}: low must be <= open, close, and high.`)
      continue
    }

    const timeRaw = timeCol >= 0 ? cells[timeCol]?.trim() : String(i - 1)
    const time = timeCol >= 0 ? i - 1 : i - 1

    candles.push({ time, open, high, low, close })
    if (timeCol < 0 && i === 1) {
      warnings.push("No time column detected — using candle index as time.")
    }
    void timeRaw
  }

  if (candles.length === 0) {
    errors.push("No valid candles parsed.")
    return { ok: false, candles: [], errors, warnings }
  }

  candles.forEach((c, idx) => {
    c.time = idx
  })

  return { ok: errors.length === 0, candles, errors, warnings }
}

export function candlesToCsv(candles: ScenarioCandle[]): string {
  const lines = ["time,open,high,low,close"]
  for (const c of candles) {
    lines.push(`${c.time},${c.open},${c.high},${c.low},${c.close}`)
  }
  return lines.join("\n")
}
