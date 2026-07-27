import { createClient } from "@supabase/supabase-js";
import { CURATED_LOCATIONS } from "../data/curated-locations";
import { SOURCED_IMAGES } from "../data/sourced-images";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before seeding.");
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const rows = CURATED_LOCATIONS.map((location) => ({
  id: location.id,
  slug: location.slug,
  name: location.name,
  tagline: location.tagline,
  description: location.description,
  long_description: location.longDescription ?? null,
  category: location.category,
  difficulty: location.difficulty,
  region: location.region,
  lat: location.coordinates.lat,
  lng: location.coordinates.lng,
  // Never seed the old generic Unsplash placeholders. Destinations without a
  // verified photograph use the app's neutral social image in the database;
  // the UI itself renders the designed category fallback.
  hero_image_url: SOURCED_IMAGES[location.id]?.[0]?.url ?? "/og.png",
  hero_image_alt: location.name,
  tags: location.tags,
  best_season: location.bestSeason,
  travel_time_minutes: location.travelTimeMinutes,
  visit_duration_min: location.visitDurationHours.min,
  visit_duration_max: location.visitDurationHours.max,
  highlights: location.highlights,
  tips: location.tips,
  what_to_bring: location.whatToBring,
  access_info: location.accessInfo,
  parking_available: location.parkingAvailable,
  public_transport: location.publicTransport,
  elevation: location.elevation ?? null,
  distance_km: location.distanceKm ?? null,
  is_featured: location.isFeatured,
  is_new: location.isNew,
  is_published: true,
  view_count: location.viewCount,
  save_count: location.saveCount,
  created_at: location.createdAt,
  updated_at: location.updatedAt,
}));

for (let index = 0; index < rows.length; index += 100) {
  const { error } = await supabase
    .from("locations")
    .upsert(rows.slice(index, index + 100), { onConflict: "id" });
  if (error) throw error;
}

const images = CURATED_LOCATIONS.flatMap((location) =>
  (SOURCED_IMAGES[location.id] ?? []).map((image, index) => ({
    id: image.id,
    location_id: location.id,
    url: image.url,
    alt: image.alt,
    width: image.width ?? null,
    height: image.height ?? null,
    credit: image.credit ?? null,
    sort_order: index,
  }))
);

for (let index = 0; index < images.length; index += 100) {
  const { error } = await supabase
    .from("location_images")
    .upsert(images.slice(index, index + 100), { onConflict: "id" });
  if (error) throw error;
}

console.log(`Seeded ${rows.length} locations and ${images.length} images.`);
