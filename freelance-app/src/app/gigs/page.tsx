import { Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GigCard } from "@/components/gig-card";
import type { Gig } from "@/lib/types";

export default async function GigsPage() {
  const supabase = await createClient();

  const { data: gigs } = await supabase
    .from("gigs")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Open work orders
      </p>
      <h1 className="mt-2 text-2xl font-medium">Browse gigs</h1>
      <p className="mt-1 text-muted-foreground">
        Log in as a freelancer to claim one.
      </p>

      {gigs && gigs.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(gigs as Gig[]).map((gig) => (
            <GigCard key={gig.id} gig={gig} href={`/gigs/${gig.id}`} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-md border border-dashed border-border py-16 text-center text-muted-foreground">
          <Inbox className="size-6" strokeWidth={1.5} />
          <p>No open gigs right now — check back soon.</p>
        </div>
      )}
    </div>
  );
}
