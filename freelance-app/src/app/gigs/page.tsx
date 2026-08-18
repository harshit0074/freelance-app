import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GigsExplorer } from "./gigs-explorer";
import { Button } from "@/components/ui/button";
import type { Gig } from "@/lib/types";
import { FilePlus2, Sparkles } from "lucide-react";

export default async function GigsPage() {
  const supabase = await createClient();

  const { data: gigs } = await supabase
    .from("gigs")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isCompany = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isCompany = profile?.role === "company";
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Marketplace Work Orders
            </span>
            <span className="rounded-full bg-status-paid/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-status-paid">
              Live Board
            </span>
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Browse Open Gigs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            Explore fixed-price projects from verified companies. Claim on-demand with zero bidding overhead.
          </p>
        </div>

        {isCompany ? (
          <Button asChild>
            <Link href="/gigs/new">
              <FilePlus2 className="size-4 mr-1.5" />
              Post a Work Order
            </Link>
          </Button>
        ) : !user ? (
          <Button asChild variant="outline">
            <Link href="/signup">
              Sign up as Freelancer
            </Link>
          </Button>
        ) : null}
      </div>

      {/* Interactive Explorer with Filters & Search */}
      <div className="mt-8">
        <GigsExplorer initialGigs={(gigs ?? []) as Gig[]} />
      </div>
    </div>
  );
}
