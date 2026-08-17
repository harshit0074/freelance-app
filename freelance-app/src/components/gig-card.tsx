import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Gig, GigStatus } from "@/lib/types";

const STATUS_LABEL: Record<GigStatus, string> = {
  open: "Open",
  claimed: "Claimed",
  submitted: "Submitted",
  approved: "Approved",
  paid: "Paid",
};

const STATUS_VARIANT: Record<
  GigStatus,
  "default" | "secondary" | "outline"
> = {
  open: "default",
  claimed: "secondary",
  submitted: "secondary",
  approved: "outline",
  paid: "outline",
};

export function GigCard({ gig, href }: { gig: Gig; href: string }) {
  return (
    <Link href={href}>
      <Card className="transition-colors hover:bg-accent/50">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base">{gig.title}</CardTitle>
            <Badge variant={STATUS_VARIANT[gig.status]}>
              {STATUS_LABEL[gig.status]}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {gig.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold">
            ${gig.price.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
