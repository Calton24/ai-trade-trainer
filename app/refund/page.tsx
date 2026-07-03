import type { Metadata } from "next"

import { LegalDocumentPage } from "@/components/legal/legal-document-page"

export const metadata: Metadata = {
  title: "Refund / Cancellation Policy",
}

export default function RefundPage() {
  return (
    <LegalDocumentPage
      docKey="refund"
      title="Refund / Cancellation Policy"
    />
  )
}
