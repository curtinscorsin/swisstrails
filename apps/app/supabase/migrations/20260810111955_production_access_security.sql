-- Production access hardening
--
-- Grants decide which operations can reach a table through Supabase's Data
-- API. RLS then decides which rows are allowed. Both layers are required.

create or replace function private.has_paid_access()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and (has_purchased = true or role = 'admin')
  );
$$;

revoke all on function private.has_paid_access() from public, anon;
revoke all on function private.is_admin() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.has_paid_access() to authenticated;
grant execute on function private.is_admin() to authenticated;

-- Paid content remains protected even if someone calls the Data API directly
-- instead of navigating through the Next.js middleware.
drop policy if exists "locations_select_authenticated" on public.locations;
create policy "locations_select_paid" on public.locations
  for select to authenticated
  using (is_published = true and (select private.has_paid_access()));

drop policy if exists "favorites_insert_own" on public.favorites;
create policy "favorites_insert_paid_own" on public.favorites
  for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and (select private.has_paid_access())
  );

-- A user owns their profile row, but must never be able to promote themselves
-- or mark their own purchase as complete. Column grants restrict ordinary
-- profile edits to non-sensitive fields.
revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (name, avatar_url) on table public.profiles to authenticated;

revoke all on table public.locations from anon, authenticated;
grant select, insert, update, delete on table public.locations to authenticated;

revoke all on table public.location_images from anon, authenticated;
grant select, insert, update, delete on table public.location_images to authenticated;

revoke all on table public.favorites from anon, authenticated;
grant select, insert, delete on table public.favorites to authenticated;

revoke all on table public.purchases from anon, authenticated;
grant select on table public.purchases to authenticated;

revoke all on table public.testimonials from anon, authenticated;
grant select on table public.testimonials to anon;
grant select, insert, update, delete on table public.testimonials to authenticated;

revoke all on table public.audit_logs from anon, authenticated;
grant select on table public.audit_logs to authenticated;

grant all on table
  public.profiles,
  public.locations,
  public.location_images,
  public.favorites,
  public.purchases,
  public.testimonials,
  public.audit_logs
to service_role;

-- New public tables are private by default. Future migrations must opt each
-- client role into the minimum privileges it actually needs.
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  grant all on tables to service_role;

revoke execute on function public.update_updated_at() from public, anon, authenticated;
