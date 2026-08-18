"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Building2, User } from "lucide-react";
import { signup, type AuthResult } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignupPage() {
  const [state, formAction] = useActionState<AuthResult, FormData>(
    signup,
    undefined
  );

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Sign up as a company to post work, or a freelancer to pick it up.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>I am a...</Label>
              <RoleSelector />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Jane Doe"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </div>

            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}

            <SubmitButton pendingText="Creating account..." className="w-full">
              Sign up
            </SubmitButton>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button variant="link" asChild className="h-auto p-0">
              <Link href="/login">Log in</Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function RoleSelector() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <label className="has-[:checked]:border-primary has-[:checked]:bg-secondary flex cursor-pointer flex-col items-center gap-1.5 rounded-md border border-border p-3 text-sm font-medium transition-colors">
        <Building2 className="size-4" strokeWidth={1.75} />
        <input
          type="radio"
          name="role"
          value="company"
          defaultChecked
          className="sr-only"
        />
        Company
      </label>
      <label className="has-[:checked]:border-primary has-[:checked]:bg-secondary flex cursor-pointer flex-col items-center gap-1.5 rounded-md border border-border p-3 text-sm font-medium transition-colors">
        <User className="size-4" strokeWidth={1.75} />
        <input type="radio" name="role" value="freelancer" className="sr-only" />
        Freelancer
      </label>
    </div>
  );
}
