import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusPipeline } from "@/components/status-pipeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Gig, Profile } from "@/lib/types";
import { ClaimGigButton } from "./claim-gig-button";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Code2,
  ExternalLink,
  FileText,
  Link2,
  User,
} from "lucide-react";

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

  // Fetch company profile
  const { data: companyProfile } = await supabase
    .from("profiles")
    .select("id, full_name, company_industry")
    .eq("id", gig.company_id)
    .single<Profile>();

  // Fetch claimer profile if claimed
  let claimerProfile: Profile | null = null;
  if (gig.claimed_by) {
    const { data: claimer } = await supabase
      .from("profiles")
      .select("id, full_name, headline, location, skills")
      .eq("id", gig.claimed_by)
      .single<Profile>();
    claimerProfile = claimer;
  }

  const canClaim = gig.status === "open" && viewerRole === "freelancer";
  const isClaimedByViewer = user && gig.claimed_by === user.id;
  const isOwner = user && gig.company_id === user.id;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 space-y-8">
      {/* Back button */}
      <div>
        <Button variant="ghost" size="sm" asChild className="text-xs">
          <Link href="/gigs">
            <ArrowLeft className="size-3.5 mr-1" /> Back to open gigs
          </Link>
        </Button>
      </div>

      {/* Status progression bar */}
      <StatusPipeline current={gig.status} />

      {/* Main Ticket Card */}
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {gig.category && (
                <Badge variant="outline" className="font-mono text-[10px] uppercase bg-background">
                  {gig.category}
                </Badge>
              )}
              <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3" />
                {new Date(gig.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight leading-snug">
              {gig.title}
            </h1>

            {companyProfile && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Building2 className="size-3.5" />
                Posted by{" "}
                <Link
                  href={`/profile/${companyProfile.id}`}
                  className="font-medium text-foreground underline hover:opacity-80"
                >
                  {companyProfile.full_name || "Verified Company"}
                </Link>
              </p>
            )}
          </div>

          <div className="rounded-lg border border-border bg-background p-4 text-left sm:text-right shrink-0">
            <span className="font-mono text-[10px] uppercase text-muted-foreground block">
              Guaranteed Payout
            </span>
            <span className="font-mono text-3xl font-extrabold text-foreground">
              ${gig.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Skills Required */}
        {gig.skills_required && gig.skills_required.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <Code2 className="size-3.5" /> Required Tech Stack & Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {gig.skills_required.map((skill) => (
                <Badge key={skill} variant="secondary" className="font-mono text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Work Order Description */}
        <div className="space-y-2">
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Scope of Work & Requirements
          </h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {gig.description}
          </p>
        </div>

        {/* Deliverable Review (if submitted/approved) */}
        {(gig.submission_url || gig.submission_notes) && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-5 space-y-2">
            <h3 className="flex items-center gap-1.5 font-mono text-xs uppercase font-semibold text-primary">
              <FileText className="size-3.5" /> Submitted Deliverable
            </h3>

            {gig.submission_url && (
              <div className="pt-1">
                <a
                  href={gig.submission_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline"
                >
                  <Link2 className="size-4" /> Open Project Deliverable <ExternalLink className="size-3.5" />
                </a>
              </div>
            )}

            {gig.submission_notes && (
              <p className="text-xs text-foreground/80 whitespace-pre-wrap pt-1">
                {gig.submission_notes}
              </p>
            )}
          </div>
        )}

        {/* Claimer Information Card */}
        {claimerProfile && (
          <div className="rounded-lg border border-border bg-muted/30 p-4 flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block">
                Claimed By Freelancer
              </span>
              <p className="text-sm font-semibold">{claimerProfile.full_name}</p>
              {claimerProfile.headline && (
                <p className="text-xs text-muted-foreground">{claimerProfile.headline}</p>
              )}
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/profile/${claimerProfile.id}`}>
                <User className="size-3.5 mr-1" /> View Full Resume
              </Link>
            </Button>
          </div>
        )}

        {/* Actions & Claim Footer */}
        <div className="border-t border-border pt-6">
          {canClaim && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">Ready to take on this project?</p>
                <p className="text-xs text-muted-foreground">Claiming locks the ticket exclusively to you.</p>
              </div>
              <ClaimGigButton gigId={gig.id} />
            </div>
          )}

          {isClaimedByViewer && gig.status !== "open" && (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                You claimed this work order. Submit your work or track review status from your dashboard.
              </p>
              <Button asChild size="sm">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          )}

          {!user && gig.status === "open" && (
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                Log in as a freelancer to claim this work order.
              </p>
              <Button asChild size="sm" variant="outline">
                <Link href="/login">Log in to Claim</Link>
              </Button>
            </div>
          )}

          {gig.status !== "open" && !isClaimedByViewer && !isOwner && (
            <p className="text-xs text-muted-foreground font-mono">
              This ticket is currently {gig.status} and no longer accepting claims.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
