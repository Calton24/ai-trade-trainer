import type { SupabaseClient } from "@supabase/supabase-js"

import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import type { StorageBucket } from "@/lib/storage/paths"

/**
 * Server-side storage access.
 *
 * `getServerStorageClient()` is cookie/RLS-based — same access rules as the
 * signed-in user, safe for server actions/route handlers acting on behalf
 * of the current request's user.
 *
 * `getAdminStorageClient()` uses the service-role key and bypasses RLS
 * entirely. Only use it for lesson-assets/library-assets writes (the two
 * buckets whose storage.objects policies intentionally grant no
 * authenticated/anon write access — see migration 014) from trusted
 * admin/CMS code paths. Never expose this client to the browser.
 */

export async function getServerStorageClient(): Promise<SupabaseClient> {
  return createClient()
}

export function getAdminStorageClient(): SupabaseClient {
  return createAdminClient()
}

export function isAdminStorageConfigured(): boolean {
  return isAdminConfigured()
}

/** Admin-only write for lesson-assets / library-assets (service role bypasses RLS). */
export async function uploadAdminAsset(
  bucket: Extract<StorageBucket, "lesson-assets" | "library-assets">,
  path: string,
  file: File | Blob | Buffer,
  options?: { upsert?: boolean; contentType?: string }
): Promise<{ error?: string }> {
  const admin = getAdminStorageClient()
  const { error } = await admin.storage.from(bucket).upload(path, file, {
    upsert: options?.upsert ?? true,
    contentType: options?.contentType,
  })
  if (error) return { error: error.message }
  return {}
}

export async function removeAdminAsset(
  bucket: Extract<StorageBucket, "lesson-assets" | "library-assets">,
  path: string
): Promise<{ error?: string }> {
  const admin = getAdminStorageClient()
  const { error } = await admin.storage.from(bucket).remove([path])
  if (error) return { error: error.message }
  return {}
}

export function getPublicUrlServer(bucket: StorageBucket, path: string): string {
  const admin = getAdminStorageClient()
  return admin.storage.from(bucket).getPublicUrl(path).data.publicUrl
}
