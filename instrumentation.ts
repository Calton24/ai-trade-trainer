import type { Instrumentation } from "next"

/**
 * Server-side observability entry point (Next.js file convention — see
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/instrumentation.md).
 * Only initializes Sentry in the Node.js runtime, and only if `SENTRY_DSN`
 * (or `NEXT_PUBLIC_SENTRY_DSN`) is set — a no-op otherwise, so local dev and
 * CI never require a Sentry account. See docs/observability.md.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initSentry } = await import("@/lib/observability/sentry")
    initSentry()
  }
}

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context
) => {
  const { captureError } = await import("@/lib/observability/sentry")
  captureError(error, {
    path: request.path,
    method: request.method,
    routerKind: context.routerKind,
    routePath: context.routePath,
    routeType: context.routeType,
  })
}
