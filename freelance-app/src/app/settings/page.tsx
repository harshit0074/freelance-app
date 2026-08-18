import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./settings-form";
import type { Profile } from "@/lib/types";

export default async function SettingsPage() {
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

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <div className="border-b border-border pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Preferences & Security
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account credentials, security preferences, and system alerts.
        </p>
      </div>

      <div className="mt-8">
        <SettingsForm userEmail={user.email || ""} profile={profile as Profile} />
      </div>
    </div>
  );
}
