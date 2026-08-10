import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [profileResult, favoritesResult, purchasesResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id,email,name,avatar_url,has_purchased,purchased_at,created_at,updated_at")
      .eq("id", user.id)
      .single(),
    supabase
      .from("favorites")
      .select("location_id,created_at")
      .eq("user_id", user.id),
    supabase
      .from("purchases")
      .select("stripe_session_id,amount,currency,status,created_at,updated_at")
      .eq("user_id", user.id),
  ]);

  const error = profileResult.error ?? favoritesResult.error ?? purchasesResult.error;
  if (error) {
    console.error("Account export failed:", error);
    return NextResponse.json({ error: "Could not prepare your export" }, { status: 500 });
  }

  const exportedAt = new Date().toISOString();
  const body = JSON.stringify({
    service: "Swiss Trails",
    exportedAt,
    profile: profileResult.data,
    favorites: favoritesResult.data ?? [],
    purchases: purchasesResult.data ?? [],
    note: "Trips, visited places, map preference and some reactions are stored only in this browser and are not included in the server export.",
  }, null, 2);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="swiss-trails-data-${exportedAt.slice(0, 10)}.json"`,
      "Cache-Control": "private, no-store, max-age=0",
    },
  });
}
