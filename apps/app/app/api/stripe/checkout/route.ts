import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in before purchasing" },
        { status: 401 }
      );
    }
    const body = await req.json();
    const email = body.email ?? user.email;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const url = await createCheckoutSession(user.id, email);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
