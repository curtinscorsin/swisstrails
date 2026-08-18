import "server-only";

const REQUIRED_SALES_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_APP_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRODUCT_ID",
  "LEGAL_OPERATOR_NAME",
  "LEGAL_OPERATOR_ADDRESS",
  "LEGAL_OPERATOR_COUNTRY",
  "LEGAL_VAT_STATUS",
  "REFUND_POLICY_SUMMARY",
  "SUPPORT_EMAIL",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
] as const;

export function isSalesEnabled() {
  // Production sales are open once every required secret and legal setting is
  // present. Operators can still close checkout immediately with `false`.
  return process.env.NEXT_PUBLIC_SALES_ENABLED !== "false";
}

export function missingSalesConfiguration() {
  return REQUIRED_SALES_ENV.filter((key) => !process.env[key]?.trim());
}

export function salesConfigurationReady() {
  return isSalesEnabled() && missingSalesConfiguration().length === 0;
}

export function isProductionDemoMode() {
  return process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_MOCK_MODE === "true";
}
