import type { Metadata } from "next"
import { Suspense } from "react"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AnalyticsProvider } from "@/components/providers/analytics-provider"
import { ReferralCapture } from "@/components/providers/referral-capture"
import { MotivationProvider } from "@/components/habits/motivation-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { RouteGuard } from "@/components/providers/route-guard"
import { SubscriptionProvider } from "@/components/providers/subscription-provider"
import { UserStateProvider } from "@/components/providers/user-state-provider"
import { AmbientBackground } from "@/components/layout/ambient-background"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const SITE_DESCRIPTION =
  "Learn trading by doing interactive chart drills. Guided lessons, quizzes, AI feedback, and progress tracking for beginners."

export const metadata: Metadata = {
  title: {
    default: "TradeTrainer Academy",
    template: "%s | TradeTrainer Academy",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "TradeTrainer Academy",
    description: SITE_DESCRIPTION,
    siteName: "TradeTrainer Academy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeTrainer Academy",
    description: SITE_DESCRIPTION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "dark antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body className="min-h-svh bg-background">
        <AmbientBackground />
        <div className="relative z-10 min-h-svh">
          <ThemeProvider defaultTheme="dark" forcedTheme="dark">
            <TooltipProvider>
              <AuthProvider>
                <AnalyticsProvider>
                  <Suspense fallback={null}>
                    <ReferralCapture />
                  </Suspense>
                  <SubscriptionProvider>
                    <MotivationProvider>
                      <UserStateProvider>
                        <RouteGuard>{children}</RouteGuard>
                      </UserStateProvider>
                    </MotivationProvider>
                  </SubscriptionProvider>
                </AnalyticsProvider>
              </AuthProvider>
            </TooltipProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}
