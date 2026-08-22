import { NextRequest, NextResponse } from "next/server";
import { CURATED_LOCATIONS } from "@/data/curated-locations";
import { createAdminClient, createClient } from "@/lib/supabase/server";

type FavoriteRow = { location_id: string };
type UserMetadata = Record<string, unknown>;

const FAVORITES_KEY = "favorite_location_ids";
const LOCATION_IDS = new Set(CURATED_LOCATIONS.map((location) => location.id));

function metadataFavoriteIds(metadata: UserMetadata | undefined) {
  const value = metadata?.[FAVORITES_KEY];
  if (!Array.isArray(value)) return [];
  return value.filter((id): id is string => typeof id === "string" && LOCATION_IDS.has(id));
}

async function loadAuthFavorites(userId: string) {
  const admin = await createAdminClient();
  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error) {
    return { ids: [] as string[], metadata: {} as UserMetadata, hasStoredValue: false, error };
  }
  const metadata = (data.user.user_metadata ?? {}) as UserMetadata;
  return {
    ids: metadataFavoriteIds(metadata),
    metadata,
    hasStoredValue: Array.isArray(metadata[FAVORITES_KEY]),
    error: null,
  };
}

async function saveAuthFavorites(userId: string, metadata: UserMetadata, ids: string[]) {
  const admin = await createAdminClient();
  return admin.auth.admin.updateUserById(userId, {
    user_metadata: { ...metadata, [FAVORITES_KEY]: ids },
  });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [{ data, error }, authFavorites] = await Promise.all([
    (supabase as any)
    .from("favorites")
    .select("location_id")
    .eq("user_id", user.id),
    loadAuthFavorites(user.id),
  ]);

  if (error && authFavorites.error) {
    console.error("Failed to load favourites", error);
    return NextResponse.json({ error: "Failed to load favourites" }, { status: 500 });
  }

  const databaseIds = ((data ?? []) as FavoriteRow[])
    .map((row) => row.location_id)
    .filter((id) => LOCATION_IDS.has(id));
  const favoriteIds = authFavorites.hasStoredValue
    ? authFavorites.ids
    : databaseIds;

  // One-time migration for accounts that saved favourites before the durable
  // catalogue fallback existed.
  if (!authFavorites.error && !authFavorites.hasStoredValue) {
    const { error: migrationError } = await saveAuthFavorites(
      user.id,
      authFavorites.metadata,
      favoriteIds
    );
    if (migrationError) console.warn("Could not migrate existing favourites", migrationError);
  }

  return NextResponse.json({
    userId: user.id,
    favoriteIds,
  });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { locationId } = await req.json();
  if (typeof locationId !== "string" || !LOCATION_IDS.has(locationId)) {
    return NextResponse.json({ error: "Valid location ID required" }, { status: 400 });
  }

  // Auth metadata is the durable fallback for catalogue entries that have not
  // yet been mirrored into the database locations table. It is account-scoped
  // preference data only and is never used for access control.
  const authFavorites = await loadAuthFavorites(user.id);
  if (authFavorites.error) {
    console.error("Failed to load account favourites", authFavorites.error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
  const nextIds = Array.from(new Set([...authFavorites.ids, locationId]));
  const { error: metadataError } = await saveAuthFavorites(user.id, authFavorites.metadata, nextIds);
  if (metadataError) {
    console.error("Failed to save account favourites", metadataError);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  // Keep the relational table updated whenever its matching location row
  // exists. A stale catalogue mirror must not prevent the account save above.
  const { error } = await (supabase as any).from("favorites").insert({
    user_id: user.id,
    location_id: locationId,
  });

  if (error) {
    const err = error as { code?: string };
    if (err.code === "23505") {
      return NextResponse.json({ message: "Already favourited" });
    }
    console.warn("Favourite saved to account metadata but not relational table", error);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { locationId } = await req.json();
  if (typeof locationId !== "string" || !LOCATION_IDS.has(locationId)) {
    return NextResponse.json({ error: "Valid location ID required" }, { status: 400 });
  }

  const authFavorites = await loadAuthFavorites(user.id);
  if (authFavorites.error) {
    console.error("Failed to load account favourites", authFavorites.error);
    return NextResponse.json({ error: "Failed to remove" }, { status: 500 });
  }
  const nextIds = authFavorites.ids.filter((id) => id !== locationId);
  const { error: metadataError } = await saveAuthFavorites(user.id, authFavorites.metadata, nextIds);
  if (metadataError) {
    console.error("Failed to remove account favourite", metadataError);
    return NextResponse.json({ error: "Failed to remove" }, { status: 500 });
  }

  const { error } = await (supabase as any)
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("location_id", locationId);

  if (error) {
    console.warn("Favourite removed from account metadata but not relational table", error);
  }
  return NextResponse.json({ success: true });
}
