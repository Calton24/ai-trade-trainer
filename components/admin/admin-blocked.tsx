import Link from "next/link"
import { ShieldAlertIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { AdminGateResult } from "@/lib/admin/auth"

export function AdminBlocked({ gate }: { gate: Extract<AdminGateResult, { ok: false }> }) {
  const messages = {
    not_configured: {
      title: "Admin tools not configured",
      body: "Set ADMIN_EMAILS in your environment (comma-separated) to enable internal tools. This route is hidden from normal users.",
    },
    no_auth: {
      title: "Sign in required",
      body: "Admin tools require an authenticated Supabase session.",
    },
    forbidden: {
      title: "Access denied",
      body: "Your account is not on the admin allowlist.",
    },
  }[gate.reason]

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <ShieldAlertIcon className="size-10 text-muted-foreground" />
      <h1 className="text-xl font-semibold">{messages.title}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{messages.body}</p>
      <Button render={<Link href="/dashboard" />}>Back to dashboard</Button>
    </div>
  )
}
