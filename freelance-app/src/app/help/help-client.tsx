"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Briefcase,
  Building,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Mail,
  MessageSquare,
  Search,
  Send,
  ShieldCheck,
  Zap,
} from "lucide-react";

type FAQItem = {
  q: string;
  a: string;
  category: "freelancers" | "companies" | "general";
};

const FAQS: FAQItem[] = [
  {
    category: "freelancers",
    q: "How do I claim a work order (gig)?",
    a: "Browse the 'Browse Gigs' tab. If you find a gig that matches your skills and budget, click on it and hit 'Claim this Gig'. Once claimed, the gig is locked exclusively to you — no bidding or competing against others.",
  },
  {
    category: "freelancers",
    q: "How and when do I submit my completed work?",
    a: "Go to your Dashboard, find your claimed gig, and click 'Submit Deliverable'. Provide the URL to your project (GitHub repository, Figma design file, Loom walkthrough, or live website preview) along with completion notes.",
  },
  {
    category: "freelancers",
    q: "When and how do I receive payout?",
    a: "Once you submit your deliverable, the company reviews the work. When the company clicks 'Approve', a payment record is generated and the company marks it as 'Paid'. You can track your accumulated earnings on your dashboard.",
  },
  {
    category: "companies",
    q: "How do I post a work order?",
    a: "Sign in with your Company account and click 'Post a gig' on your Dashboard or navigation bar. Fill in the title, category, fixed price (USD), required skills, and clear acceptance criteria.",
  },
  {
    category: "companies",
    q: "What happens after I post a gig?",
    a: "Your gig immediately appears on the public marketplace. Freelancers can view requirements and claim it. You can see which freelancer claimed your gig and view their full resume, skills, and past projects on their public profile.",
  },
  {
    category: "companies",
    q: "Can I inspect the deliverable before approving?",
    a: "Yes! When the freelancer submits the work, you will see their deliverable link and notes on your Dashboard. You can review the work before clicking 'Approve Work'.",
  },
  {
    category: "general",
    q: "What is GigBoard's philosophy vs traditional bidding sites?",
    a: "GigBoard eliminates the frustrating bidding wars and proposals race. Companies set fixed-price work orders with clear deliverables, and qualified freelancers pick them up on-demand.",
  },
  {
    category: "general",
    q: "How does the prototype handle payments?",
    a: "For the prototype, GigBoard provides transparent status ledger tracking (Open -> Claimed -> Submitted -> Approved -> Paid) with automatic pending payment records upon approval, validating the complete business flow.",
  },
];

export function HelpClient() {
  const [activeTab, setActiveTab] = useState<"all" | "freelancers" | "companies" | "general">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [contactSent, setContactSent] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesTab = activeTab === "all" || faq.category === activeTab;
    const matchesQuery =
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !contactMessage) return;
    setContactSent(true);
    setContactName("");
    setContactEmail("");
    setContactMessage("");
  };

  return (
    <div className="space-y-12">
      {/* Search & Category Filter */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. claim, submit, payment, resume)..."
            className="pl-10 h-10"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={activeTab === "all" ? "default" : "outline"}
            onClick={() => setActiveTab("all")}
          >
            All Questions
          </Button>
          <Button
            size="sm"
            variant={activeTab === "freelancers" ? "default" : "outline"}
            onClick={() => setActiveTab("freelancers")}
          >
            <Briefcase className="size-3.5 mr-1" /> For Freelancers
          </Button>
          <Button
            size="sm"
            variant={activeTab === "companies" ? "default" : "outline"}
            onClick={() => setActiveTab("companies")}
          >
            <Building className="size-3.5 mr-1" /> For Companies
          </Button>
          <Button
            size="sm"
            variant={activeTab === "general" ? "default" : "outline"}
            onClick={() => setActiveTab("general")}
          >
            <ShieldCheck className="size-3.5 mr-1" /> Platform & Security
          </Button>
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Frequently Asked Questions ({filteredFaqs.length})
        </h2>

        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-border bg-card transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-4 text-left font-medium text-sm hover:bg-muted/30 transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180 text-foreground" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-border/60 bg-muted/20 px-4 py-3.5 text-xs text-muted-foreground leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No matching questions found. Try searching a different term or reach out below.
            </p>
          )}
        </div>
      </div>

      {/* Support & Contact Form */}
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <MessageSquare className="size-4 text-primary" />
          <div>
            <h2 className="font-semibold text-base">Contact Support & Help Desk</h2>
            <p className="text-xs text-muted-foreground">Need help with an order, account question, or platform issue?</p>
          </div>
        </div>

        {contactSent ? (
          <div className="mt-6 flex flex-col items-center gap-2 rounded-lg border border-status-paid/40 bg-status-paid/10 p-6 text-center text-status-paid">
            <CheckCircle2 className="size-8" />
            <h3 className="font-semibold text-sm">Message Sent Successfully!</h3>
            <p className="text-xs text-foreground/80 max-w-sm">
              Our team has received your support request. We will review your message and respond promptly.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContactSent(false)}
              className="mt-3"
            >
              Send another message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="contactName" className="text-xs">Your Name</Label>
                <Input
                  id="contactName"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contactEmail" className="text-xs">Email Address</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contactMessage" className="text-xs">How can we assist you?</Label>
              <textarea
                id="contactMessage"
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Describe your question, report an issue with a work order, or suggest a feature..."
                className="w-full rounded-md border border-input bg-background p-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="sm">
                <Send className="size-3.5 mr-1.5" /> Submit Support Request
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
