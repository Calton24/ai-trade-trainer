import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EDUCATIONAL_DISCLAIMER } from "@/lib/legal/content"

export function LegalSettingsPanel() {
  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Policies</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Link
            href="/terms"
            className="rounded-lg border border-border/40 px-4 py-3 text-sm hover:border-primary/30 hover:bg-muted/30"
          >
            Terms of Use
          </Link>
          <Link
            href="/privacy"
            className="rounded-lg border border-border/40 px-4 py-3 text-sm hover:border-primary/30 hover:bg-muted/30"
          >
            Privacy Policy
          </Link>
          <Link
            href="/risk-disclaimer"
            className="rounded-lg border border-border/40 px-4 py-3 text-sm hover:border-primary/30 hover:bg-muted/30"
          >
            Risk Disclaimer
          </Link>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Educational disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {EDUCATIONAL_DISCLAIMER.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
