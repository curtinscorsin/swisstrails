#!/usr/bin/env tsx

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const repositoryRoot = resolve(process.cwd(), "../..");
const failures: string[] = [];

function check(condition: unknown, message: string) {
  if (!condition) failures.push(message);
}

function read(relativePath: string) {
  return readFileSync(resolve(repositoryRoot, relativePath), "utf8");
}

const rootVercel = JSON.parse(read("vercel.json")) as {
  build?: { env?: Record<string, string> };
};
check(
  rootVercel.build?.env?.NEXT_PUBLIC_MOCK_MODE === "false",
  "Root Vercel config must never enable Demo Mode"
);

const middleware = read("apps/app/middleware.ts");
check(middleware.includes('process.env.NODE_ENV !== "production"'), "Demo Mode must be disabled in production code");
check(middleware.includes('"/location"'), "Location detail routes must be included in paid access control");
check(middleware.includes("has_purchased"), "Paid routes must check the purchase entitlement");

const loginPage = read("apps/app/app/(auth)/login/page.tsx");
check(
  loginPage.includes("NEXT_PUBLIC_GOOGLE_AUTH_ENABLED"),
  "Google sign-in must be protected by a production feature flag"
);
check(loginPage.includes("captchaToken"), "Email sign-in must pass the CAPTCHA token to Supabase");

const verificationPanel = read("apps/app/components/app/route-verification.tsx");
check(
  verificationPanel.includes("Destination information only — route logistics unverified"),
  "Destination-only pages must show a prominent unresolved-logistics warning"
);

const migration = read("apps/app/supabase/migrations/20260810111955_production_access_security.sql");
check(migration.includes("private.has_paid_access"), "Database paid-access policy is missing");
check(migration.includes("grant update (name, avatar_url)"), "Sensitive profile columns are not restricted");

for (const file of [
  "apps/app/public/sw.js",
  "apps/app/public/site.webmanifest",
  "apps/app/public/icon-192x192.png",
  "apps/app/public/icon-512x512.png",
  "apps/app/app/offline/page.tsx",
  "apps/app/app/service-unavailable/page.tsx",
  "apps/app/app/api/health/route.ts",
  "apps/app/app/.well-known/security.txt/route.ts",
  "apps/marketing/app/privacy/page.tsx",
  "apps/marketing/app/terms/page.tsx",
]) {
  check(existsSync(resolve(repositoryRoot, file)), `Required launch file missing: ${file}`);
}

const marketingText = [
  read("apps/marketing/components/marketing/faq.tsx"),
  read("apps/marketing/components/marketing/social-proof.tsx"),
  read("apps/marketing/data/categories.ts"),
].join("\n");
check(!marketingText.includes("Sixty-one"), "Stale photograph count remains in marketing copy");
check(!marketingText.includes("Separate destination and access coordinates"), "Over-broad access-coordinate claim remains");
check(!marketingText.includes("New places only after manual verification"), "Unsupported manual-verification claim remains");

const explorePage = read("apps/app/app/(app)/explore/page.tsx");
check(
  explorePage.includes("CATALOGUE_METRICS.lastEditorialCheck"),
  "Explore must derive its catalogue update date from the shared metrics"
);

const launchSetup = read("LAUNCH_SETUP.md");
check(!launchSetup.includes("three image placeholders"), "Launch checklist still claims image placeholders exist");

const activeStripeIntegration = read("apps/app/lib/stripe.ts");
check(
  !activeStripeIntegration.includes("payment_method_types"),
  "Stripe Checkout must use Dashboard-managed dynamic payment methods"
);

const reviewedContent = read("apps/app/data/reviewed-location-enrichments.ts");
check(
  !/no (?:modern )?legally reusable(?: exact-location)? photograph/i.test(reviewedContent),
  "Published copy still claims that a location with a sourced gallery has no verified photograph"
);

if (process.argv.includes("--production")) {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_GOOGLE_AUTH_ENABLED",
    "NEXT_PUBLIC_SALES_ENABLED",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_PRICE_ID",
    "LEGAL_OPERATOR_NAME",
    "LEGAL_OPERATOR_ADDRESS",
    "LEGAL_OPERATOR_COUNTRY",
    "LEGAL_VAT_STATUS",
    "REFUND_POLICY_SUMMARY",
    "SUPPORT_EMAIL",
    "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  ];
  for (const key of required) check(Boolean(process.env[key]?.trim()), `Production environment missing ${key}`);
  check(process.env.NEXT_PUBLIC_MOCK_MODE === "false", "Production NEXT_PUBLIC_MOCK_MODE must be false");
  check(process.env.NEXT_PUBLIC_SALES_ENABLED === "true", "Production sales switch is not enabled");
  check(process.env.NEXT_PUBLIC_APP_URL === "https://app.swiss-trails.com", "Production app URL is incorrect");
}

if (failures.length) {
  console.error(`Launch readiness audit failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Launch readiness audit passed");
console.log("- production Demo Mode is fail-closed");
console.log("- paid route and database access controls are present");
console.log("- legal, PWA and shared catalogue-trust files are present");
console.log("- stale public catalogue claims were not found");
