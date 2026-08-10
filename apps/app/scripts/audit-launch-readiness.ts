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

const migration = read("apps/app/supabase/migrations/20260810111955_production_access_security.sql");
check(migration.includes("private.has_paid_access"), "Database paid-access policy is missing");
check(migration.includes("grant update (name, avatar_url)"), "Sensitive profile columns are not restricted");

for (const file of [
  "apps/app/public/sw.js",
  "apps/app/public/site.webmanifest",
  "apps/app/public/icon-192x192.png",
  "apps/app/public/icon-512x512.png",
  "apps/app/app/offline/page.tsx",
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

if (process.argv.includes("--production")) {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_SALES_ENABLED",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_PRICE_ID",
    "LEGAL_OPERATOR_NAME",
    "LEGAL_OPERATOR_ADDRESS",
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
