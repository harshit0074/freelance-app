"use client";

import { useActionState, useState } from "react";
import { submitGig, approveGig, markPaid } from "@/app/gigs/actions";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Gig, GigStatus } from "@/lib/types";
import { CheckCircle2, ChevronDown, ExternalLink, Link2, Send, DollarSign } from "lucide-react";

export function GigActions({
  gig,
  viewerRole,
}: {
  gig: Gig;
  viewerRole: "company" | "freelancer";
}) {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitState, submitAction, isSubmitting] = useActionState(submitGig, undefined);
  const [approveState, approveAction] = useActionState(approveGig, undefined);
  const [payState, payAction] = useActionState(markPaid, undefined);

  // Freelancer action: Submit work deliverable
  if (viewerRole === "freelancer" && gig.status === "claimed") {
    return (
      <div className="w-full">
        {!showSubmitModal ? (
          <Button
            size="sm"
            onClick={() => setShowSubmitModal(true)}
            className="w-full sm:w-auto"
          >
            <Send className="size-3.5 mr-1.5" />
            Submit Deliverable
          </Button>
        ) : (
          <div className="mt-3 rounded-lg border border-primary/30 bg-card p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase text-primary">
                Submit Work for Review
              </span>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>

            <form action={submitAction} className="space-y-3">
              <input type="hidden" name="gigId" value={gig.id} />

              {submitState?.error && (
                <p className="text-xs text-destructive">{submitState.error}</p>
              )}

              <div className="space-y-1">
                <Label htmlFor={`url-${gig.id}`} className="text-xs">
                  Deliverable Link / URL
                </Label>
                <Input
                  id={`url-${gig.id}`}
                  name="submissionUrl"
                  type="url"
                  placeholder="https://github.com/... or Figma / Loom / Drive"
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor={`notes-${gig.id}`} className="text-xs">
                  Completion Notes
                </Label>
                <textarea
                  id={`notes-${gig.id}`}
                  name="submissionNotes"
                  rows={2}
                  placeholder="Briefly describe what you built or completed..."
                  className="w-full rounded-md border border-input bg-background p-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSubmitModal(false)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <SubmitButton size="sm" pendingText="Submitting...">
                  Send to Company
                </SubmitButton>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  // Company action: Approve submitted work
  if (viewerRole === "company" && gig.status === "submitted") {
    return (
      <form action={approveAction} className="flex flex-col gap-1 w-full sm:w-auto">
        <input type="hidden" name="gigId" value={gig.id} />
        {approveState?.error && (
          <p className="text-xs text-destructive">{approveState.error}</p>
        )}
        <SubmitButton size="sm" pendingText="Approving...">
          <CheckCircle2 className="size-3.5 mr-1.5" />
          Approve Work
        </SubmitButton>
      </form>
    );
  }

  // Company action: Mark approved work as paid
  if (viewerRole === "company" && gig.status === "approved") {
    return (
      <form action={payAction} className="flex flex-col gap-1 w-full sm:w-auto">
        <input type="hidden" name="gigId" value={gig.id} />
        {payState?.error && (
          <p className="text-xs text-destructive">{payState.error}</p>
        )}
        <SubmitButton size="sm" pendingText="Marking paid...">
          <DollarSign className="size-3.5 mr-1.5" />
          Mark as Paid
        </SubmitButton>
      </form>
    );
  }

  return null;
}
