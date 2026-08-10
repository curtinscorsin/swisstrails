import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fulfillCompletedCheckout } from "@/lib/payments";
import { getStripe } from "@/lib/stripe";
import { salesConfigurationReady } from "@/lib/launch-server";

export async function POST(req: NextRequest) {
  if (!salesConfigurationReady()) {
    return NextResponse.json({ error: "Purchases are not open" }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId } = await req.json() as { sessionId?: string };
  if (!sessionId?.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid checkout session" }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const ownerId = session.metadata?.userId ?? session.client_reference_id;
    if (ownerId !== user.id) {
      return NextResponse.json({ error: "Checkout does not belong to this account" }, { status: 403 });
    }
    await fulfillCompletedCheckout(session);
    return NextResponse.json({ active: true });
  } catch (error) {
    console.error("Checkout confirmation failed:", error);
    return NextResponse.json({ active: false }, { status: 409 });
  }
}
