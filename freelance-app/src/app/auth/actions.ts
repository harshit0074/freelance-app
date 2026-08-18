"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type AuthResult = { error?: string; message?: string } | undefined;

const THAPAR_EMAIL_PATTERN = /@thapar\.edu$/i;

export async function signup(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!fullName || !email || !password || !role) {
    return { error: "Please fill in all fields." };
  }
  if (role !== "company" && role !== "freelancer") {
    return { error: "Please choose whether you're a company or a freelancer." };
  }
  // Server-side check for a nice, specific error message.
  // The database trigger (see supabase/06_freelancer_email_restriction.sql)
  // enforces this as the unbypassable backstop even if this check is skipped.
  if (role === "freelancer" && !THAPAR_EMAIL_PATTERN.test(email)) {
    return {
      error: "Freelancer accounts must use a thapar.edu email address.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}

export async function login(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Give a more actionable message for the most common post-signup snag.
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return {
        error: `Please verify your email first. `,
      };
    }
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function verifyEmailOtp(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const email = formData.get("email") as string;
  const token = formData.get("token") as string;

  if (!email || !token) {
    return { error: "Please enter the 6-digit code from your email." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "signup",
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function resendEmailOtp(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Missing email address." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  if (error) {
    return { error: error.message };
  }

  return { message: "New code sent — check your inbox." };
}

export async function requestPasswordReset(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Please enter your email address." };
  }

  const supabase = await createClient();

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?type=recovery&next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  // Always show success, even if the email doesn't exist — this avoids
  // leaking which addresses have accounts.
  return {
    message: "If an account exists for that email, a reset link is on its way.",
  };
}

export async function resetPassword(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const password = formData.get("password") as string;

  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Your reset link has expired. Please request a new one.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
