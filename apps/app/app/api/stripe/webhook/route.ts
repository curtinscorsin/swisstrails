import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import { fulfillCompletedCheckout, revokeFullyRefundedPurchase } from "@/lib/payments";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(body, signature);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await fulfillCompletedCheckout(event.data.object as Stripe.Checkout.Session);
        break;
      case "charge.refunded":
        await revokeFullyRefundedPurchase(event.data.object as Stripe.Charge);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(`Stripe event ${event.id} could not be processed:`, error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
