import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Profile, Gig } from "@/lib/types";
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Code2,
  ExternalLink,
  Globe,
  MapPin,
  Sparkles,
  User,
} from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single<Profile>();

  if (!profile) {
    notFound();
  }

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const isOwner = currentUser?.id === profile.id;
  const isFreelancer = profile.role === "freelancer";

  // Fetch completed / active platform stats
  const { data: platformGigs } = isFreelancer
    ? await supabase
        .from("gigs")
        .select("id, title, price, status, created_at")
        .eq("claimed_by", profile.id)
    : await supabase
        .from("gigs")
        .select("id, title, price, status, created_at")
        .eq("company_id", profile.id);

  const completedGigs = (platformGigs || []).filter(
    (g) => g.status === "paid" || g.status === "approved"
  );

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-mono text-xl font-bold uppercase shadow-sm">
              {profile.full_name ? profile.full_name.charAt(0) : "U"}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {profile.full_name || "Anonymous Member"}
                </h1>
                <Badge
                  variant="outline"
                  className="font-mono text-[11px] uppercase tracking-wider bg-background"
                >
                  {profile.role}
                </Badge>
              </div>

              {profile.headline && (
                <p className="mt-1 text-sm font-medium text-foreground/80">
                  {profile.headline}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {profile.location}
                  </span>
                )}
                {profile.company_industry && !isFreelancer && (
                  <span className="flex items-center gap-1">
                    <Building2 className="size-3.5" />
                    {profile.company_industry}
                  </span>
                )}
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="size-3.5" />
                  Joined {new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isOwner ? (
              <Button asChild size="sm">
                <Link href="/profile">Edit Profile</Link>
              </Button>
            ) : (
              <Button asChild size="sm" variant="outline">
                <Link href="/gigs">Browse Work Orders</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Bio Section */}
        {profile.bio && (
          <div className="mt-6 border-t border-border pt-6">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              About
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Social / Portfolio Links Bar */}
        {(profile.github_url || profile.linkedin_url || profile.website_url) && (
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-6">
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
              >
                <GithubIcon className="size-3.5" />
                GitHub
                <ExternalLink className="size-3 text-muted-foreground ml-0.5" />
              </a>
            )}

            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
              >
                <LinkedinIcon className="size-3.5 text-[#0A66C2]" />
                LinkedIn
                <ExternalLink className="size-3 text-muted-foreground ml-0.5" />
              </a>
            )}

            {profile.website_url && (
              <a
                href={profile.website_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
              >
                <Globe className="size-3.5 text-primary" />
                Website / Portfolio
                <ExternalLink className="size-3 text-muted-foreground ml-0.5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Grid: Skills, Stats, and Past Works */}
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {/* Left Column: Skills & Platform Stats */}
        <div className="space-y-6 md:col-span-1">
          {/* Platform Activity Metric */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Platform Track Record
            </h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs text-muted-foreground">
                  {isFreelancer ? "Gigs Completed" : "Gigs Commissioned"}
                </span>
                <span className="font-mono text-sm font-semibold">
                  {completedGigs.length}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs text-muted-foreground">
                  {isFreelancer ? "Total Gigs Taken" : "Total Gigs Posted"}
                </span>
                <span className="font-mono text-sm font-semibold">
                  {(platformGigs || []).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Status</span>
                <span className="inline-flex items-center gap-1 font-mono text-xs text-status-paid font-medium">
                  <CheckCircle2 className="size-3" /> Verified Member
                </span>
              </div>
            </div>
          </div>

          {/* Tech Stack / Skills */}
          {isFreelancer && profile.skills && profile.skills.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                <Code2 className="size-3.5" /> Skills & Tech Stack
              </h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="font-mono text-xs font-normal"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Past Work & Highlights */}
        <div className="space-y-6 md:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                <Sparkles className="size-3.5" />
                {isFreelancer ? "Featured Work & Projects" : "Recent Work Orders"}
              </h3>
            </div>

            {isFreelancer ? (
              profile.past_works && profile.past_works.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {profile.past_works.map((work, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border/80 bg-background p-4 transition-all hover:border-primary/40"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 font-medium text-sm text-foreground">
                          {work.title}
                          {work.year && (
                            <span className="font-mono text-xs text-muted-foreground">
                              ({work.year})
                            </span>
                          )}
                        </div>
                        {work.url && (
                          <a
                            href={work.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary underline"
                          >
                            Live Demo <ExternalLink className="size-3" />
                          </a>
                        )}
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {work.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-xs text-muted-foreground">
                  No showcased projects listed yet.
                </p>
              )
            ) : (
              <div className="mt-4 space-y-3">
                {platformGigs && platformGigs.length > 0 ? (
                  platformGigs.map((gig) => (
                    <div
                      key={gig.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-3.5"
                    >
                      <div>
                        <p className="text-sm font-medium">{gig.title}</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          Status: {gig.status}
                        </p>
                      </div>
                      <span className="font-mono text-sm font-semibold">
                        ${gig.price.toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No work orders published yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
