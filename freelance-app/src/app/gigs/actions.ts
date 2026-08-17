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
