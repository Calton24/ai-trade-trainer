import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MotivationProvider } from "@/components/habits/motivation-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { RouteGuard } from "@/components/providers/route-guard"
import { SubscriptionProvider } from "@/components/providers/subscription-provider"
import { UserStateProvider } from "@/components/providers/user-state-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "TradeTrainer AI",
    template: "%s | TradeTrainer AI",
  },
  description:
    "Learn trading by doing interactive chart drills. Guided lessons, quizzes, AI feedback, and progress tracking for beginners.",
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
      <body>
        <ThemeProvider defaultTheme="dark" forcedTheme="dark">
          <TooltipProvider>
            <AuthProvider>
              <SubscriptionProvider>
                <MotivationProvider>
                  <UserStateProvider>
                    <RouteGuard>{children}</RouteGuard>
                  </UserStateProvider>
                </MotivationProvider>
              </SubscriptionProvider>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
