import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/types";
import { ExternalLink, Eye, User } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  const typedProfile = profile as Profile;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {typedProfile.role} Profile
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase font-semibold text-primary">
              Active
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Profile & Portfolio
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your public bio, tech stack, past works, and social links.
          </p>
        </div>

        <Button variant="outline" asChild size="sm">
          <Link href={`/profile/${user.id}`}>
            <Eye className="size-4 mr-1.5" />
            Preview Public Profile
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        <ProfileForm profile={typedProfile} />
      </div>
    </div>
  );
}
