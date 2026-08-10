import "server-only";

import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";

export async function fulfillCompletedCheckout(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId ?? session.client_reference_id;
  if (!userId) throw new Error("Checkout session has no Swiss Trails user ID");
  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
    throw new Error(`Checkout session is not paid (${session.payment_status})`);
  }
  if (session.amount_total == null || !session.currency) {
    throw new Error("Checkout session is missing amount or currency");
  }

  const supabase = await createAdminClient();
  // The generated database type intentionally remains conservative while the
  // production schema is managed by SQL migrations.
  const db = supabase as any;
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : null;

  const { error: purchaseError } = await db.from("purchases").upsert({
    user_id: userId,
    stripe_session_id: session.id,
    stripe_payment_intent_id: paymentIntentId,
    amount: session.amount_total / 100,
    currency: session.currency,
    status: "completed",
  }, { onConflict: "stripe_session_id" });
  if (purchaseError) throw new Error(`Could not record purchase: ${purchaseError.message}`);

  const { error: profileError } = await db
    .from("profiles")
    .update({
      has_purchased: true,
      purchased_at: new Date().toISOString(),
      stripe_customer_id:
        typeof session.customer === "string" ? session.customer : null,
    })
    .eq("id", userId);
  if (profileError) throw new Error(`Could not activate access: ${profileError.message}`);

  return userId;
}

export async function revokeFullyRefundedPurchase(charge: Stripe.Charge) {
  if (charge.amount_refunded < charge.amount) return;
  const paymentIntentId =
    typeof charge.payment_intent === "string" ? charge.payment_intent : null;
  if (!paymentIntentId) throw new Error("Refunded charge has no payment intent");

  const supabase = await createAdminClient();
  const db = supabase as any;
  const { data: purchase, error: purchaseError } = await db
    .from("purchases")
    .update({ status: "refunded" })
    .eq("stripe_payment_intent_id", paymentIntentId)
    .select("user_id")
    .maybeSingle();
  if (purchaseError) throw new Error(`Could not record refund: ${purchaseError.message}`);
  if (!purchase?.user_id) return;

  const { count, error: countError } = await db
    .from("purchases")
    .select("id", { count: "exact", head: true })
    .eq("user_id", purchase.user_id)
    .eq("status", "completed");
  if (countError) throw new Error(`Could not review remaining purchases: ${countError.message}`);

  if ((count ?? 0) === 0) {
    const { error: profileError } = await db
      .from("profiles")
      .update({ has_purchased: false, purchased_at: null })
      .eq("id", purchase.user_id);
    if (profileError) throw new Error(`Could not revoke refunded access: ${profileError.message}`);
  }
}
