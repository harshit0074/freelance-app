-- ============================================================
-- Phase 5: allow freelancers to submit their claimed gigs
-- Run this in Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

-- Lets a freelancer move a gig they claimed FROM 'claimed' status
-- INTO 'submitted' status. Companies already have a broad update
-- policy on their own gigs (from Phase 2), so approving a submitted
-- gig needs no new policy — this one just covers the freelancer side.
create policy "Freelancers can submit their claimed gigs"
  on public.gigs for update
  using (status = 'claimed' and claimed_by = auth.uid())
  with check (status = 'submitted' and claimed_by = auth.uid());
