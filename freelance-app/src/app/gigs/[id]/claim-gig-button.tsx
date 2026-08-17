"use client";

import { useActionState } from "react";
import { claimGig } from "@/app/gigs/actions";
import { SubmitButton } from "@/components/submit-button";

export function ClaimGigButton({ gigId }: { gigId: string }) {
  const [state, formAction] = useActionState(claimGig, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="gigId" value={gigId} />
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <SubmitButton pendingText="Claiming...">Claim this gig</SubmitButton>
    </form>
  );
}
