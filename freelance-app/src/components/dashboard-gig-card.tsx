import Link from "next/link";
import { StatusTag } from "@/components/status-tag";
import { GigActions } from "@/components/gig-actions";
import type { Gig } from "@/lib/types";
import { cn } from "@/lib/utils";

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
        "flex flex-col gap-3 rounded-md border border-l-4 bg-card p-4",
        SPINE[gig.status]
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium leading-snug">
          <Link href={`/gigs/${gig.id}`} className="hover:underline">
            {gig.title}
          </Link>
        </h3>
        <StatusTag status={gig.status} />
      </div>
      <p className="line-clamp-2 text-sm text-muted-foreground">
        {gig.description}
      </p>
      <div className="flex items-center justify-between gap-4">
        <div className="font-mono text-lg font-semibold">
          ${gig.price.toFixed(2)}
        </div>
        <GigActions gigId={gig.id} status={gig.status} viewerRole={viewerRole} />
      </div>
    </div>
  );
}
