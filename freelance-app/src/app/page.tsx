import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusPipeline } from "@/components/status-pipeline";
import {
  ArrowRight,
  Bot,
  Briefcase,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  FileCode2,
  FileCheck2,
  Layers,
  Layout,
  Lock,
  Palette,
  Rocket,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-background to-muted/20 px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-mono text-muted-foreground shadow-xs">
            <span className="flex size-2 rounded-full bg-status-paid" />
            <span>GIGBOARD 2.0 · Work orders for modern builders</span>
          </div>

          <h1 className="mt-6 font-mono text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-[1.08]">
            Post the work.
            <br />
            <span className="text-muted-foreground">Pick it up.</span>
            <br />
            Get paid.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Eliminate endless proposal wars and bidding friction. Companies publish fixed-price tickets with transparent deliverables. Freelancers claim and execute on demand.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="h-12 px-8 text-sm font-semibold shadow-md">
              <Link href="/signup">
                Get Started Free <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 text-sm font-semibold">
              <Link href="/gigs">Browse Open Work Orders</Link>
            </Button>
          </div>

          {/* Key Value Metric Badges */}
          <div className="mt-16 grid grid-cols-2 gap-4 border-t border-border pt-10 sm:grid-cols-4">
            <div className="space-y-1">
              <p className="font-mono text-2xl font-bold text-foreground">0%</p>
              <p className="text-xs text-muted-foreground">Bidding Overhead</p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-2xl font-bold text-foreground">1-Click</p>
              <p className="text-xs text-muted-foreground">Ticket Claiming</p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-2xl font-bold text-foreground">100%</p>
              <p className="text-xs text-muted-foreground">Fixed Price Clarity</p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-2xl font-bold text-foreground">Verified</p>
              <p className="text-xs text-muted-foreground">Resume & Deliverables</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories Directory */}
      <section className="border-b border-border px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Work Domains
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Explore Gigs by Category
              </h2>
            </div>
            <Button variant="ghost" asChild size="sm">
              <Link href="/gigs">
                View All Categories <ArrowRight className="size-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Development & Code",
                desc: "Full-stack apps, React, Next.js, APIs, Supabase, backend bug fixes",
                icon: Code2,
                tag: "High Demand",
              },
              {
                title: "Design & UI/UX",
                desc: "Figma wireframes, design systems, landing page UI, responsive prototypes",
                icon: Palette,
                tag: "Creative",
              },
              {
                title: "AI & Machine Learning",
                desc: "LLM prompt engineering, OpenAI integrations, data scraping, automation bots",
                icon: Cpu,
                tag: "Trending",
              },
              {
                title: "DevOps & Cloud",
                desc: "Vercel deployments, Docker pipelines, PostgreSQL database tuning, auth setups",
                icon: Database,
                tag: "Infrastructure",
              },
              {
                title: "Writing & Content",
                desc: "Technical documentation, SEO landing pages, API tutorials, case studies",
                icon: FileCode2,
                tag: "Content",
              },
              {
                title: "Marketing & Growth",
                desc: "Conversion rate audits, launch campaigns, analytics telemetry",
                icon: TrendingUp,
                tag: "Growth",
              },
            ].map((category, idx) => {
              const Icon = category.icon;
              return (
                <Link
                  key={idx}
                  href="/gigs"
                  className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4.5" />
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase">
                      {category.tag}
                    </Badge>
                  </div>
                  <h3 className="mt-4 font-semibold text-base group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {category.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. The 5-Step Ticket Lifecycle Pipeline */}
      <section className="border-b border-border bg-muted/20 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Structured Workflow
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            How Every Work Order Moves
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Every gig follows a transparent, immutable status ledger from publish to payout.
          </p>

          <div className="mt-10 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs text-left">
            <StatusPipeline />

            <div className="mt-10 grid gap-6 sm:grid-cols-3 border-t border-border pt-8 text-xs text-muted-foreground">
              <div className="space-y-1.5">
                <p className="font-mono text-sm font-semibold text-foreground">1. Post & Lock</p>
                <p>Company writes requirements and sets fixed bounty. Freelancer claims and locks the ticket instantly.</p>
              </div>
              <div className="space-y-1.5">
                <p className="font-mono text-sm font-semibold text-foreground">2. Deliver & Review</p>
                <p>Freelancer submits work links (GitHub, preview URL) with completion notes for company inspection.</p>
              </div>
              <div className="space-y-1.5">
                <p className="font-mono text-sm font-semibold text-foreground">3. Approve & Payout</p>
                <p>Company approves the deliverable, generating the verified payout record directly to the talent.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why GigBoard Comparison */}
      <section className="border-b border-border px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Direct Comparison
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Built for Modern Speed vs Traditional Freelance
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 space-y-4">
              <span className="font-mono text-xs font-bold uppercase text-destructive">
                Traditional Freelance Platforms
              </span>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold">✕</span> 50+ freelancers competing on proposal bids
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold">✕</span> 20% platform cut on every single transaction
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold">✕</span> Days of back-and-forth negotiations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold">✕</span> Unclear acceptance criteria & scope creep
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-status-paid/30 bg-status-paid/5 p-6 space-y-4">
              <span className="font-mono text-xs font-bold uppercase text-status-paid">
                GigBoard Ledger Approach
              </span>
              <ul className="space-y-2.5 text-xs text-foreground/90 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-status-paid shrink-0" /> Zero bidding — instant claiming by qualified talent
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-status-paid shrink-0" /> 100% transparent fixed price on every ticket
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-status-paid shrink-0" /> Direct deliverable submission & verification
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-status-paid shrink-0" /> Professional resume, skills badges, and portfolio
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Production Footer */}
      <footer className="border-t border-border bg-card px-4 py-16 text-xs text-muted-foreground">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-mono text-sm font-bold tracking-wider text-foreground">
                <div className="flex size-6 items-center justify-center rounded bg-primary text-primary-foreground">
                  <Ticket className="size-3.5" />
                </div>
                GIGBOARD
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                The streamlined work order marketplace. Companies publish, freelancers execute, payouts transfer.
              </p>
              <div className="font-mono text-[11px] text-muted-foreground">
                Built on Next.js 16 & Supabase.
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="font-mono font-semibold uppercase tracking-wider text-foreground">
                Marketplace
              </p>
              <ul className="space-y-2">
                <li><Link href="/gigs" className="hover:text-foreground">Browse Open Gigs</Link></li>
                <li><Link href="/gigs/new" className="hover:text-foreground">Post a Work Order</Link></li>
                <li><Link href="/signup" className="hover:text-foreground">Join as Freelancer</Link></li>
                <li><Link href="/signup" className="hover:text-foreground">Hire Talent</Link></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <p className="font-mono font-semibold uppercase tracking-wider text-foreground">
                Account & Tools
              </p>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
                <li><Link href="/profile" className="hover:text-foreground">Resume & Portfolio</Link></li>
                <li><Link href="/settings" className="hover:text-foreground">Account Settings</Link></li>
                <li><Link href="/help" className="hover:text-foreground">Help & Support FAQ</Link></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <p className="font-mono font-semibold uppercase tracking-wider text-foreground">
                Platform Health
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-1.5 text-status-paid font-medium">
                  <span className="size-1.5 rounded-full bg-status-paid" />
                  All Systems Operational
                </li>
                <li><span>Supabase Auth & Database Online</span></li>
                <li><span>Vercel Edge Network Protected</span></li>
                <li><span>Encrypted Deliverable Vault</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-8 text-[11px]">
            <p>© 2026 GigBoard Inc. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/help" className="hover:text-foreground">Terms of Service</Link>
              <Link href="/help" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="/help" className="hover:text-foreground">Dispute Resolution</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
