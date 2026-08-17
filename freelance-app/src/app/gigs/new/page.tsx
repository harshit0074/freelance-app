import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewGigForm } from "./new-gig-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function NewGigPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "company") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Post a new gig</CardTitle>
          <CardDescription>
            Describe the work and set a price. It'll show up on the public
            gigs board right away.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewGigForm />
        </CardContent>
      </Card>
    </div>
  );
}
