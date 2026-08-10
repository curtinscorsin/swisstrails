import "server-only";

const REQUIRED_SALES_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_APP_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_ID",
  "LEGAL_OPERATOR_NAME",
  "LEGAL_OPERATOR_ADDRESS",
] as const;

export function isSalesEnabled() {
  return process.env.NEXT_PUBLIC_SALES_ENABLED === "true";
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
