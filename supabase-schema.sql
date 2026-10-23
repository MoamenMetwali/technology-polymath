-- Technology Polymath: run in Supabase SQL Editor as the project owner.
-- Invite users through Authentication > Users > Invite user.
-- In Authentication > Providers > Email, disable public "Allow new users to sign up".
-- The website will never call signUp(), but disabling signups server-side is essential.
create table if not exists public.learning_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.learning_progress enable row level security;
revoke all on public.learning_progress from anon;
grant select, insert, update, delete on public.learning_progress to authenticated;
drop policy if exists "read own learning progress" on public.learning_progress;
create policy "read own learning progress" on public.learning_progress
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "insert own learning progress" on public.learning_progress;
create policy "insert own learning progress" on public.learning_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "update own learning progress" on public.learning_progress;
create policy "update own learning progress" on public.learning_progress
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
drop policy if exists "delete own learning progress" on public.learning_progress;
create policy "delete own learning progress" on public.learning_progress
  for delete to authenticated using ((select auth.uid()) = user_id);
