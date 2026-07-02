import type { Metadata } from "next"

import { LegalDocumentPage } from "@/components/legal/legal-document-page"

export const metadata: Metadata = {
  title: "Risk Disclaimer",
}

export default function RiskDisclaimerPage() {
  return <LegalDocumentPage docKey="risk" title="Risk Disclaimer" />
}
