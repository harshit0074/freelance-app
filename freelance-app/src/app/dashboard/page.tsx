import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">
        This is a placeholder — gig management is coming in the next phase.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Your account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Name: </span>
            {profile?.full_name ?? "—"}
          </div>
          <div>
            <span className="text-muted-foreground">Email: </span>
            {user.email}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Role: </span>
            <Badge variant="secondary" className="capitalize">
              {profile?.role ?? "unknown"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
