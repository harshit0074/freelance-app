"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { PastWork } from "@/lib/types";

export type ProfileActionResult = { error?: string; success?: string } | undefined;

export async function updateProfile(
  _prevState: ProfileActionResult,
  formData: FormData
): Promise<ProfileActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to update your profile." };
  }

  const fullName = (formData.get("fullName") as string)?.trim() || null;
  const headline = (formData.get("headline") as string)?.trim() || null;
  const bio = (formData.get("bio") as string)?.trim() || null;
  const location = (formData.get("location") as string)?.trim() || null;
  const githubUrl = (formData.get("githubUrl") as string)?.trim() || null;
  const linkedinUrl = (formData.get("linkedinUrl") as string)?.trim() || null;
  const websiteUrl = (formData.get("websiteUrl") as string)?.trim() || null;
  const avatarUrl = (formData.get("avatarUrl") as string)?.trim() || null;
  const companyIndustry = (formData.get("companyIndustry") as string)?.trim() || null;

  // Process skills (comma-separated or lines)
  const skillsRaw = (formData.get("skills") as string) || "";
  const skills = skillsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Process past works (JSON string)
  const pastWorksRaw = (formData.get("pastWorks") as string) || "[]";
  let pastWorks: PastWork[] = [];
  try {
    pastWorks = JSON.parse(pastWorksRaw);
  } catch {
    pastWorks = [];
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      headline,
      bio,
      location,
      github_url: githubUrl,
      linkedin_url: linkedinUrl,
      website_url: websiteUrl,
      avatar_url: avatarUrl,
      company_industry: companyIndustry,
      skills,
      past_works: pastWorks,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath(`/profile/${user.id}`);
  revalidatePath("/dashboard");

  return { success: "Profile saved successfully." };
}
