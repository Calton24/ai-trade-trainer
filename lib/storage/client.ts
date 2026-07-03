"use client"

import type { SupabaseClient } from "@supabase/supabase-js"

import { createClient, createClientIfConfigured } from "@/lib/supabase/client"
import type { StorageBucket } from "@/lib/storage/paths"

/**
 * Browser-side storage access. Uses the anon/browser Supabase client, so all
 * operations go through the storage.objects RLS policies from migration 014
 * (see supabase/migrations/014_storage_buckets.sql and docs/storage.md).
 *
 * Only use this for the user-owned buckets (avatars, journal-images,
 * chart-screenshots, community-images). lesson-assets/library-assets are
 * service-role write only — see lib/storage/server.ts for those.
 */

export function getStorageClient(): SupabaseClient {
  return createClient()
}

export function getStorageClientIfConfigured(): SupabaseClient | null {
  return createClientIfConfigured()
}

export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  file: File | Blob,
  options?: { upsert?: boolean; contentType?: string }
): Promise<{ error?: string }> {
  const supabase = getStorageClient()
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: options?.upsert ?? false,
    contentType: options?.contentType ?? (file instanceof File ? file.type : undefined),
  })
  if (error) return { error: error.message }
  return {}
}

export async function removeFile(
  bucket: StorageBucket,
  path: string
): Promise<{ error?: string }> {
  const supabase = getStorageClient()
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) return { error: error.message }
  return {}
}

export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const supabase = getStorageClient()
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}

/** For private buckets (journal-images, chart-screenshots) — public URLs 404. */
export async function getSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresInSeconds = 3600
): Promise<{ url?: string; error?: string }> {
  const supabase = getStorageClient()
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds)
  if (error || !data) return { error: error?.message ?? "Failed to sign URL" }
  return { url: data.signedUrl }
}
