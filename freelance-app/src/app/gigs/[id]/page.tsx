import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Gig } from "@/lib/types";
import { ClaimGigButton } from "./claim-gig-button";

export default async function GigDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: gig } = await supabase
    .from("gigs")
    .select("*")
    .eq("id", id)
    .single<Gig>();

  if (!gig) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let viewerRole: "company" | "freelancer" | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    viewerRole = profile?.role ?? null;
  }

  const canClaim = gig.status === "open" && viewerRole === "freelancer";
  const isClaimedByViewer = user && gig.claimed_by === user.id;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl">{gig.title}</CardTitle>
            <Badge variant="secondary" className="capitalize">
              {gig.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {gig.description}
          </p>
          <div className="text-2xl font-semibold">
            ${gig.price.toFixed(2)}
          </div>

          {canClaim && <ClaimGigButton gigId={gig.id} />}

          {isClaimedByViewer && gig.status !== "open" && (
            <p className="text-sm text-muted-foreground">
              You claimed this gig. Manage it from your{" "}
              <a href="/dashboard" className="underline">
                dashboard
              </a>
              .
            </p>
          )}

          {!user && gig.status === "open" && (
            <p className="text-sm text-muted-foreground">
              <a href="/login" className="underline">
                Log in as a freelancer
              </a>{" "}
              to claim this gig.
            </p>
          )}

          {gig.status !== "open" && !isClaimedByViewer && (
            <p className="text-sm text-muted-foreground">
              This gig is no longer open.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
