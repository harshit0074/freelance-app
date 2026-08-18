"use client";

import { useActionState } from "react";
import { createGig, type GigActionResult } from "@/app/gigs/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";

const CATEGORIES = [
  "Development & Code",
  "Design & UI/UX",
  "AI & Machine Learning",
  "Writing & Content",
  "Marketing & SEO",
  "DevOps & Cloud",
  "General / Other",
];

export function NewGigForm() {
  const [state, formAction] = useActionState<GigActionResult, FormData>(
    createGig,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Work Order Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Build an API integration with Stripe & Supabase"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            defaultValue="Development & Code"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Fixed Payout (USD)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="1"
            step="0.01"
            placeholder="350"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="skillsRequired">Skills / Tech Stack (comma separated)</Label>
        <Input
          id="skillsRequired"
          name="skillsRequired"
          placeholder="e.g. Next.js, TypeScript, PostgreSQL, Tailwind"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Detailed Description & Deliverables</Label>
        <textarea
          id="description"
          name="description"
          placeholder="Specify exact scope of work, technical requirements, acceptance criteria, and what the freelancer must submit to get approved."
          required
          rows={6}
          className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <SubmitButton pendingText="Publishing Work Order..." size="lg" className="w-full">
        Publish Work Order
      </SubmitButton>
    </form>
  );
}
