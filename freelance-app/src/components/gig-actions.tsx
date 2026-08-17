"use client";

import { useActionState } from "react";
import { submitGig, approveGig, markPaid } from "@/app/gigs/actions";
import { SubmitButton } from "@/components/submit-button";
import type { GigStatus } from "@/lib/types";

function ActionForm({
  gigId,
  action,
  pendingText,
  children,
}: {
  gigId: string;
  action: typeof submitGig;
  pendingText: string;
  children: React.ReactNode;
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-1">
      <input type="hidden" name="gigId" value={gigId} />
      {state?.error && (
        <p className="text-xs text-destructive">{state.error}</p>
      )}
      <SubmitButton pendingText={pendingText}>{children}</SubmitButton>
    </form>
  );
}

export function GigActions({
  gigId,
  status,
  viewerRole,
}: {
  gigId: string;
  status: GigStatus;
  viewerRole: "company" | "freelancer";
}) {
  if (viewerRole === "freelancer" && status === "claimed") {
    return (
      <ActionForm gigId={gigId} action={submitGig} pendingText="Submitting...">
        Mark as submitted
      </ActionForm>
    );
  }

  if (viewerRole === "company" && status === "submitted") {
    return (
      <ActionForm gigId={gigId} action={approveGig} pendingText="Approving...">
        Approve
      </ActionForm>
    );
  }

  if (viewerRole === "company" && status === "approved") {
    return (
      <ActionForm gigId={gigId} action={markPaid} pendingText="Marking paid...">
        Mark as paid
      </ActionForm>
    );
  }

  return null;
}
