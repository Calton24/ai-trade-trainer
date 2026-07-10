"use client"

import { useMemo, useState } from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { MatchPairsWidget } from "@/lib/course/widgets"
import { cn } from "@/lib/utils"

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Tap a left item, then its matching right item. Wrong matches flash red. */
export function MatchPairs({ widget }: { widget: MatchPairsWidget }) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, string>>({})
  const [wrongFlash, setWrongFlash] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)

  const rights = useMemo(
    () => shuffle(widget.pairs.map((p) => p.right), widget.pairs.length * 7 + 13),
    [widget.pairs]
  )

  const done = Object.keys(matched).length === widget.pairs.length

  const pickRight = (right: string) => {
    if (!selectedLeft || matched[selectedLeft]) return
    setAttempts((a) => a + 1)
    const pair = widget.pairs.find((p) => p.left === selectedLeft)
    if (pair?.right === right) {
      setMatched((m) => ({ ...m, [selectedLeft]: right }))
      setSelectedLeft(null)
    } else {
      setWrongFlash(right)
      setTimeout(() => setWrongFlash(null), 600)
    }
  }

  const reset = () => {
    setMatched({})
    setSelectedLeft(null)
    setAttempts(0)
  }

  const matchedRights = new Set(Object.values(matched))

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <p className="font-medium">{widget.prompt}</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {widget.pairs.map((p) => (
            <button
              key={p.left}
              type="button"
              disabled={Boolean(matched[p.left])}
              onClick={() =>
                setSelectedLeft(selectedLeft === p.left ? null : p.left)
              }
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                matched[p.left]
                  ? "border-primary/40 bg-primary/5 text-primary"
                  : selectedLeft === p.left
                    ? "border-primary bg-primary/10"
                    : "border-border/60 hover:border-primary/40"
              )}
            >
              {p.left}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {rights.map((right) => (
            <button
              key={right}
              type="button"
              disabled={matchedRights.has(right)}
              onClick={() => pickRight(right)}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                matchedRights.has(right)
                  ? "border-primary/40 bg-primary/5 text-primary"
                  : wrongFlash === right
                    ? "border-destructive bg-destructive/10"
                    : "border-border/60 hover:border-primary/40"
              )}
            >
              {right}
            </button>
          ))}
        </div>
      </div>
      {done && (
        <div className="mt-4 flex items-center gap-3">
          <p className="text-sm font-medium text-primary">
            All matched in {attempts} attempts
          </p>
          <Button size="sm" variant="outline" onClick={reset}>
            <RotateCcwIcon data-icon="inline-start" />
            Try again
          </Button>
        </div>
      )}
    </div>
  )
}
