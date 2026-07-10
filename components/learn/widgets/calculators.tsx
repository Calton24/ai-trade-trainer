"use client"

import { useState } from "react"
import { CheckCircle2Icon, XCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type {
  PipCalculatorWidget,
  PositionSizeCalculatorWidget,
} from "@/lib/course/widgets"
import { cn } from "@/lib/utils"

/** Live pip calculator: entry/exit → pips, with 4- and 2-decimal handling. */
export function PipCalculator(_props: { widget: PipCalculatorWidget }) {
  const [entry, setEntry] = useState("1.0850")
  const [exit, setExit] = useState("1.0870")
  const [jpy, setJpy] = useState(false)

  const entryNum = Number.parseFloat(entry)
  const exitNum = Number.parseFloat(exit)
  const valid = Number.isFinite(entryNum) && Number.isFinite(exitNum)
  const pipSize = jpy ? 0.01 : 0.0001
  const pips = valid ? (exitNum - entryNum) / pipSize : 0

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <p className="font-medium">Pip Calculator</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Change the prices and watch the pip distance update.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pip-entry">Entry price</Label>
          <Input
            id="pip-entry"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            inputMode="decimal"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pip-exit">Exit price</Label>
          <Input
            id="pip-exit"
            value={exit}
            onChange={(e) => setExit(e.target.value)}
            inputMode="decimal"
          />
        </div>
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={jpy}
          onChange={(e) => setJpy(e.target.checked)}
          className="accent-primary"
        />
        JPY pair (pip = 0.01)
      </label>
      <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
        <p className="text-sm text-muted-foreground">Distance</p>
        <p className="text-xl font-semibold text-primary">
          {valid ? `${pips >= 0 ? "+" : ""}${pips.toFixed(1)} pips` : "—"}
        </p>
      </div>
    </div>
  )
}

/**
 * Position size trainer. Free-play calculator plus graded scenarios where
 * the student must calculate the lot size manually before verifying.
 */
export function PositionSizeCalculator({
  widget,
}: {
  widget: PositionSizeCalculatorWidget
}) {
  const [account, setAccount] = useState("10000")
  const [riskPct, setRiskPct] = useState("1")
  const [stopPips, setStopPips] = useState("20")
  const [pipValue, setPipValue] = useState("10")

  const accountNum = Number.parseFloat(account)
  const riskNum = Number.parseFloat(riskPct)
  const stopNum = Number.parseFloat(stopPips)
  const pipNum = Number.parseFloat(pipValue)
  const valid =
    [accountNum, riskNum, stopNum, pipNum].every(Number.isFinite) &&
    stopNum > 0 &&
    pipNum > 0

  const riskAmount = valid ? accountNum * (riskNum / 100) : 0
  const lots = valid ? riskAmount / (stopNum * pipNum) : 0

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border/60 bg-card/50 p-5">
        <p className="font-medium">Position Size Calculator</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Lots = (Account × Risk%) ÷ (Stop pips × Pip value per lot)
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ps-account">Account ($)</Label>
            <Input
              id="ps-account"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              inputMode="decimal"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ps-risk">Risk %</Label>
            <Input
              id="ps-risk"
              value={riskPct}
              onChange={(e) => setRiskPct(e.target.value)}
              inputMode="decimal"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ps-stop">Stop (pips)</Label>
            <Input
              id="ps-stop"
              value={stopPips}
              onChange={(e) => setStopPips(e.target.value)}
              inputMode="decimal"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ps-pip">Pip value / lot ($)</Label>
            <Input
              id="ps-pip"
              value={pipValue}
              onChange={(e) => setPipValue(e.target.value)}
              inputMode="decimal"
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border/60 px-4 py-3">
            <p className="text-sm text-muted-foreground">Risk amount</p>
            <p className="text-lg font-semibold">
              {valid ? `$${riskAmount.toFixed(2)}` : "—"}
            </p>
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="text-sm text-muted-foreground">Position size</p>
            <p className="text-lg font-semibold text-primary">
              {valid ? `${lots.toFixed(2)} lots` : "—"}
            </p>
          </div>
        </div>
      </div>

      {widget.scenarios?.map((scenario, i) => (
        <GradedSizingScenario key={i} index={i + 1} scenario={scenario} />
      ))}
    </div>
  )
}

function GradedSizingScenario({
  index,
  scenario,
}: {
  index: number
  scenario: NonNullable<PositionSizeCalculatorWidget["scenarios"]>[number]
}) {
  const [answer, setAnswer] = useState("")
  const [checked, setChecked] = useState(false)

  const correctLots =
    (scenario.account * (scenario.riskPercent / 100)) /
    (scenario.stopPips * scenario.pipValuePerLot)
  const answerNum = Number.parseFloat(answer)
  const isCorrect =
    Number.isFinite(answerNum) && Math.abs(answerNum - correctLots) < 0.011

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <p className="text-sm font-medium">
        Scenario {index}: {scenario.label}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Account ${scenario.account.toLocaleString()} · Risk{" "}
        {scenario.riskPercent}% · Stop {scenario.stopPips} pips · Pip value $
        {scenario.pipValuePerLot}/lot. Calculate the lot size manually, then
        verify.
      </p>
      <div className="mt-3 flex items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`gs-${index}`}>Your answer (lots)</Label>
          <Input
            id={`gs-${index}`}
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value)
              setChecked(false)
            }}
            inputMode="decimal"
            className="w-32"
          />
        </div>
        <Button size="sm" onClick={() => setChecked(true)} disabled={!answer}>
          Verify
        </Button>
      </div>
      {checked && (
        <p
          className={cn(
            "mt-3 flex items-start gap-1.5 text-sm",
            isCorrect ? "text-primary" : "text-destructive"
          )}
        >
          {isCorrect ? (
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
          ) : (
            <XCircleIcon className="mt-0.5 size-4 shrink-0" />
          )}
          {isCorrect
            ? "Correct — risk stays fixed even as the stop distance changes."
            : `Not quite. Risk $${(scenario.account * scenario.riskPercent) / 100} ÷ (${scenario.stopPips} pips × $${scenario.pipValuePerLot}) = ${correctLots.toFixed(2)} lots.`}
        </p>
      )}
    </div>
  )
}
