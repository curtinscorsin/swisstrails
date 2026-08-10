import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PAID_PATHS = ["/explore", "/map", "/favorites", "/trip", "/hike-buddy", "/location"];
const ACCOUNT_PATHS = ["/profile", "/account", "/checkout"];
const AUTH_PATHS = ["/login", "/signup"];
type AccessProfile = { role: "user" | "admin"; has_purchased: boolean };

function redirectPreservingSession(response: NextResponse, url: URL) {
  const redirect = NextResponse.redirect(url);
  for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
  return redirect;
}

export async function middleware(request: NextRequest) {
  const mockPreview =
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_MOCK_MODE === "true";
  if (mockPreview) return NextResponse.next();

  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  if (!hasSupabaseConfig) {
    if (request.nextUrl.pathname === "/service-unavailable") {
      return NextResponse.next();
    }
    const unavailable = request.nextUrl.clone();
    unavailable.pathname = "/service-unavailable";
    unavailable.search = "";
    return NextResponse.redirect(unavailable, 307);
  }

  const { response, user, supabase } = await updateSession(request);
  const pathname = request.nextUrl.pathname;
  const isPaidPage = PAID_PATHS.some((path) => pathname.startsWith(path));
  const isAccountPage = ACCOUNT_PATHS.some((path) => pathname.startsWith(path));
  const isAuthPage = AUTH_PATHS.some((path) => pathname.startsWith(path));
  const isAdminPage = pathname.startsWith("/admin");

  if ((isPaidPage || isAccountPage || isAdminPage) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return redirectPreservingSession(response, url);
  }

  let profile: AccessProfile | null = null;
  if (user && (isPaidPage || isAccountPage || isAdminPage || isAuthPage)) {
    const { data } = await (supabase as any)
      .from("profiles")
      .select("role,has_purchased")
      .eq("id", user.id)
      .maybeSingle();
    profile = data as AccessProfile | null;
  }

  if (isAdminPage && user) {
    if (profile?.role !== "admin") {
      const target = profile?.has_purchased ? "/explore" : "/checkout";
      return redirectPreservingSession(response, new URL(target, request.url));
    }
  }

  if (isPaidPage && user && !profile?.has_purchased && profile?.role !== "admin") {
    const url = new URL("/checkout", request.url);
    url.searchParams.set("next", pathname);
    return redirectPreservingSession(response, url);
  }

  if (isAuthPage && user) {
    const target = profile?.has_purchased || profile?.role === "admin" ? "/explore" : "/checkout";
    return redirectPreservingSession(response, new URL(target, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fonts|images|og-image|site.webmanifest|sw.js).*)"],
};
