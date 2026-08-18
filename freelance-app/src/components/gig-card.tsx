import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Gig } from "@/lib/types";
import { Calendar, DollarSign, Tag, ArrowRight } from "lucide-react";

export function GigCard({
  gig,
  href,
}: {
  gig: Gig;
  href: string;
}) {
  const formattedDate = new Date(gig.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={href}
      className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          {gig.category ? (
            <Badge
              variant="outline"
              className="font-mono text-[10px] uppercase tracking-wider bg-background"
            >
              {gig.category}
            </Badge>
          ) : (
            <span className="font-mono text-[10px] uppercase text-muted-foreground">
              Work Order
            </span>
          )}
          <span className="font-mono text-xs text-muted-foreground">
            {formattedDate}
          </span>
        </div>

        <div>
          <h2 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors">
            {gig.title}
          </h2>
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
            {gig.description}
          </p>
        </div>

        {gig.skills_required && gig.skills_required.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {gig.skills_required.slice(0, 3).map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="font-mono text-[10px] font-normal"
              >
                {skill}
              </Badge>
            ))}
            {gig.skills_required.length > 3 && (
              <span className="font-mono text-[10px] text-muted-foreground self-center">
                +{gig.skills_required.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3">
        <div>
          <span className="text-[10px] font-mono uppercase text-muted-foreground block">
            Fixed Price
          </span>
          <span className="font-mono text-lg font-bold text-foreground">
            ${gig.price.toFixed(2)}
          </span>
        </div>

        <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-primary group-hover:translate-x-0.5 transition-transform">
          View Gig <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
