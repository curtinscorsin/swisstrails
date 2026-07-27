-- The bundled catalogue uses stable image IDs such as "img-loc-001".
-- Store those IDs as text so the seed can be safely re-run with upserts.
alter table public.location_images
  alter column id drop default,
  alter column id type text using id::text;
