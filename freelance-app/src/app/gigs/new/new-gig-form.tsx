"use client";

import { useActionState } from "react";
import { createGig, type GigActionResult } from "@/app/gigs/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";

export function NewGigForm() {
  const [state, formAction] = useActionState<GigActionResult, FormData>(
    createGig,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Build a landing page in Webflow"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          placeholder="What needs to be done, any requirements, deadlines, etc."
          required
          rows={5}
          className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none md:text-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="price">Price (USD)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min="1"
          step="0.01"
          placeholder="250"
          required
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <SubmitButton pendingText="Posting...">Post gig</SubmitButton>
    </form>
  );
}
