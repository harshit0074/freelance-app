-- ============================================================
-- Version 2: Schema upgrades for Profiles, Gigs, and Deliverables
-- Run this in Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

-- 1. Upgrade profiles table with resume, links, and portfolio fields
alter table public.profiles 
  add column if not exists headline text,
  add column if not exists bio text,
  add column if not exists location text,
  add column if not exists github_url text,
  add column if not exists linkedin_url text,
  add column if not exists website_url text,
  add column if not exists avatar_url text,
  add column if not exists skills text[] default '{}',
  add column if not exists past_works jsonb default '[]'::jsonb,
  add column if not exists company_industry text;

-- 2. Upgrade gigs table with categories, required skills, and deliverables
alter table public.gigs
  add column if not exists category text default 'General',
  add column if not exists skills_required text[] default '{}',
  add column if not exists submission_url text,
  add column if not exists submission_notes text,
  add column if not exists approved_at timestamp with time zone;

-- 3. Ensure profiles are publicly viewable by all users
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- 4. Ensure users can update their own profile fields
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
