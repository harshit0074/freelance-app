import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GigActions } from "@/components/gig-actions";
import type { Gig, GigStatus } from "@/lib/types";

const STATUS_LABEL: Record<GigStatus, string> = {
  open: "Open",
  claimed: "Claimed",
  submitted: "Submitted",
  approved: "Approved",
  paid: "Paid",
};

const STATUS_VARIANT: Record<GigStatus, "default" | "secondary" | "outline"> = {
  open: "default",
  claimed: "secondary",
  submitted: "secondary",
  approved: "outline",
  paid: "outline",
};

export function DashboardGigCard({
  gig,
  viewerRole,
}: {
  gig: Gig;
  viewerRole: "company" | "freelancer";
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">
            <Link href={`/gigs/${gig.id}`} className="hover:underline">
              {gig.title}
            </Link>
          </CardTitle>
          <Badge variant={STATUS_VARIANT[gig.status]}>
            {STATUS_LABEL[gig.status]}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {gig.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="text-lg font-semibold">${gig.price.toFixed(2)}</div>
        <GigActions gigId={gig.id} status={gig.status} viewerRole={viewerRole} />
      </CardContent>
    </Card>
  );
}
