-- ============================================================
-- Phase A: enforce thapar.edu emails for freelancers only
-- Run this in Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

-- Runs BEFORE the user row is inserted, so if it raises an exception
-- the entire signup is rolled back — this can't be bypassed by
-- calling the API directly, only the app's own client-side check can.
-- Companies are untouched: any email domain works for them.
create or replace function public.validate_freelancer_email()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (new.raw_user_meta_data ->> 'role') = 'freelancer'
     and new.email is not null
     and new.email !~* '@thapar\.edu$' then
    raise exception 'Freelancer accounts must use a thapar.edu email address.';
  end if;
  return new;
end;
$$;

create trigger validate_freelancer_email_before_insert
  before insert on auth.users
  for each row execute procedure public.validate_freelancer_email();
