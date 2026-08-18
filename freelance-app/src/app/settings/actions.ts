"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SettingsResult = { error?: string; success?: string } | undefined;

export async function updateAccountSettings(
  _prevState: SettingsResult,
  formData: FormData
): Promise<SettingsResult> {
  const fullName = (formData.get("fullName") as string)?.trim();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to modify settings." };
  }

  if (fullName) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id);

    if (profileError) {
      return { error: profileError.message };
    }
  }

  revalidatePath("/settings");
  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return { success: "Account settings updated successfully." };
}

export async function updatePassword(
  _prevState: SettingsResult,
  formData: FormData
): Promise<SettingsResult> {
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || newPassword.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to change your password." };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password changed successfully." };
}
