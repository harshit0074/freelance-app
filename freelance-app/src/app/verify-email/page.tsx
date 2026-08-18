"use client";

import { useActionState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmailOtp, resendEmailOtp, type AuthResult } from "@/app/auth/actions";
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

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [verifyState, verifyAction] = useActionState<AuthResult, FormData>(
    verifyEmailOtp,
    undefined
  );
  const [resendState, resendAction] = useActionState<AuthResult, FormData>(
    resendEmailOtp,
    undefined
  );

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            {email ? (
              <>
                We sent a 6-digit code to <strong>{email}</strong>. Enter it
                below to verify your account.
              </>
            ) : (
              "Enter the 6-digit code we emailed you."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={verifyAction} className="flex flex-col gap-4">
            <input type="hidden" name="email" value={email} />

            <div className="flex flex-col gap-2">
              <Label htmlFor="token">Verification code</Label>
              <Input
                id="token"
                name="token"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                maxLength={6}
                required
                className="text-center font-mono text-lg tracking-[0.3em]"
              />
            </div>

            {verifyState?.error && (
              <p className="text-sm text-destructive">{verifyState.error}</p>
            )}

            <SubmitButton pendingText="Verifying..." className="w-full">
              Verify
            </SubmitButton>
          </form>

          <form action={resendAction} className="mt-4">
            <input type="hidden" name="email" value={email} />
            {resendState?.message && (
              <p className="mb-2 text-center text-xs text-muted-foreground">
                {resendState.message}
              </p>
            )}
            {resendState?.error && (
              <p className="mb-2 text-center text-xs text-destructive">
                {resendState.error}
              </p>
            )}
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full"
            >
              Resend code
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}
