import Link from "next/link"
import { TrendingUpIcon } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,oklch(0.72_0.19_145/0.14),transparent)]" />
      <div className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 size-64 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <TrendingUpIcon className="text-primary" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            TradeTrainer <span className="text-primary">Academy</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-2xl shadow-primary/5 backdrop-blur-sm sm:p-8">
          {children}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Educational simulator only. Not financial advice.
        </p>
      </div>
    </div>
  )
}
