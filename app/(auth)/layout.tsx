import Link from "next/link"
import { TrendingUpIcon } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
          <TrendingUpIcon className="text-primary" />
        </div>
        <span className="text-lg font-semibold tracking-tight">
          TradeTrainer <span className="text-primary">Academy</span>
        </span>
      </Link>
      <div className="w-full max-w-md rounded-xl border border-border/60 bg-card/50 p-8">
        {children}
      </div>
    </div>
  )
}
