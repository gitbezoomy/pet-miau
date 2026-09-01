grant update, delete on table public.album_stickers to authenticated;

drop policy if exists "Users can update their own album stickers" on public.album_stickers;
create policy "Users can update their own album stickers"
  on public.album_stickers
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own album stickers" on public.album_stickers;
create policy "Users can delete their own album stickers"
  on public.album_stickers
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
