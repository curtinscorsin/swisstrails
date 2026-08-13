import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/checkout";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return privateRedirect(safeNext, request.url);
  }

  return privateRedirect("/login?error=oauth_failed", request.url);
}

function privateRedirect(path: string, requestUrl: string) {
  const response = NextResponse.redirect(new URL(path, requestUrl));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
