# Supabase setup

Supabase supplies two things for Swiss Trails:

- **Auth** identifies users and stores their login session in secure cookies.
- **Postgres** is the database. Row Level Security (RLS) acts like an automatic
  filter so a signed-in user can only access records they are allowed to see.

## 1. Create and configure the project

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and fill in the three Supabase values.
3. In **Authentication → URL Configuration**, set:
   - Site URL: your production URL (use `http://localhost:3000` locally).
   - Redirect URLs: `http://localhost:3000/**` and your production URL ending in `/**`.
4. In **Authentication → Providers**, enable Google if desired. Add the Google
   client ID and secret shown in the provider setup. Email magic links work by default.

## 2. Create the database

Open **SQL Editor**, paste the full contents of
`supabase/migrations/001_initial.sql`, and run it once.

The migration creates profiles, locations, images, favorites, purchases,
testimonials, audit logs, storage buckets, triggers, and all RLS policies.
A profile row is automatically created whenever a Supabase Auth user signs up.

## 3. Configure the magic-link email

For server-side sessions, set the **Magic Link** email template link to:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
  Sign in to Swiss Trails
</a>
```

## 4. Import the included location catalogue

From the repository root:

```bash
pnpm --filter swiss-trails-app db:seed
```

The seed is safe to run again: it updates records with the same IDs rather than
creating duplicates.

## 5. Verify

```bash
pnpm --filter swiss-trails-app check-types
pnpm --filter swiss-trails-app build
```

Then start the app, request a magic link on `/login`, and confirm that:

1. Clicking the email link opens `/explore`.
2. A matching row exists in `public.profiles`.
3. Saving a location creates a row in `public.favorites`.
4. Signing out from `/profile` returns to `/login`.

Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. It bypasses RLS and is used only
for trusted jobs such as the Stripe webhook and catalogue seed.
