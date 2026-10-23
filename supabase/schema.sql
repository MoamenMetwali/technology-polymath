-- Technology Polymath: run in Supabase SQL Editor
-- Only the Supabase Auth admin invitation endpoint should create users.
-- In Supabase Dashboard → Authentication → Providers → Email:
-- disable "Allow new users to sign up". Invite users through Authentication → Users → Invite user.
create table if not exists public.learning_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{"done":{},"quiz":{},"checks":{},"cards":{}}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.learning_progress enable row level security;
revoke all on public.learning_progress from anon;
grant select, insert, update on public.learning_progress to authenticated;
drop policy if exists "Learners read own progress" on public.learning_progress;
drop policy if exists "Learners insert own progress" on public.learning_progress;
drop policy if exists "Learners update own progress" on public.learning_progress;
create policy "Learners read own progress" on public.learning_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Learners insert own progress" on public.learning_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Learners update own progress" on public.learning_progress
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
