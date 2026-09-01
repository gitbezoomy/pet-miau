create schema if not exists private;
revoke all on schema private from public, anon, service_role;
grant usage on schema private to authenticated;

create or replace function private.can_upload_album_photo()
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then
    return false;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(current_user_id::text, 0));

  return (
    select count(*) < 30
    from storage.objects
    where bucket_id = 'album-stickers'
      and (storage.foldername(name))[1] = current_user_id::text
  );
end;
$function$;

create or replace function private.can_insert_album_sticker()
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then
    return false;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(current_user_id::text, 0));

  return (
    select count(*) < 30
    from public.album_stickers
    where user_id = current_user_id
  );
end;
$function$;

revoke execute on function private.can_upload_album_photo() from public, anon, service_role;
revoke execute on function private.can_insert_album_sticker() from public, anon, service_role;
grant execute on function private.can_upload_album_photo() to authenticated;
grant execute on function private.can_insert_album_sticker() to authenticated;

drop policy if exists "Users can upload own album photos" on storage.objects;
create policy "Users can upload own album photos"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'album-stickers'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select private.can_upload_album_photo())
  );

drop policy if exists "Users can insert their own album stickers" on public.album_stickers;
create policy "Users can insert their own album stickers"
  on public.album_stickers
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and (select private.can_insert_album_sticker())
  );
