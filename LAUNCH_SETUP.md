# Swiss Trails launch setup

This file lists the production steps that require the product owner's accounts,
identity, or business decision. Owner-approved legal details were supplied on
17 August 2026; secret account values must still be configured outside Git.

## 1. Publish the legal operator

The owner approved these public details on 17 August 2026:

- operator: `Corsin Curtins / SwissTrails`;
- address: `Gottfried-Kellerstrasse 22, 8192 Glattfelden, Zürich, Switzerland`;
- support: `hello@swiss-trails.com`;
- VAT: not registered, based on the owner's statement that relevant annual
  turnover is below CHF 100,000; reassess this when circumstances change;
- refund: full refund on request within 14 calendar days of purchase. A reason
  is not required; questions about inaccuracies or non-use are optional
  feedback and cannot be a condition of the refund.

Add the approved values to both Vercel projects as `LEGAL_OPERATOR_NAME`,
`LEGAL_OPERATOR_ADDRESS`, `LEGAL_OPERATOR_COUNTRY`, and `SUPPORT_EMAIL`.

## 2. Configure the production Supabase project

Supabase provides sign-in and the customer database. In the **Swiss Trails**
project:

1. Upgrade to a plan that will not pause the production project for inactivity
   and confirm the backup retention you need.
2. Enable multi-factor authentication for every project administrator.
3. Apply every SQL file in `apps/app/supabase/migrations` in timestamp order.
4. Open **Database → Security Advisor** and resolve every finding.
5. Open **Authentication → URL Configuration**:
   - Site URL: `https://app.swiss-trails.com`
   - Redirect URL: `https://app.swiss-trails.com/**`
6. Configure a custom SMTP provider. SMTP is the service that sends branded,
   reliable magic-link emails from your own domain.
7. Enable email confirmation, choose a short OTP expiry, review Auth rate
   limits, and enable CAPTCHA before a public announcement.
8. If Google sign-in remains visible, configure the production Google OAuth
   client and its callback URL. Otherwise remove the Google button before launch.
9. Test Row Level Security with two separate customer accounts: neither account
   may read or change the other's profile, favourites, or purchases.

## 3. Activate Stripe live payments

Stripe cannot accept real money until the account owner completes identity,
business and bank verification.

1. Complete Stripe account activation and payout-bank details.
2. Create a **live-mode** one-time product and CHF 19.90 price.
3. Create the live webhook endpoint:
   `https://app.swiss-trails.com/api/stripe/webhook`
4. Subscribe it to:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `charge.refunded`
5. Enable customer email receipts and verify the legal business details shown
   on Stripe Checkout and receipts.
6. Decide how VAT/tax is handled and ensure the final total shown by Stripe is
   correct for the intended customers.
7. Perform one real low-value purchase, confirm access, issue a full refund,
   and confirm access is removed. Stripe test mode is not enough for this final
   check.

## 4. Set the Vercel production environment

The application and marketing site are separate Vercel projects. Environment
variables are settings stored by Vercel; secret values must never be committed
to Git.

### Application (`app.swiss-trails.com`)

Set:

```text
NEXT_PUBLIC_MOCK_MODE=false
NEXT_PUBLIC_SALES_ENABLED=false
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
NEXT_PUBLIC_APP_URL=https://app.swiss-trails.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_MAPBOX_TOKEN=...
MAPBOX_SECRET_TOKEN=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_PRODUCT_ID=...
STRIPE_PRICE_ID=...
LEGAL_OPERATOR_NAME=Corsin Curtins / SwissTrails
LEGAL_OPERATOR_ADDRESS=Gottfried-Kellerstrasse 22, 8192 Glattfelden, Zürich
LEGAL_OPERATOR_COUNTRY=Switzerland
LEGAL_VAT_STATUS=Not registered for Swiss VAT (operator-declared turnover below CHF 100,000)
REFUND_POLICY_SUMMARY=Full refund available on request within 14 calendar days of purchase; feedback is optional.
SUPPORT_EMAIL=hello@swiss-trails.com
```

Keep `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false` until the Google OAuth client is
configured in Google Cloud, enabled in Supabase and tested on production. The
login page hides the button while this switch is false, so customers never see
a broken authentication option.

### Marketing (`swiss-trails.com`)

Set:

```text
NEXT_PUBLIC_APP_URL=https://app.swiss-trails.com
NEXT_PUBLIC_SALES_ENABLED=false
LEGAL_OPERATOR_NAME=Corsin Curtins / SwissTrails
LEGAL_OPERATOR_ADDRESS=Gottfried-Kellerstrasse 22, 8192 Glattfelden, Zürich
LEGAL_OPERATOR_COUNTRY=Switzerland
LEGAL_VAT_STATUS=Not registered for Swiss VAT (operator-declared turnover below CHF 100,000)
REFUND_POLICY_SUMMARY=Full refund available on request within 14 calendar days of purchase; feedback is optional.
SUPPORT_EMAIL=hello@swiss-trails.com
```

Redeploy both projects. Keep sales disabled while testing. Only after every item
below passes, change `NEXT_PUBLIC_SALES_ENABLED` to `true` in both projects and
redeploy again.

## 5. Complete the editorial sign-off

The catalogue is source-reviewed, not personally inspected on site. Before
launch, a human editor should open all 100 pages and confirm:

- title, destination pin, image and source describe the same place;
- the review date and unresolved fields are honest;
- time-sensitive operating dates and closures have been checked again;
- all three credited photographs genuinely depict the named destination;
- no page implies that a destination pin is a verified trailhead;
- the correction email is monitored and corrections have an owner.

An AI-assisted visual review of all 304 photographs was completed on
2026-08-17 and is recorded in `PHOTO_REVIEW.md`. It corrected six unsuitable
or repetitive selections, but it does not replace accountable human sign-off.

The automated catalogue audit currently reports 100 unique published places,
304 unique credited photographs, no placeholders and no duplicate routes. All
100 places now have destination-specific context from an official tourism,
transport or recognised hiking source. Seven places also have a separately
verified access-point coordinate. The other 93 deliberately retain their
destination map pin instead of presenting it as a trailhead.

Some route fields remain blank where the reviewed source did not support a
precise value. Those omissions are intentional and are explained on the detail
page; do not replace them with estimates. Tine de Conflens is retained with its
current official closure warning. Seasonal services, closures and conditions
still require a fresh check immediately before travel.

Accuracy is a continuing process. Set a review interval and immediately mark a
location under review when a credible correction is received.

## 6. Final release test

Run:

```bash
pnpm install --frozen-lockfile
pnpm audit:content
pnpm audit:launch
pnpm check-types
pnpm turbo build --filter=swiss-trails-app --filter=swiss-trails-marketing
```

Then test on a real iPhone and Android phone:

- create an account by magic link and Google, if enabled;
- confirm an unpaid account cannot open Explore or a direct location URL;
- complete Stripe Checkout and confirm access activates;
- save and remove a favourite;
- export account data and submit a deletion request;
- open Explore, filters, map and several location pages;
- disconnect the network and confirm the honest offline screen appears;
- refund the payment and confirm paid access is removed;
- confirm Privacy, Terms, image credits and correction links work.

Finally configure uptime/error alerts and keep a tested database-backup recovery
procedure. Do not announce the public launch until a full purchase and refund
have succeeded in live mode.

Use `https://app.swiss-trails.com/api/health` for an uptime monitor. A `200`
response means both the application configuration and Supabase Auth health
check succeeded; a `503` means the service needs attention.

## 7. Production verification record

Last reviewed: 20 August 2026.

- The production health endpoint returned `200`.
- The Google sign-in button is hidden in production. Keep it hidden until a
  complete Google OAuth login and callback test succeeds.
- Supabase administrator MFA is complete with two active authenticators.
- Supabase reports the project as active and healthy, all five repository
  migrations are applied in production, and every public table
  has Row Level Security enabled. Ownership policies restrict profiles,
  favourites and purchases to the signed-in user; a real two-account test is
  still required before public launch.
- Supabase Security Advisor still reports leaked-password protection disabled.
  The organization intentionally remains on the Free plan and uses passwordless
  email codes. This warning is accepted for launch, provided CAPTCHA, short code
  expiry and rate limits remain enabled.
- Free-plan backup policy: create a private manual dump with
  `scripts/manual-supabase-backup.sh` before each release and at least weekly.
  The helper refuses to run without an explicitly supplied database URL, never
  prints that URL, creates owner-only files and checks that the dump can be read.
  Store a second encrypted copy outside this computer and perform a restore
  rehearsal before launch.
- The earlier live CHF 19.90 purchase/refund record is stored as refunded.
- Tomasee was rechecked against the regional tourism notice dated 13 July
  2026: the replacement trail is open, takes approximately 30–40 minutes
  longer than the former alignment, and current signs must be followed.
- Tine de Conflens was rechecked against Morges Region Tourism and the Commune
  of Chevilly: access remains closed until further notice because of falling
  tree and rock danger. Visitors must not pass barriers or approach the cirque.
- No Sentry SDK or Sentry production project is currently configured. The
  health endpoint provides uptime status, but detailed application-error
  alerts remain a launch task.
- Physical installation and offline checks still require a real iPhone and
  Android device. Browser emulation is not recorded as physical-device proof.
- The 304-photo catalogue has passed automated URL, credit, licence and
  resolution checks plus an AI-assisted visual pass. Accountable human
  destination-identity approval is still required and must not be inferred
  from the automated result.
