-- ============================================================
-- Phase 6: payments table
-- Run this in Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null references public.gigs(id) on delete cascade,
  amount numeric(10, 2) not null,
  status text not null default 'pending' check (status in ('pending', 'paid')),
  paid_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table public.payments enable row level security;

-- Visible to the company that posted the gig, and the freelancer who claimed it.
create policy "Payments viewable by the gig's company or freelancer"
  on public.payments for select
  using (
    exists (
      select 1 from public.gigs
      where gigs.id = payments.gig_id
      and (gigs.company_id = auth.uid() or gigs.claimed_by = auth.uid())
    )
  );

-- Only the company that posted the gig can mark its payment as paid.
create policy "Company can update their gig's payment"
  on public.payments for update
  using (
    exists (
      select 1 from public.gigs
      where gigs.id = payments.gig_id
      and gigs.company_id = auth.uid()
    )
  );

-- ------------------------------------------------------------
-- Auto-create a 'pending' payment row the moment a gig is approved.
-- Runs as a trigger so it happens automatically and can't be skipped.
-- ------------------------------------------------------------
create or replace function public.handle_gig_approved()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status = 'approved' and old.status is distinct from 'approved' then
    insert into public.payments (gig_id, amount, status)
    values (new.id, new.price, 'pending');
  end if;
  return new;
end;
$$;

create trigger on_gig_approved
  after update on public.gigs
  for each row execute procedure public.handle_gig_approved();
