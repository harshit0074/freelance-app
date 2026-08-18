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
  const category = (formData.get("category") as string) || "General";
  const skillsRaw = (formData.get("skillsRequired") as string) || "";
  const price = Number(priceRaw);

  const skillsRequired = skillsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!title || !description || !priceRaw) {
    return { error: "Please fill in all required fields." };
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
    category,
    skills_required: skillsRequired,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/gigs");
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

export async function submitGig(
  _prevState: GigActionResult,
  formData: FormData
): Promise<GigActionResult> {
  const gigId = formData.get("gigId") as string;
  const submissionUrl = (formData.get("submissionUrl") as string)?.trim() || null;
  const submissionNotes = (formData.get("submissionNotes") as string)?.trim() || null;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("gigs")
    .update({
      status: "submitted",
      submission_url: submissionUrl,
      submission_notes: submissionNotes,
    })
    .eq("id", gigId)
    .eq("claimed_by", user.id)
    .eq("status", "claimed")
    .select()
    .single();

  if (error || !data) {
    return { error: "Couldn't submit this gig. Please refresh and try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/gigs/${gigId}`);
  redirect("/dashboard");
}

export async function approveGig(
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

  const { data, error } = await supabase
    .from("gigs")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
    })
    .eq("id", gigId)
    .eq("company_id", user.id)
    .eq("status", "submitted")
    .select()
    .single();

  if (error || !data) {
    return { error: "Couldn't approve this gig. Please refresh and try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/gigs/${gigId}`);
  redirect("/dashboard");
}

export async function markPaid(
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

  // Mark the payment record as paid first...
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("gig_id", gigId)
    .eq("status", "pending")
    .select()
    .single();

  if (paymentError || !payment) {
    return { error: "Couldn't find a pending payment for this gig." };
  }

  // ...then flip the gig itself to 'paid' so it's reflected everywhere.
  const { data: gig, error: gigError } = await supabase
    .from("gigs")
    .update({ status: "paid" })
    .eq("id", gigId)
    .eq("company_id", user.id)
    .eq("status", "approved")
    .select()
    .single();

  if (gigError || !gig) {
    return { error: "Payment recorded, but couldn't update the gig status." };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/gigs/${gigId}`);
  redirect("/dashboard");
}
