import type { Metadata } from "next"

import { DashboardContent } from "@/components/dashboard/dashboard-content"

export const metadata: Metadata = {
  title: "Dashboard — TradeTrainer Academy",
}

export default function DashboardPage() {
  return <DashboardContent />
}
