"use client";

import type { Location, LocationImage } from "@/types";
import { useImageOverridesStore } from "@/store/image-overrides-store";
import { SUPABASE_IMAGES_ENABLED } from "@/lib/flags";
import { resolveSourcedImages } from "@/lib/location-image-data";

export { getPrimaryLocationImage, resolveSourcedImages } from "@/lib/location-image-data";

/**
 * Image source-priority model.
 *
 * The effective images for a location resolve by priority, highest first:
 *
 *   1. User / Supabase-uploaded images  ← FUTURE (gated by SUPABASE_IMAGES_ENABLED)
 *   2. Admin override                   ← image-overrides-store (localStorage)
 *   3. Destination-verified sourced images
 *
 * Whichever tier supplies a non-empty list wins outright (no merging across
 * tiers). Within the winning list the FIRST item is treated as the hero/primary.
 */

/**
 * Priority tier #1 — Supabase / user-uploaded images.
 *
 * INSERTION POINT: when Supabase is connected, fetch the location's uploaded
 * `location_images` rows here (highest priority) and return them. Until then,
 * the flag is `false` and this returns `[]`, so resolution falls through to the
 * admin override and then the sourced images.
 */
function resolveSupabaseImages(_location: Location): LocationImage[] {
  if (!SUPABASE_IMAGES_ENABLED) return [];
  // TODO(supabase): return uploaded images for `_location.id` once connected.
  return [];
}

/**
 * Hook — the resolved, priority-ordered images for a location. Subscribes to
 * the admin override store so detail views and cards update live when an admin
 * edits images. Use this everywhere the app renders location photos.
 *
 * Accepts `null` (e.g. a detail sheet with no selection yet) so it can be
 * called unconditionally at the top of a component; returns `[]` in that case.
 */
export function useLocationImages(location: Location | null): LocationImage[] {
  // Subscribe unconditionally — hooks must run on every render. `?? null` keeps
  // the selector stable when there is no location.
  const override = useImageOverridesStore((s) =>
    location ? s.overrides[location.id] : undefined
  );

  if (!location) return [];

  // 1. Supabase / user uploads (future, flag-gated).
  const supabase = resolveSupabaseImages(location);
  if (supabase.length > 0) return supabase;

  // 2. Admin override (localStorage).
  if (override && override.length > 0) return override;

  // 3. Destination-verified Wikimedia / explicit gallery images, deduped.
  return resolveSourcedImages(location);
}
