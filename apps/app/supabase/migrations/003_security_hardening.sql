-- Trigger functions are internal implementation details, not public RPC endpoints.
alter function public.update_updated_at() set search_path = '';

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.update_location_save_count() from public, anon, authenticated;

-- Public buckets already allow direct public object URLs. Broad SELECT policies
-- additionally allow listing every object, which the application does not need.
drop policy if exists "public_location_images" on storage.objects;
drop policy if exists "public_profile_images" on storage.objects;
