import Link from "next/link";
import { StatusTag } from "@/components/status-tag";
import { GigActions } from "@/components/gig-actions";
import { Badge } from "@/components/ui/badge";
import type { Gig } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ExternalLink, FileText, Link2, User } from "lucide-react";

const SPINE: Record<Gig["status"], string> = {
  open: "border-l-status-open",
  claimed: "border-l-status-claimed",
  submitted: "border-l-status-submitted",
  approved: "border-l-status-approved",
  paid: "border-l-status-paid",
};

export function DashboardGigCard({
  gig,
  viewerRole,
}: {
  gig: Gig;
  viewerRole: "company" | "freelancer";
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-4 rounded-lg border border-l-4 bg-card p-5 transition-shadow hover:shadow-sm",
        SPINE[gig.status]
      )}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            {gig.category && (
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {gig.category}
              </span>
            )}
            <h3 className="font-medium text-base leading-snug">
              <Link href={`/gigs/${gig.id}`} className="hover:underline">
                {gig.title}
              </Link>
            </h3>
          </div>
          <StatusTag status={gig.status} />
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {gig.description}
        </p>

        {gig.skills_required && gig.skills_required.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {gig.skills_required.map((skill) => (
              <Badge key={skill} variant="secondary" className="font-mono text-[10px] px-2 py-0.5">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        {/* Deliverable info if submitted */}
        {(gig.submission_url || gig.submission_notes) && (
          <div className="mt-3 rounded-md border border-border/80 bg-muted/40 p-3 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase font-semibold text-muted-foreground">
              <FileText className="size-3.5" />
              Submitted Deliverable
            </div>

            {gig.submission_url && (
              <div>
                <a
                  href={gig.submission_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary underline font-medium hover:opacity-80"
                >
                  <Link2 className="size-3" />
                  View Deliverable Work
                  <ExternalLink className="size-3" />
                </a>
              </div>
            )}

            {gig.submission_notes && (
              <p className="text-muted-foreground whitespace-pre-wrap">
                {gig.submission_notes}
              </p>
            )}
          </div>
        )}

        {/* Claimer link for company */}
        {viewerRole === "company" && gig.claimed_by && (
          <div className="pt-1">
            <Link
              href={`/profile/${gig.claimed_by}`}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground underline"
            >
              <User className="size-3" />
              View Freelancer Resume & Profile
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border/60 pt-3">
        <div className="font-mono text-lg font-bold">
          ${gig.price.toFixed(2)}
        </div>
        <GigActions gig={gig} viewerRole={viewerRole} />
      </div>
    </div>
  );
}
