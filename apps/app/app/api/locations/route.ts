import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CURATED_LOCATIONS } from "@/data/curated-locations";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const region = searchParams.get("region");
  const difficulty = searchParams.get("difficulty");
  const q = searchParams.get("q")?.toLowerCase();

  const locations = CURATED_LOCATIONS.filter((location) => {
    if (category && location.category !== category) return false;
    if (region && location.region !== region) return false;
    if (difficulty && location.difficulty !== difficulty) return false;
    if (!q) return true;
    return [location.name, location.tagline, location.description]
      .join(" ")
      .toLowerCase()
      .includes(q);
  }).sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));

  return NextResponse.json({ locations, total: locations.length });
}
