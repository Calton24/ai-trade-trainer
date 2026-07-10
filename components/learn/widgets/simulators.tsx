"use client"

import { useMemo, useState } from "react"
import { CoinsIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type {
  CoinFlipWidget,
  ExpectancySimulatorWidget,
  SessionClockWidget,
} from "@/lib/course/widgets"
import { cn } from "@/lib/utils"

/**
 * Expectancy simulator: adjust win rate and R:R, watch expectancy per trade
 * and a simulated 100-trade equity path update.
 */
export function ExpectancySimulator(_props: {
  widget: ExpectancySimulatorWidget
}) {
  const [winRate, setWinRate] = useState(45)
  const [rewardR, setRewardR] = useState(2)

  const expectancy = (winRate / 100) * rewardR - (1 - winRate / 100) * 1

  const equity = useMemo(() => {
    let value = 0
    let seed = winRate * 131 + rewardR * 17
    const points: number[] = [0]
    for (let i = 0; i < 100; i++) {
      seed = (seed * 9301 + 49297) % 233280
      const win = seed / 233280 < winRate / 100
      value += win ? rewardR : -1
      points.push(value)
    }
    return points
  }, [winRate, rewardR])

  const final = equity[equity.length - 1]
  const min = Math.min(...equity)
  const max = Math.max(...equity)
  const range = Math.max(max - min, 1)

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <p className="font-medium">Expectancy Simulator</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Change win rate and reward-to-risk. Expectancy = (Win% × R) − (Loss% ×
        1).
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Win rate: {winRate}%</Label>
          <input
            type="range"
            min={20}
            max={80}
            value={winRate}
            onChange={(e) => setWinRate(Number(e.target.value))}
            className="mt-2 w-full accent-primary"
          />
        </div>
        <div>
          <Label>Reward per win: {rewardR}R</Label>
          <input
            type="range"
            min={0.5}
            max={5}
            step={0.5}
            value={rewardR}
            onChange={(e) => setRewardR(Number(e.target.value))}
            className="mt-2 w-full accent-primary"
          />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div
          className={cn(
            "rounded-lg border px-4 py-3",
            expectancy >= 0
              ? "border-primary/20 bg-primary/5"
              : "border-destructive/20 bg-destructive/5"
          )}
        >
          <p className="text-sm text-muted-foreground">Expectancy / trade</p>
          <p
            className={cn(
              "text-lg font-semibold",
              expectancy >= 0 ? "text-primary" : "text-destructive"
            )}
          >
            {expectancy >= 0 ? "+" : ""}
            {expectancy.toFixed(2)}R
          </p>
        </div>
        <div className="rounded-lg border border-border/60 px-4 py-3">
          <p className="text-sm text-muted-foreground">After 100 trades</p>
          <p
            className={cn(
              "text-lg font-semibold",
              final >= 0 ? "text-primary" : "text-destructive"
            )}
          >
            {final >= 0 ? "+" : ""}
            {final.toFixed(1)}R
          </p>
        </div>
      </div>
      <svg
        viewBox="0 0 200 60"
        className="mt-4 h-24 w-full"
        preserveAspectRatio="none"
        aria-label="Simulated equity curve"
      >
        <polyline
          fill="none"
          stroke={final >= 0 ? "var(--primary)" : "var(--destructive)"}
          strokeWidth="1.5"
          points={equity
            .map(
              (v, i) =>
                `${(i / (equity.length - 1)) * 200},${
                  55 - ((v - min) / range) * 50
                }`
            )
            .join(" ")}
        />
      </svg>
      <p className="mt-2 text-xs text-muted-foreground">
        Notice: a 40% win rate is profitable at 2R+. A 60% win rate loses money
        below 0.7R. Win rate alone tells you nothing.
      </p>
    </div>
  )
}

/** Coin flip streak simulator — experience how random outcomes cluster. */
export function CoinFlipSimulator(_props: { widget: CoinFlipWidget }) {
  const [flips, setFlips] = useState<boolean[]>([])

  const flip = (count: number) => {
    const next = [...flips]
    for (let i = 0; i < count; i++) next.push(Math.random() < 0.5)
    setFlips(next.slice(-200))
  }

  const heads = flips.filter(Boolean).length
  let maxStreak = 0
  let current = 0
  let last: boolean | null = null
  for (const f of flips) {
    current = f === last ? current + 1 : 1
    last = f
    if (current > maxStreak) maxStreak = current
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <p className="font-medium">Coin Flip Simulator</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Each flip is 50/50 — yet long streaks appear. Trading outcomes cluster
        the same way, even with a real edge.
      </p>
      <div className="mt-4 flex gap-2">
        <Button size="sm" onClick={() => flip(1)}>
          <CoinsIcon data-icon="inline-start" />
          Flip 1
        </Button>
        <Button size="sm" variant="outline" onClick={() => flip(20)}>
          Flip 20
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setFlips([])}
          disabled={flips.length === 0}
        >
          <RotateCcwIcon data-icon="inline-start" />
          Reset
        </Button>
      </div>
      {flips.length > 0 && (
        <>
          <div className="mt-4 flex flex-wrap gap-1">
            {flips.slice(-60).map((f, i) => (
              <span
                key={i}
                className={cn(
                  "flex size-6 items-center justify-center rounded text-xs font-medium",
                  f
                    ? "bg-primary/15 text-primary"
                    : "bg-destructive/15 text-destructive"
                )}
              >
                {f ? "W" : "L"}
              </span>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Flips</p>
              <p className="font-semibold">{flips.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Win rate</p>
              <p className="font-semibold">
                {((heads / flips.length) * 100).toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Longest streak</p>
              <p className="font-semibold">{maxStreak}</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const SESSIONS = [
  { name: "Sydney", startUtc: 21, endUtc: 6, pairs: "AUD, NZD pairs" },
  { name: "Tokyo", startUtc: 0, endUtc: 9, pairs: "JPY pairs" },
  { name: "London", startUtc: 8, endUtc: 17, pairs: "EUR, GBP pairs" },
  { name: "New York", startUtc: 13, endUtc: 22, pairs: "USD pairs" },
]

function isOpen(hour: number, start: number, end: number): boolean {
  return start < end ? hour >= start && hour < end : hour >= start || hour < end
}

/** Interactive world session clock: scrub UTC time, see which sessions are open. */
export function SessionClock(_props: { widget: SessionClockWidget }) {
  const [hour, setHour] = useState(14)

  const openSessions = SESSIONS.filter((s) => isOpen(hour, s.startUtc, s.endUtc))
  const isLondonNy = openSessions.some((s) => s.name === "London") &&
    openSessions.some((s) => s.name === "New York")

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <p className="font-medium">World Session Clock</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Drag the slider through a 24-hour day (UTC) and watch sessions open and
        close.
      </p>
      <div className="mt-4">
        <Label>Time: {String(hour).padStart(2, "0")}:00 UTC</Label>
        <input
          type="range"
          min={0}
          max={23}
          value={hour}
          onChange={(e) => setHour(Number(e.target.value))}
          className="mt-2 w-full accent-primary"
        />
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {SESSIONS.map((s) => {
          const open = isOpen(hour, s.startUtc, s.endUtc)
          return (
            <div
              key={s.name}
              className={cn(
                "flex items-center justify-between rounded-lg border px-4 py-2.5",
                open
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/60 opacity-60"
              )}
            >
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.pairs}</p>
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  open ? "text-primary" : "text-muted-foreground"
                )}
              >
                {open ? "OPEN" : "closed"}
              </span>
            </div>
          )
        })}
      </div>
      {isLondonNy && (
        <p className="mt-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm text-primary">
          London–New York overlap: the highest-volume window of the day.
        </p>
      )}
    </div>
  )
}
