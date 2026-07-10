import type { Metadata } from "next"
import Link from "next/link"

import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Funded Trader Journey | Trade Trainer",
  description: "Progress from demo account to funded trader — prop-firm challenge simulation.",
}

export default function CareerPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6 py-8">
        <h1 className="text-3xl font-semibold tracking-tight">Funded Trader Journey</h1>
        <p className="text-muted-foreground">
          Progress through the same stages real traders aspire to: demo account, £10k
          challenge, £25k, £50k, verification, funded account, and payouts — all under
          professional rules (1% max risk, 5% daily drawdown, 10% max loss).
        </p>
        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          <p className="text-sm font-medium">Milestone 3 — In development</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Daily workflow, watchlist, rule violations, news restrictions, and account
            progression ship after Academy Mode feedback. For now, practise in the
            Execution Lab.
          </p>
          <Button className="mt-4" render={<Link href="/execution-lab" />}>
            Open Execution Lab
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
