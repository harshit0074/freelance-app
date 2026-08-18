"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, type AuthResult } from "@/app/auth/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState<AuthResult, FormData>(
    requestPasswordReset,
    undefined
  );

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
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

            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            {state?.message && (
              <p className="text-sm text-muted-foreground">{state.message}</p>
            )}

            <SubmitButton pendingText="Sending..." className="w-full">
              Send reset link
            </SubmitButton>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Button variant="link" asChild className="h-auto p-0">
              <Link href="/login">Back to log in</Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
