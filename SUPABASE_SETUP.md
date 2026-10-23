# Technology Polymath — invitation-only learning platform

This GitHub Pages website uses Supabase Authentication and a per-user PostgreSQL progress row.

## Setup (one-time, project owner)

1. Create a **free Supabase project** at https://supabase.com/dashboard.
2. In **SQL Editor**, run [supabase/schema.sql](supabase/schema.sql).
3. In **Authentication → Providers → Email**, turn **off** user signups ("Allow new users to sign up"). Email login must remain enabled.
4. In **Authentication → URL Configuration**, set the Site URL to `https://moamenmetwali.github.io/technology-polymath/` and add that URL to the Redirect URLs allowlist. Do not enable an open redirect wildcard.
5. In **Project Settings → API**, copy the project URL and the publishable/anon key into [supabase-config.js](supabase-config.js). **Never** put a service-role or secret key in browser code.
6. In **Authentication → Users**, use **Invite user** to create approved accounts. Each invitee receives a link to the site where they can set their password and begin learning.
7. Test with two invited accounts to confirm that progress is separate, and test a second browser to confirm cloud syncing.

## How progress works

The application uses the existing Month 1 HTML book and its local progress format. After authentication, it reads/writes the `public.learning_progress` table, keyed by Supabase `auth.users.id`. Row Level Security restricts access to the authenticated learner's own row. The first login can optionally migrate existing progress already stored in that browser. Browser backup export remains available.

Cloud saves are debounced. A slow connection, blocked third-party network request or service outage can interrupt sync. Check the saved/sync label and export a backup before clearing browser storage. Avoid editing the same progress from multiple devices simultaneously, as the most recent full-document write wins.

**Until Supabase configuration is supplied, the site intentionally shows a setup-pending sign-in screen rather than exposing unauthenticated learner data.**

## Privacy/security

GitHub Pages is **public hosting**: website code and course lessons are publicly accessible as source. Authentication protects each user's learning progress, not the HTML course material itself. If course content must be private, use private hosting/authenticated content delivery instead.
