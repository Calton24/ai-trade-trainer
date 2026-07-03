import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm text-muted-foreground">
            TradeTrainer Academy is an educational simulator. It does not provide
            financial advice, trading signals, live trade recommendations, or
            profit guarantees.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link href="/learn" className="hover:text-foreground">
              Learn
            </Link>
            <Link href="/training" className="hover:text-foreground">
              Training
            </Link>
            <Link href="/pricing" className="hover:text-foreground">
              Pricing
            </Link>
            <Link href="/community" className="hover:text-foreground">
              Community
            </Link>
          </div>
        </div>
        <p className="text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} TradeTrainer Academy. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
