import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_PATHS = ["/explore", "/map", "/favorites", "/trip", "/profile", "/hike-buddy"];
const AUTH_PATHS = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_MOCK_MODE === "true") return NextResponse.next();

  const { response, user, supabase } = await updateSession(request);
  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  const isAuthPage = AUTH_PATHS.some((path) => pathname.startsWith(path));
  const isAdminPage = pathname.startsWith("/admin");

  if ((isProtected || isAdminPage) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminPage && user) {
    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/explore", request.url));
    }
  }

  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/explore", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fonts|images|og-image|site.webmanifest).*)"],
};
