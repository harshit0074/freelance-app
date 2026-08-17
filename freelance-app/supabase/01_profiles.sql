-- ============================================================
-- Phase 1: profiles table
-- Run this in Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text check (role in ('company', 'freelancer')) not null,
  created_at timestamp with time zone default now()
);

-- Row Level Security: locks down who can read/write which rows.
alter table public.profiles enable row level security;

-- Anyone (even logged out) can view basic profile info.
-- This is fine here since it's just names/roles, no sensitive data.
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- A user can only insert a profile row for themselves.
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- A user can only update their own profile row.
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ------------------------------------------------------------
-- Auto-create a profile row whenever someone signs up.
-- Reads the full_name/role we pass in from the signup form.
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(new.raw_user_meta_data ->> 'role', 'freelancer')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
