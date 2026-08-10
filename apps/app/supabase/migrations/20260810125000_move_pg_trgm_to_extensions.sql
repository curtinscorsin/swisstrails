-- Keep extension-owned functions out of the public API schema.
alter extension pg_trgm set schema extensions;
