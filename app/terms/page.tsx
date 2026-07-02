import type { Metadata } from "next"

import { LegalDocumentPage } from "@/components/legal/legal-document-page"

export const metadata: Metadata = {
  title: "Terms of Use",
}

export default function TermsPage() {
  return <LegalDocumentPage docKey="terms" title="Terms of Use" />
}
