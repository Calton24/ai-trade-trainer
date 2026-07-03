# Storage — TradeTrainer Academy

Scaffold for Supabase Storage. Migration: [`supabase/migrations/014_storage_buckets.sql`](../supabase/migrations/014_storage_buckets.sql) (not yet applied — see [Applying](#applying) below). App-side helpers: `lib/storage/`.

This is a **scaffold**, not a full feature. Only the avatar upload flow is wired into the UI (`/settings/profile`). Journal images, chart screenshots, lesson assets, library assets, and community images have buckets, RLS policies, path helpers, and upload functions ready to use, but no UI calls them yet.

## Buckets

| Bucket | Public? | Who can write | Who can read |
|---|---|---|---|
| `avatars` | Yes | Owner (upload/update/delete own folder) | Anyone |
| `journal-images` | No | Owner only | Owner only |
| `chart-screenshots` | No | Owner only | Owner only |
| `lesson-assets` | Yes | Service role only (admin/CMS) | Anyone |
| `library-assets` | Yes | Service role only (admin/CMS) | Anyone |
| `community-images` | Yes | Owner (upload only — no update/delete once posted) | Anyone |

File-size limits and allowed MIME types are enforced at the bucket level (see migration `014`): 2MB for avatars, 5MB for journal/chart/community images, 10MB for lesson/library assets (images + PDF).

## Path convention

**Important:** the bucket is a separate dimension from the object path — Supabase Storage doesn't repeat the bucket name inside `storage.objects.name`. When you see `avatars/{userId}/avatar.png` below, that means **bucket** `avatars`, **path** `{userId}/avatar.png`.

| Bucket | Path | Helper (`lib/storage/paths.ts`) |
|---|---|---|
| `avatars` | `{userId}/avatar.png` | `getAvatarPath(userId)` |
| `journal-images` | `{userId}/{entryId}/{filename}` | `getJournalImagePath(userId, entryId, filename)` |
| `chart-screenshots` | `{userId}/{sessionId}/{filename}` | `getChartScreenshotPath(userId, sessionId, filename)` |
| `lesson-assets` | `{lessonId}/{filename}` | `getLessonAssetPath(lessonId, filename)` |
| `library-assets` | `{bookSlug}/{filename}` | `getLibraryAssetPath(bookSlug, filename)` |
| `community-images` | `{userId}/{postId}/{filename}` | `getCommunityImagePath(userId, postId, filename)` |

The leading `{userId}` segment is what every owner-scoped RLS policy checks via `storage.foldername(name)[1] = auth.uid()::text` — uploading to any path that doesn't start with your own user id is rejected by Postgres, not just the app.

## RLS model (`storage.objects`)

Same shape as every table in the main schema: policies filtered by `bucket_id`, scoped by the leading folder segment.

- **`avatars`** — `select` open to everyone (public bucket); `insert`/`update`/`delete` require `auth.uid() = (storage.foldername(name))[1]`.
- **`journal-images` / `chart-screenshots`** — single `for all` policy requiring `auth.uid() = (storage.foldername(name))[1]` for every operation (select included — these are private buckets, so there's no public-URL bypass).
- **`lesson-assets` / `library-assets`** — `select` open to everyone; **no** insert/update/delete policy for `authenticated`/`anon` at all, so only the service-role key (which bypasses RLS) can write. Use `lib/storage/server.ts`'s `uploadAdminAsset()` from trusted admin/CMS code — never from a client component.
- **`community-images`** — `select` open to everyone; `insert` requires ownership of the folder; deliberately **no update/delete policy** — once a community image is uploaded it's immutable via storage (moderation-friendly).

## App-side helpers (`lib/storage/`)

- **`paths.ts`** — pure path builders + `STORAGE_BUCKETS` bucket-id constants. No Supabase dependency.
- **`client.ts`** (`"use client"`) — browser-side primitives (`uploadFile`, `removeFile`, `getPublicUrl`, `getSignedUrl`) using the anon/browser Supabase client. Everything goes through the RLS policies above — use this for the four user-owned buckets.
- **`server.ts`** — server-side primitives. `getServerStorageClient()` is cookie/RLS-based (same rules as the signed-in user); `getAdminStorageClient()` / `uploadAdminAsset()` / `removeAdminAsset()` use the service-role key and are the *only* way to write to `lesson-assets`/`library-assets`. Server-only — never import into a client component.
- **`upload-service.ts`** (`"use client"`) — the high-level functions product code should actually call: `uploadAvatar(file)`, `uploadJournalImage(entryId, file)`, `uploadChartScreenshot(sessionId, file)`, `getPublicAssetUrl(bucket, path)`, `deleteUserFile(bucket, path)`. These resolve the current user via `auth.getUser()`, validate file type (`image/*`) and size (2MB for avatars, 5MB otherwise) before uploading, and build the path for you — callers never construct a path by hand.

`journal-images` and `chart-screenshots` are private buckets, so `uploadJournalImage`/`uploadChartScreenshot` return a **path**, not a public URL — display them with `getSignedUrl()` from `lib/storage/client.ts` (time-limited, RLS-checked) when that UI gets built.

## What's wired into the UI today

Only **avatar upload** on `/settings/profile` (`components/settings/avatar-upload.tsx`): file picker → `uploadAvatar()` → live preview → `profiles.avatar_url` updated in local form state → persisted on the existing "Save profile" click (same flow the old raw avatar-URL text field used). Includes remove-avatar, client-side type/size validation, and inline loading/error/success states. Only shown for Supabase-authenticated accounts; local/demo-mode accounts keep the plain URL field.

Journal images, chart screenshots, lesson assets, library assets, and community images are **not** wired into any UI yet — buckets, RLS, and helper functions are ready for whenever those features are built.

## Applying

```bash
supabase db push
```

Applies `014_storage_buckets.sql` (and `013`, if not already applied) to the linked project. Idempotent — bucket inserts use `on conflict (id) do update`, and every policy is dropped-and-recreated, so it's safe to re-run.
