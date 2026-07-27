import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  let query = supabase
    .from("locations")
    .select("*, location_images(*)", { count: "exact" })
    .eq("is_published", true);
  if (category) query = query.eq("category", category);
  if (region) query = query.eq("region", region);
  if (difficulty) query = query.eq("difficulty", difficulty);
  if (q) query = query.or(`name.ilike.%${q}%,tagline.ilike.%${q}%,description.ilike.%${q}%`);

  const { data, error, count } = await query.order("is_featured", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ locations: data, total: count ?? data.length });
}
