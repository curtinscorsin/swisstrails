import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const REQUIRED_PUBLIC_CONFIG = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

export async function GET() {
  const missing = REQUIRED_PUBLIC_CONFIG.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    return NextResponse.json(
      { status: "unavailable", checkedAt: new Date().toISOString() },
      {
        status: 503,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4_000);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/health`,
      {
        headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! },
        cache: "no-store",
        signal: controller.signal,
      }
    );

    return NextResponse.json(
      {
        status: response.ok ? "ok" : "degraded",
        checkedAt: new Date().toISOString(),
      },
      {
        status: response.ok ? 200 : 503,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  } catch {
    return NextResponse.json(
      { status: "degraded", checkedAt: new Date().toISOString() },
      {
        status: 503,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  } finally {
    clearTimeout(timeout);
  }
}
