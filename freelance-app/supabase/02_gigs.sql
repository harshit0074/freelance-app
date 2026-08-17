-- ============================================================
-- Phase 2: gigs table
-- Run this in Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

create table public.gigs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  price numeric(10, 2) not null check (price > 0),
  status text not null default 'open'
    check (status in ('open', 'claimed', 'submitted', 'approved', 'paid')),
  claimed_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default now()
);

alter table public.gigs enable row level security;

-- Anyone can view gigs (needed for the public /gigs browse page).
create policy "Gigs are viewable by everyone"
  on public.gigs for select
  using (true);

-- Only the company that owns a gig can create it (checked at insert time).
create policy "Companies can insert their own gigs"
  on public.gigs for insert
  with check (auth.uid() = company_id);

-- Only the owning company can edit their own gig for now.
-- (Phase 4 will add a separate policy allowing freelancers to claim.)
create policy "Companies can update their own gigs"
  on public.gigs for update
  using (auth.uid() = company_id);
