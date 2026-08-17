-- ============================================================
-- Phase 4: allow freelancers to claim open gigs
-- Run this in Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

-- Lets any signed-in freelancer update a gig FROM 'open' status,
-- but only INTO 'claimed' status, and only if they're setting
-- themselves (claimed_by = their own id) as the claimer.
-- This works alongside (not instead of) the company's own update policy.
create policy "Freelancers can claim open gigs"
  on public.gigs for update
  using (status = 'open')
  with check (
    status = 'claimed'
    and claimed_by = auth.uid()
  );
