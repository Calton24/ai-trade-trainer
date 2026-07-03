/**
 * Client-side observability entry point (Next.js file convention — see
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/instrumentation-client.md).
 * Runs once, before hydration. Initializing Sentry here (rather than in a
 * React provider) means it's in place before any client error can occur.
 * No-ops if `NEXT_PUBLIC_SENTRY_DSN` isn't set. See docs/observability.md.
 */
import { initSentry } from "@/lib/observability/sentry"

initSentry()
