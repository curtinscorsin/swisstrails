import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/explore";
  const supabase = await createClient();

  // Supabase can return either a PKCE authorization code (the default hosted
  // email flow) or a token hash (when the email template is customized). Both
  // are official flows and both must establish the same cookie-based session.
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return privateRedirect(safeNext, request.url);
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return privateRedirect(safeNext, request.url);
  }

  return privateRedirect("/login?error=confirmation_failed", request.url);
}

function privateRedirect(path: string, requestUrl: string) {
  const response = NextResponse.redirect(new URL(path, requestUrl));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
