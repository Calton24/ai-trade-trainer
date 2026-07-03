"use client"

import Link from "next/link"
import { useEffect } from "react"
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
import { trackUpgradeModalViewed } from "@/lib/analytics/events"
import { isPrivateBetaEnabled, PRIVATE_BETA_MESSAGE } from "@/lib/config/private-beta"

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
  useEffect(() => {
    if (open) trackUpgradeModalViewed({ source: "pro_gated_link" })
  }, [open])

  const privateBeta = isPrivateBetaEnabled()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {privateBeta ? "Private beta" : "Unlock full trading training"}
          </DialogTitle>
          <DialogDescription>
            {privateBeta
              ? PRIVATE_BETA_MESSAGE
              : "Upgrade to Pro for the complete structured programme."}
          </DialogDescription>
        </DialogHeader>

        {!privateBeta && (
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
        )}

        <div className="flex flex-col gap-2">
          {!privateBeta && (
            <Button render={<Link href="/pricing" />}>View Plans</Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {privateBeta ? "Got it" : "Continue Free"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
