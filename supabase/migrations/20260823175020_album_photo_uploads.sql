alter table public.album_stickers
  drop constraint if exists album_stickers_image_check;

alter table public.album_stickers
  add constraint album_stickers_image_path_check
  check (image ~ '^[0-9a-fA-F-]{36}/[0-9a-fA-F-]{36}\.(jpg|jpeg|png|webp)$');

grant insert on table public.album_stickers to authenticated;

drop policy if exists "Users can insert their own album stickers" on public.album_stickers;
create policy "Users can insert their own album stickers"
  on public.album_stickers
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'album-stickers',
  'album-stickers',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can upload own album photos" on storage.objects;
create policy "Users can upload own album photos"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'album-stickers'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Users can read own album photos" on storage.objects;
create policy "Users can read own album photos"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'album-stickers'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Users can delete own album photos" on storage.objects;
create policy "Users can delete own album photos"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'album-stickers'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
