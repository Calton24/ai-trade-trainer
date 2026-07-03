import Link from "next/link"

import { BrandMark } from "@/components/layout/brand-mark"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center overflow-x-hidden px-4 py-12">
      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <BrandMark className="size-5" />
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
