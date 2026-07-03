import { SparklesIcon } from "lucide-react"

import { PRIVATE_BETA_MESSAGE } from "@/lib/config/private-beta"

export function PrivateBetaNotice({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-sm text-muted-foreground">{PRIVATE_BETA_MESSAGE}</p>
    )
  }

  return (
    <div className="mx-auto max-w-xl rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
      <SparklesIcon className="mx-auto size-8 text-primary" />
      <h2 className="mt-3 text-lg font-semibold">Private beta</h2>
      <p className="mt-2 text-sm text-muted-foreground">{PRIVATE_BETA_MESSAGE}</p>
    </div>
  )
}
