"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import {
  BarChart3Icon,
  BookOpenIcon,
  BrainIcon,
  LibraryBigIcon,
  CandlestickChartIcon,
  ClipboardListIcon,
  CreditCardIcon,
  GraduationCapIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LineChartIcon,
  MapIcon,
  MedalIcon,
  ShieldCheckIcon,
  TargetIcon,
  TrendingUpIcon,
  TrophyIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { isPrivateBetaEnabled } from "@/lib/config/private-beta"

const MOBILE_NAV_HREFS = [
  "/dashboard",
  "/learning-map",
  "/simulator",
  "/chart-lab",
  "/journal",
] as const

type NavItem = { href: string; label: string; icon: typeof LayoutDashboardIcon }

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "",
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon }],
  },
  {
    title: "Progression",
    items: [
      { href: "/progression", label: "Progression", icon: TrophyIcon },
      { href: "/leaderboard", label: "Leaderboard", icon: MedalIcon },
    ],
  },
  {
    title: "Learning",
    items: [
      { href: "/learning-map", label: "Learning Map", icon: MapIcon },
      { href: "/paths", label: "Paths", icon: GraduationCapIcon },
      { href: "/learn", label: "Learn", icon: GraduationCapIcon },
      { href: "/library", label: "Trading Library", icon: LibraryBigIcon },
      { href: "/flashcards", label: "Flashcards", icon: LayersIcon },
      { href: "/quizzes", label: "Quizzes", icon: BrainIcon },
    ],
  },
  {
    title: "Practice",
    items: [
      { href: "/chart-lab", label: "Chart Lab", icon: CandlestickChartIcon },
      { href: "/trend-spotter", label: "Trend Spotter", icon: TrendingUpIcon },
      { href: "/strategy-wiki", label: "Strategy Wiki", icon: ClipboardListIcon },
    ],
  },
  {
    title: "Simulation",
    items: [
      { href: "/simulator", label: "Trading Simulator", icon: LineChartIcon },
      { href: "/journal", label: "Trade Journal", icon: BookOpenIcon },
      { href: "/simulator/performance", label: "Performance", icon: BarChart3Icon },
    ],
  },
  {
    title: "Assessment",
    items: [
      { href: "/trader-readiness", label: "Trader Readiness", icon: TargetIcon },
      { href: "/progression/live-transition", label: "Live Progression", icon: ShieldCheckIcon },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/profile", label: "Profile", icon: UserIcon },
      { href: "/progress", label: "Progress", icon: BarChart3Icon },
      { href: "/pricing", label: "Pricing", icon: CreditCardIcon },
    ],
  },
  {
    title: "Community",
    items: [{ href: "/community", label: "Community", icon: UsersIcon }],
  },
]

const allNavItems = navSections.flatMap((s) => s.items)

const mobileNavItems = MOBILE_NAV_HREFS.map(
  (href) => allNavItems.find((item) => item.href === href)!
)

export function SidebarNav() {
  const pathname = usePathname()
  const sections = useMemo(() => {
    if (!isPrivateBetaEnabled()) return navSections
    return navSections.map((section) => ({
      ...section,
      items: section.items.filter((item) => item.href !== "/pricing"),
    }))
  }, [])

  const isActive = (href: string) => {
    if (href === "/progression") {
      return pathname === "/progression"
    }
    if (href === "/simulator") {
      return (
        pathname === "/simulator" ||
        (pathname.startsWith("/simulator/") &&
          !pathname.startsWith("/simulator/performance"))
      )
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border/60 bg-card/50 backdrop-blur-xl lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-border/60 px-6">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
            <TrendingUpIcon className="text-primary" />
          </div>
          <Link href="/" className="font-semibold tracking-tight">
            TradeTrainer <span className="text-primary">Academy</span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {sections.map((section) => (
            <div key={section.title || "root"}>
              {section.title && (
                <p className="mb-1 mt-4 px-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 first:mt-0">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      active
                        ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <Icon />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
        <div className="border-t border-border/60 p-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Educational simulator only. Not financial advice.
          </p>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border/60 bg-card/95 backdrop-blur-xl lg:hidden">
        {mobileNavItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
