import { redirect } from "next/navigation"

export default async function SignUpAliasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const redirectTo = params.redirect
  const query =
    typeof redirectTo === "string"
      ? `?redirect=${encodeURIComponent(redirectTo)}`
      : ""
  redirect(`/sign-up${query}`)
}
