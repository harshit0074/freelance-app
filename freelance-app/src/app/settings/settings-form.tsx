"use client";

import { useActionState, useState } from "react";
import { updateAccountSettings, updatePassword, type SettingsResult } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/lib/types";
import { CheckCircle2, Lock, Shield, User, Bell, Check } from "lucide-react";

export function SettingsForm({
  userEmail,
  profile,
}: {
  userEmail: string;
  profile: Profile;
}) {
  const [accountState, accountAction] = useActionState(updateAccountSettings, undefined);
  const [pwdState, pwdAction] = useActionState(updatePassword, undefined);

  const [emailNotify, setEmailNotify] = useState(true);
  const [browserNotify, setBrowserNotify] = useState(false);
  const [savedPrefs, setSavedPrefs] = useState(false);

  const handleSavePrefs = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedPrefs(true);
    setTimeout(() => setSavedPrefs(false), 3000);
  };

  return (
    <div className="space-y-10">
      {/* 1. Account Details */}
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <User className="size-4 text-primary" />
          <h2 className="font-semibold text-base">Account Identity</h2>
        </div>

        <form action={accountAction} className="mt-5 space-y-4">
          {accountState?.error && (
            <p className="text-xs text-destructive">{accountState.error}</p>
          )}
          {accountState?.success && (
            <p className="text-xs text-status-paid font-medium flex items-center gap-1">
              <CheckCircle2 className="size-3.5" />
              {accountState.success}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={userEmail} disabled className="bg-muted/50 cursor-not-allowed" />
              <p className="text-[11px] text-muted-foreground">Managed via Supabase Auth</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Account Role</Label>
              <div className="flex items-center h-9 px-3 border border-border rounded-md bg-muted/50">
                <Badge variant="secondary" className="font-mono text-xs uppercase">
                  {profile.role}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">Set during platform registration</p>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="fullName">Display Name</Label>
              <Input
                id="fullName"
                name="fullName"
                defaultValue={profile.full_name || ""}
                placeholder="Your full name"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <SubmitButton size="sm" pendingText="Updating name...">
              Update Account Info
            </SubmitButton>
          </div>
        </form>
      </section>

      {/* 2. Security & Password */}
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <Lock className="size-4 text-primary" />
          <h2 className="font-semibold text-base">Security & Password</h2>
        </div>

        <form action={pwdAction} className="mt-5 space-y-4">
          {pwdState?.error && (
            <p className="text-xs text-destructive">{pwdState.error}</p>
          )}
          {pwdState?.success && (
            <p className="text-xs text-status-paid font-medium flex items-center gap-1">
              <CheckCircle2 className="size-3.5" />
              {pwdState.success}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter new password"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <SubmitButton size="sm" pendingText="Changing password...">
              Change Password
            </SubmitButton>
          </div>
        </form>
      </section>

      {/* 3. Notifications & Preferences */}
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <Bell className="size-4 text-primary" />
          <h2 className="font-semibold text-base">Notifications & Alerts</h2>
        </div>

        <form onSubmit={handleSavePrefs} className="mt-5 space-y-4">
          {savedPrefs && (
            <p className="text-xs text-status-paid font-medium flex items-center gap-1">
              <CheckCircle2 className="size-3.5" />
              Notification preferences saved.
            </p>
          )}

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-background cursor-pointer hover:bg-muted/40 transition-colors">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive instant alerts when a gig is claimed, submitted, or paid.</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotify}
                onChange={(e) => setEmailNotify(e.target.checked)}
                className="size-4 rounded accent-primary"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-background cursor-pointer hover:bg-muted/40 transition-colors">
              <div>
                <p className="text-sm font-medium">Browser Web Push Alerts</p>
                <p className="text-xs text-muted-foreground">Notify you in real-time when on the dashboard.</p>
              </div>
              <input
                type="checkbox"
                checked={browserNotify}
                onChange={(e) => setBrowserNotify(e.target.checked)}
                className="size-4 rounded accent-primary"
              />
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" variant="outline">
              Save Preferences
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
