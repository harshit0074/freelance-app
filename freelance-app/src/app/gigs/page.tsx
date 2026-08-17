import { createClient } from "@/lib/supabase/server";
import { GigCard } from "@/components/gig-card";
import { Card, CardContent } from "@/components/ui/card";
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
      <h1 className="text-2xl font-semibold">Open Gigs</h1>
      <p className="mt-1 text-muted-foreground">
        Browse available work. Log in as a freelancer to claim one.
      </p>

      {gigs && gigs.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(gigs as Gig[]).map((gig) => (
            <GigCard key={gig.id} gig={gig} href={`/gigs/${gig.id}`} />
          ))}
        </div>
      ) : (
        <Card className="mt-8">
          <CardContent className="py-12 text-center text-muted-foreground">
            No open gigs right now — check back soon.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
