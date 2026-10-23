# Technology Polymath — Supabase setup

The interactive textbook lives in `index.html` and is hosted on GitHub Pages. The new authentication layer is in `auth.js`. Until Supabase is configured, the existing site remains usable with **local-only** progress; it is **not** private.

## Activate invitation-only accounts

1. Create a free project at https://supabase.com/dashboard.
2. Open **SQL Editor** and run `supabase-schema.sql` to create the `public.learning_progress` table with user-specific Row Level Security (RLS).
3. In **Authentication → Providers → Email**, disable public signups (the setting may be labeled **Allow new users to sign up**). Keep email authentication enabled.
4. Under **Authentication → URL Configuration**, set **Site URL** to `https://moamenmetwali.github.io/technology-polymath/` and add this same URL to **Redirect URLs**. Supabase invite links redirect to your website.
5. From **Project Settings → API** (or **Connect → API Keys** in newer versions), copy the **Project URL** and **publishable/anon key** into `supabase-config.js`:
   ```js
   window.TP_SUPABASE_CONFIG = {
     url: "https://YOUR-PROJECT.supabase.co",
     anonKey: "YOUR-PUBLISHABLE-OR-ANON-KEY"
   };
   ```
6. Commit the modified `supabase-config.js`. Your GitHub Pages site will then require sign-in to use the app and sync cloud progress.
7. Invite users under **Authentication → Users → Invite user**. Ensure the invitation sends them to your GitHub Pages URL. Invited users follow the emailed link and choose a password.
8. Test with two *different invited user accounts*: progress made by one must not appear for the other. Test mobile/desktop synchronization and sign-out.

## Important security points

- The publishable/anon key is designed to be used in browser code; the **service_role** key and all secret keys must **never** be committed to this public repository.
- The `learning_progress` table grants authenticated users access only to their own row through RLS. Run and verify the SQL before activating the frontend.
- **GitHub Pages is a public static website.** Login protects individual cloud learning data, **not access to the downloadable lesson HTML**. For private educational content, migrate hosting to an access-controlled service.
- The existing local progress is offered for a *one-time import* when the first invited account logs in on that device. After that, progress is stored per account on Supabase. Export backups regularly.
- This is a single JSON progress record per user; simultaneous edits from two devices can resolve with the last write. Avoid studying in two tabs/devices simultaneously until conflict handling is upgraded.
- Supabase's free plan may pause inactive projects or have limits; consider backups.

## Source files

- `index.html`: 12-month shell, first-month lessons, login view
- `auth.js`: session handling, invitations, syncing, password setup, sign-out
- `supabase-config.js`: public frontend connection settings
- `supabase-schema.sql`: PostgreSQL table and RLS policies
