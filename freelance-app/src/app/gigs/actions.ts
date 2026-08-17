"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type GigActionResult = { error: string } | undefined;

export async function createGig(
  _prevState: GigActionResult,
  formData: FormData
): Promise<GigActionResult> {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priceRaw = formData.get("price") as string;
  const price = Number(priceRaw);

  if (!title || !description || !priceRaw) {
    return { error: "Please fill in all fields." };
  }
  if (Number.isNaN(price) || price <= 0) {
    return { error: "Price must be a positive number." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Double-check the signed-in user is actually a company.
  // (The page itself also checks this, but we re-verify here since
  // server actions can technically be called directly.)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "company") {
    return { error: "Only companies can post gigs." };
  }

  const { error } = await supabase.from("gigs").insert({
    company_id: user.id,
    title,
    description,
    price,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function claimGig(
  _prevState: GigActionResult,
  formData: FormData
): Promise<GigActionResult> {
  const gigId = formData.get("gigId") as string;

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

  if (profile?.role !== "freelancer") {
    return { error: "Only freelancers can claim gigs." };
  }

  // The `.eq("status", "open")` guards against a race where two
  // freelancers click claim at nearly the same time — whoever's
  // update lands first flips status to "claimed", and the second
  // update matches zero rows (since status is no longer "open") and fails.
  const { data, error } = await supabase
    .from("gigs")
    .update({ status: "claimed", claimed_by: user.id })
    .eq("id", gigId)
    .eq("status", "open")
    .select()
    .single();

  if (error || !data) {
    return { error: "This gig was already claimed by someone else." };
  }

  revalidatePath(`/gigs/${gigId}`);
  revalidatePath("/gigs");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
