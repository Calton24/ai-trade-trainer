import Link from "next/link"

import { BrandMark } from "@/components/layout/brand-mark"
import { isPrivateBetaEnabled } from "@/lib/config/private-beta"

const PLATFORM_LINKS = [
  { href: "/#curriculum", label: "Curriculum" },
  { href: "/#practice", label: "Practice" },
  { href: "/#roadmap", label: "Roadmap" },
  { href: "/#pricing", label: "Pricing" },
]

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/refund", label: "Refund / Cancellation Policy" },
  { href: "/risk-disclaimer", label: "Risk Disclaimer" },
]

export function Footer() {
  // Keep in-page #pricing during private beta; hide only the /pricing route.
  const platformLinks = isPrivateBetaEnabled()
    ? PLATFORM_LINKS.filter((link) => link.href !== "/pricing")
    : PLATFORM_LINKS

  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                <BrandMark className="size-5" />
              </div>
              <span className="font-semibold tracking-tight">
                TradeTrainer <span className="text-primary">Academy</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Structured trading education with interactive practice,
              competency tracking, and live-trading readiness.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">Platform</p>
            <ul className="mt-3 space-y-2">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/sign-up"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Legal</p>
            <ul className="mt-3 space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Disclaimer</p>
            <p className="mt-3 text-sm text-muted-foreground">
              TradeTrainer Academy is an educational simulator. It does not
              provide financial advice, trading signals, live trade
              recommendations, or profit guarantees.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} TradeTrainer Academy. All rights
            reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            {LEGAL_LINKS.slice(0, 3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
