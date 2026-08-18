import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { missingSalesConfiguration, salesConfigurationReady } from "@/lib/launch-server";

// Payment configuration and authentication must always be evaluated at request
// time; never allow this endpoint to be treated as static deployment output.
export const dynamic = "force-dynamic";

function validRequestOrigin(req: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;
  const origin = req.headers.get("origin");
  if (!configuredUrl || !origin) return false;
  return new URL(origin).origin === new URL(configuredUrl).origin;
}

export async function POST(req: NextRequest) {
  try {
    if (!salesConfigurationReady()) {
      const missingConfiguration = missingSalesConfiguration();
      console.error("Checkout disabled; missing launch configuration:", missingConfiguration);
      return NextResponse.json(
        {
          error: "Purchases are not open yet. Please try again later.",
          // Environment-variable names are not secrets. Returning names only
          // makes production setup diagnosable without exposing their values.
          missingConfiguration,
        },
        { status: 503 }
      );
    }
    if (!validRequestOrigin(req)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in before purchasing" },
        { status: 401 }
      );
    }
    if (!user.email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const { data: profile, error: profileError } = await (supabase as any)
      .from("profiles")
      .select("has_purchased,stripe_customer_id")
      .eq("id", user.id)
      .single();
    if (profileError) throw profileError;
    const purchaseProfile = profile as { has_purchased: boolean; stripe_customer_id: string | null };
    if (purchaseProfile.has_purchased) {
      return NextResponse.json({ error: "Access is already active", redirect: "/explore" }, { status: 409 });
    }

    const url = await createCheckoutSession(user.id, user.email, purchaseProfile.stripe_customer_id);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Checkout error:", error);
    const stripeFailure =
      error && typeof error === "object"
        ? {
            type: "type" in error && typeof error.type === "string" ? error.type : undefined,
            code: "code" in error && typeof error.code === "string" ? error.code : undefined,
            param: "param" in error && typeof error.param === "string" ? error.param : undefined,
            message:
              "type" in error &&
              typeof error.type === "string" &&
              error.type.startsWith("Stripe") &&
              "message" in error &&
              typeof error.message === "string"
                ? error.message
                : undefined,
          }
        : undefined;
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        // Stripe's machine-readable type/code contain no key or card data and
        // let operators distinguish account, permission and resource issues.
        stripeFailure,
      },
      { status: 500 }
    );
  }
}
