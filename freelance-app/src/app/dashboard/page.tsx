import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            {profile?.full_name ?? user.email} ·{" "}
            <Badge variant="secondary" className="capitalize">
              {profile?.role ?? "unknown"}
            </Badge>
          </p>
        </div>
        {isCompany && (
          <Button asChild>
            <Link href="/gigs/new">Post a gig</Link>
          </Button>
        )}
      </div>

      {!isCompany && (
        <Card className="mt-6">
          <CardContent className="flex items-center justify-between py-4">
            <span className="text-sm text-muted-foreground">
              Total earnings
            </span>
            <span className="text-xl font-semibold">
              ${totalEarnings.toFixed(2)}
            </span>
          </CardContent>
        </Card>
      )}

      {isCompany ? (
        <div className="mt-8">
          <h2 className="text-lg font-medium">My posted gigs</h2>
          {gigList.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {gigList.map((gig) => (
                <DashboardGigCard key={gig.id} gig={gig} viewerRole="company" />
              ))}
            </div>
          ) : (
            <Card className="mt-4">
              <CardContent className="py-8 text-center text-muted-foreground">
                You haven&apos;t posted any gigs yet.{" "}
                <Link href="/gigs/new" className="underline">
                  Post your first one
                </Link>
                .
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="mt-8">
          <h2 className="text-lg font-medium">My claimed gigs</h2>
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
            <Card className="mt-4">
              <CardContent className="py-8 text-center text-muted-foreground">
                You haven&apos;t claimed any gigs yet.{" "}
                <Link href="/gigs" className="underline">
                  Browse open gigs
                </Link>
                .
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
