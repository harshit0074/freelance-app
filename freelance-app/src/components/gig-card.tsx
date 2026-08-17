import Link from "next/link";
import { StatusTag } from "@/components/status-tag";
import type { Gig } from "@/lib/types";
import { cn } from "@/lib/utils";

const SPINE: Record<Gig["status"], string> = {
  open: "border-l-status-open",
  claimed: "border-l-status-claimed",
  submitted: "border-l-status-submitted",
  approved: "border-l-status-approved",
  paid: "border-l-status-paid",
};

export function GigCard({ gig, href }: { gig: Gig; href: string }) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex flex-col gap-3 rounded-md border border-l-4 bg-card p-4 transition-colors hover:bg-accent/40",
          SPINE[gig.status]
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium leading-snug">{gig.title}</h3>
          <StatusTag status={gig.status} />
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {gig.description}
        </p>
        <div className="font-mono text-lg font-semibold">
          ${gig.price.toFixed(2)}
        </div>
      </div>
    </Link>
  );
}
