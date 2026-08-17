import Link from "next/link";
import { redirect } from "next/navigation";
import { FilePlus2, PackageOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { DashboardGigCard } from "@/components/dashboard-gig-card";
import type { Gig } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const isCompany = profile?.role === "company";

  const { data: gigs } = isCompany
    ? await supabase
        .from("gigs")
        .select("*")
        .eq("company_id", user.id)
        .order("created_at", { ascending: false })
    : await supabase
        .from("gigs")
        .select("*")
        .eq("claimed_by", user.id)
        .order("created_at", { ascending: false });

  const gigList = (gigs ?? []) as Gig[];

  // Total earnings mirrors gig.price for any gig marked 'paid' — the
  // payments table backs this for record-keeping, but summing the
  // gigs we already fetched avoids an extra database round trip.
  const totalEarnings = !isCompany
    ? gigList
        .filter((g) => g.status === "paid")
        .reduce((sum, g) => sum + g.price, 0)
    : 0;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {profile?.role ?? "unknown"} account
          </p>
          <h1 className="mt-1 text-2xl font-medium">
            {profile?.full_name ?? user.email}
          </h1>
        </div>
        {isCompany && (
          <Button asChild>
            <Link href="/gigs/new">
              <FilePlus2 />
              Post a gig
            </Link>
          </Button>
        )}
      </div>

      {!isCompany && (
        <div className="mt-6 flex items-center justify-between rounded-md border border-l-4 border-l-status-paid bg-card px-4 py-3">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Total earnings
          </span>
          <span className="font-mono text-xl font-semibold">
            ${totalEarnings.toFixed(2)}
          </span>
        </div>
      )}

      {isCompany ? (
        <div className="mt-8">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            My posted gigs
          </h2>
          {gigList.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {gigList.map((gig) => (
                <DashboardGigCard key={gig.id} gig={gig} viewerRole="company" />
              ))}
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-center gap-3 rounded-md border border-dashed border-border py-16 text-center text-muted-foreground">
              <PackageOpen className="size-6" strokeWidth={1.5} />
              <p>
                You haven&apos;t posted any gigs yet.{" "}
                <Link href="/gigs/new" className="underline">
                  Post your first one
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            My claimed gigs
          </h2>
          {gigList.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {gigList.map((gig) => (
                <DashboardGigCard
                  key={gig.id}
                  gig={gig}
                  viewerRole="freelancer"
                />
              ))}
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-center gap-3 rounded-md border border-dashed border-border py-16 text-center text-muted-foreground">
              <PackageOpen className="size-6" strokeWidth={1.5} />
              <p>
                You haven&apos;t claimed any gigs yet.{" "}
                <Link href="/gigs" className="underline">
                  Browse open gigs
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
