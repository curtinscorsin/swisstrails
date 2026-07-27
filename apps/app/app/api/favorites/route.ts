import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type FavoriteRow = { location_id: string };

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await (supabase as any)
    .from("favorites")
    .select("location_id")
    .eq("user_id", user.id);

  if (error || !data) {
    return NextResponse.json({ favoriteIds: [] });
  }

  return NextResponse.json({ favoriteIds: data.map((f: FavoriteRow) => f.location_id) });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { locationId } = await req.json();
  if (!locationId) {
    return NextResponse.json({ error: "Location ID required" }, { status: 400 });
  }

  const { error } = await (supabase as any).from("favorites").insert({
    user_id: user.id,
    location_id: locationId,
  });

  if (error) {
    const err = error as { code?: string };
    if (err.code === "23505") {
      return NextResponse.json({ message: "Already favorited" });
    }
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
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
  const { error } = await (supabase as any)
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("location_id", locationId);

  if (error) return NextResponse.json({ error: "Failed to remove" }, { status: 500 });
  return NextResponse.json({ success: true });
}
