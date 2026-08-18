import Stripe from "stripe";

let stripeClient: Stripe | undefined;

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("Stripe is not configured");
  stripeClient ??= new Stripe(secretKey, {
    apiVersion: "2024-06-20",
    typescript: true,
  });
  return stripeClient;
}

export const STRIPE_CONFIG = {
  PRODUCT_ID: process.env.STRIPE_PRODUCT_ID ?? "",
  PRICE_ID: process.env.STRIPE_PRICE_ID ?? "",
  WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  SUCCESS_URL: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  CANCEL_URL: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
};

export async function createCheckoutSession(
  userId: string,
  email: string,
  customerId?: string | null
): Promise<string> {
  if (!STRIPE_CONFIG.PRICE_ID) throw new Error("Stripe price is not configured");

  const createSession = (existingCustomerId?: string | null) =>
    getStripe().checkout.sessions.create({
      mode: "payment",
      ...(existingCustomerId
        ? { customer: existingCustomerId }
        : { customer_email: email }),
      client_reference_id: userId,
      line_items: [
        {
          price: STRIPE_CONFIG.PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
      success_url: STRIPE_CONFIG.SUCCESS_URL,
      cancel_url: STRIPE_CONFIG.CANCEL_URL,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

  let session: Stripe.Checkout.Session;
  try {
    session = await createSession(customerId);
  } catch (error) {
    // Customer IDs belong to one Stripe account. After changing the connected
    // account, an ID stored by the old account is no longer valid. Retry with
    // the signed-in email so Stripe can create a customer in the live account.
    const missingCustomer =
      Boolean(customerId) &&
      error instanceof Stripe.errors.StripeInvalidRequestError &&
      error.code === "resource_missing";
    if (!missingCustomer) throw error;
    session = await createSession();
  }

  return session.url!;
}

export async function getOrCreateCustomer(
  email: string,
  name?: string
): Promise<string> {
  const stripe = getStripe();
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) return existing.data[0].id;

  const customer = await stripe.customers.create({ email, name });
  return customer.id;
}

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  if (!STRIPE_CONFIG.WEBHOOK_SECRET) throw new Error("Stripe webhook is not configured");
  return getStripe().webhooks.constructEvent(
    payload,
    signature,
    STRIPE_CONFIG.WEBHOOK_SECRET
  );
}
