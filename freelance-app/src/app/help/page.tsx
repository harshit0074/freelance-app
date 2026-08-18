import { HelpClient } from "./help-client";
import { HelpCircle, Shield, Sparkles, Ticket } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      {/* Header */}
      <div className="border-b border-border pb-8 text-center sm:text-left">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Knowledge Base & Support
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Help & Learning Center
        </h1>
        <p className="mt-2 text-base text-muted-foreground max-w-2xl">
          Everything you need to know about publishing work orders, claiming gigs, delivering deliverables, and getting paid.
        </p>
      </div>

      {/* Main content */}
      <div className="mt-10">
        <HelpClient />
      </div>
    </div>
  );
}
