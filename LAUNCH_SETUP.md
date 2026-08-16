# Swiss Trails launch setup

This file lists the few production steps that require the product owner's
accounts, legal identity, or business decision. Code changes alone cannot
complete them.

## 1. Publish the legal operator

Decide who is legally selling Swiss Trails: you personally, a sole
proprietorship, or a company. Obtain professional Swiss legal/accounting advice
where needed, then provide:

- full legal operator or registered company name;
- complete postal address;
- country;
- support email that is actively monitored;
- VAT status and whether CHF 29 is the total consumer price;
- the refund period or confirmation that the advertised three-location promise
  intentionally has no time limit.

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
2. Create a **live-mode** one-time product and CHF 29 price.
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
LEGAL_OPERATOR_NAME=...
LEGAL_OPERATOR_ADDRESS=...
LEGAL_OPERATOR_COUNTRY=Switzerland
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
LEGAL_OPERATOR_NAME=...
LEGAL_OPERATOR_ADDRESS=...
LEGAL_OPERATOR_COUNTRY=Switzerland
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

The automated catalogue audit currently reports 100 unique published places,
304 unique credited photographs, no placeholders and no duplicate routes. The
following 16 destinations intentionally remain **destination references**, not
verified hiking routes, until an editor can support the access and route fields
with trustworthy sources:

- Aiguilles de Baulmes
- Arnisee
- Cascade du Dar
- Chüebodensee
- Crestasee
- Gasterntal
- Golzerensee
- Greina Plateau
- Lac de Tseuzier
- Lagh da Saoseo
- Lai da Rims
- Murgseen
- Partnunsee
- Seebergsee
- Thur Waterfalls
- Tine de Conflens

These pages may remain published only with their existing unresolved labels.
Do not turn destination coordinates into trailhead coordinates or add route
figures without a source. For the strongest launch claim, verify these entries
or temporarily exclude them from sales messaging after an editorial decision.

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
