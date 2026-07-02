"use client"

import Link from "next/link"
import {
  BarChart3Icon,
  BookOpenIcon,
  GaugeIcon,
  LineChartIcon,
  TrophyIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const UPGRADE_BENEFITS = [
  { icon: BookOpenIcon, label: "Full Trading Library" },
  { icon: LineChartIcon, label: "Chart Lab" },
  { icon: BarChart3Icon, label: "Strategy Wiki" },
  { icon: GaugeIcon, label: "Trading Simulator" },
  { icon: TrophyIcon, label: "Trader Readiness" },
  { icon: TrophyIcon, label: "XP progression & leaderboards" },
]

export function UpgradeModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Unlock full trading training
          </DialogTitle>
          <DialogDescription>
            Upgrade to Pro for the complete structured programme.
          </DialogDescription>
        </DialogHeader>

        <ul className="grid gap-2.5 py-2">
          {UPGRADE_BENEFITS.map((b) => (
            <li key={b.label} className="flex items-center gap-3 text-sm">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <b.icon className="size-4" />
              </span>
              {b.label}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2">
          <Button render={<Link href="/pricing" />}>View Plans</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Continue Free
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
