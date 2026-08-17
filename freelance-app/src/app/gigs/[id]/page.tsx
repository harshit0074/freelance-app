import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusPipeline } from "@/components/status-pipeline";
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
      <StatusPipeline current={gig.status} />

      <div className="mt-6 rounded-md border border-border bg-card p-6">
        <h1 className="text-xl font-medium leading-snug">{gig.title}</h1>

        <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">
          {gig.description}
        </p>

        <div className="mt-6 font-mono text-3xl font-semibold">
          ${gig.price.toFixed(2)}
        </div>

        <div className="mt-6 border-t border-dashed border-border pt-6">
          {canClaim && <ClaimGigButton gigId={gig.id} />}

          {isClaimedByViewer && gig.status !== "open" && (
            <p className="text-sm text-muted-foreground">
              You claimed this gig. Manage it from your{" "}
              <Link href="/dashboard" className="underline">
                dashboard
              </Link>
              .
            </p>
          )}

          {!user && gig.status === "open" && (
            <p className="text-sm text-muted-foreground">
              <Link href="/login" className="underline">
                Log in as a freelancer
              </Link>{" "}
              to claim this gig.
            </p>
          )}

          {gig.status !== "open" && !isClaimedByViewer && (
            <p className="text-sm text-muted-foreground">
              This gig is no longer open.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
