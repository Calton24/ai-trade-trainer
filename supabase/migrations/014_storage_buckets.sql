-- TradeTrainer Academy — Storage buckets scaffold
-- See docs/storage.md for bucket rules, path conventions, and app-side helpers
-- (lib/storage/*). Non-destructive, idempotent, safe to run multiple times.
--
-- Path convention note: the object `name` stored in storage.objects does NOT
-- repeat the bucket name (the bucket is already a separate dimension via
-- `bucket_id`). So "avatars/{userId}/avatar.png" in the product spec means
-- bucket `avatars`, object name `{userId}/avatar.png` — that's what the
-- policies below check via storage.foldername(name)[1].

-- ─── Buckets ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 2097152, array['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('journal-images', 'journal-images', false, 5242880, array['image/png', 'image/jpeg', 'image/webp']),
  ('chart-screenshots', 'chart-screenshots', false, 5242880, array['image/png', 'image/jpeg', 'image/webp']),
  ('lesson-assets', 'lesson-assets', true, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'application/pdf']),
  ('library-assets', 'library-assets', true, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'application/pdf']),
  ('community-images', 'community-images', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ─── avatars — public read, owner upload/update/delete ─────────────────────
-- Path: {userId}/avatar.png
drop policy if exists "Avatars are publicly readable" on storage.objects;
create policy "Avatars are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Users upload own avatar" on storage.objects;
create policy "Users upload own avatar"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users update own avatar" on storage.objects;
create policy "Users update own avatar"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users delete own avatar" on storage.objects;
create policy "Users delete own avatar"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ─── journal-images — private, fully owner-scoped ───────────────────────────
-- Path: {userId}/{entryId}/{filename}
drop policy if exists "Users manage own journal images" on storage.objects;
create policy "Users manage own journal images"
  on storage.objects for all to authenticated
  using (
    bucket_id = 'journal-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'journal-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ─── chart-screenshots — private, fully owner-scoped ────────────────────────
-- Path: {userId}/{sessionId}/{filename}
drop policy if exists "Users manage own chart screenshots" on storage.objects;
create policy "Users manage own chart screenshots"
  on storage.objects for all to authenticated
  using (
    bucket_id = 'chart-screenshots'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'chart-screenshots'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ─── lesson-assets — public read, service-role write only ──────────────────
-- Path: {lessonId}/{filename}. No insert/update/delete policy is created for
-- authenticated/anon roles on purpose — only the service role (which
-- bypasses RLS entirely) can write. Admin/CMS tooling should use the
-- service-role client (see lib/storage/server.ts).
drop policy if exists "Lesson assets are publicly readable" on storage.objects;
create policy "Lesson assets are publicly readable"
  on storage.objects for select
  using (bucket_id = 'lesson-assets');

-- ─── library-assets — public read, service-role write only ─────────────────
-- Path: {bookSlug}/{filename}
drop policy if exists "Library assets are publicly readable" on storage.objects;
create policy "Library assets are publicly readable"
  on storage.objects for select
  using (bucket_id = 'library-assets');

-- ─── community-images — public read, owner upload only (no edit/delete) ───
-- Path: {userId}/{postId}/{filename}. Intentionally no update/delete policy:
-- once posted to the community feed, images are immutable via storage RLS.
drop policy if exists "Community images are publicly readable" on storage.objects;
create policy "Community images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'community-images');

drop policy if exists "Users upload own community images" on storage.objects;
create policy "Users upload own community images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'community-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
