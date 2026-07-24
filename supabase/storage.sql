-- Morrow — Storage bucket + policies for real file/image uploads.
-- Run once in the Supabase SQL editor, after supabase/schema.sql.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'attachments',
  'attachments',
  true,
  10485760, -- 10 MB
  array['image/png','image/jpeg','image/webp','image/svg+xml','application/pdf']
)
on conflict (id) do update set file_size_limit = excluded.file_size_limit;

-- Storage always enforces RLS on storage.objects (unlike this app's Postgres
-- tables, where RLS is simply left off) — the anon key needs explicit
-- policies scoped to this bucket only.
create policy "attachments public read" on storage.objects for select
  using (bucket_id = 'attachments');
create policy "attachments anon insert" on storage.objects for insert
  with check (bucket_id = 'attachments');
create policy "attachments anon update" on storage.objects for update
  using (bucket_id = 'attachments') with check (bucket_id = 'attachments');
create policy "attachments anon delete" on storage.objects for delete
  using (bucket_id = 'attachments');
