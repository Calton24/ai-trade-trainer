import Link from "next/link"

import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { LEGAL_DOCUMENTS } from "@/lib/legal/content"

export function LegalDocumentPage({
  docKey,
  title,
}: {
  docKey: keyof typeof LEGAL_DOCUMENTS
  title: string
}) {
  const sections = LEGAL_DOCUMENTS[docKey]

  return (
    <div className="min-h-svh">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-GB")}
        </p>
        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.id}>
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                {section.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-12 text-sm text-muted-foreground">
          <Link href="/settings/legal" className="text-primary hover:underline">
            Back to settings
          </Link>
          {" · "}
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  )
}
