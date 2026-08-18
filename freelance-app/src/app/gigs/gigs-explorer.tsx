"use client";

import { useState, useMemo } from "react";
import { GigCard } from "@/components/gig-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Gig } from "@/lib/types";
import {
  ArrowDownUp,
  Briefcase,
  Code2,
  Filter,
  Inbox,
  LayoutGrid,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

const CATEGORIES = [
  "All Categories",
  "Development & Code",
  "Design & UI/UX",
  "AI & Machine Learning",
  "Writing & Content",
  "Marketing & SEO",
  "DevOps & Cloud",
  "General / Other",
];

export function GigsExplorer({ initialGigs }: { initialGigs: Gig[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState<"newest" | "price-desc" | "price-asc">("newest");

  const filteredGigs = useMemo(() => {
    let list = [...initialGigs];

    // Filter by search query
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((gig) => {
        const titleMatch = gig.title.toLowerCase().includes(q);
        const descMatch = gig.description.toLowerCase().includes(q);
        const skillMatch = gig.skills_required?.some((s) => s.toLowerCase().includes(q));
        const catMatch = gig.category?.toLowerCase().includes(q);
        return titleMatch || descMatch || skillMatch || catMatch;
      });
    }

    // Filter by category
    if (selectedCategory !== "All Categories") {
      list = list.filter(
        (gig) => gig.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort
    if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else {
      list.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return list;
  }, [initialGigs, search, selectedCategory, sortBy]);

  return (
    <div className="space-y-6">
      {/* Search & Sort Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by keywords, skills (e.g. Next.js, Figma), or title..."
            className="pl-9 h-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <ArrowDownUp className="size-3.5" />
            <span>Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label="Sort gigs by"
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="newest">Newest First</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="price-asc">Price: Low to High</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-full px-3.5 py-1 text-xs font-mono transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground font-medium shadow-xs"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span>
          Showing {filteredGigs.length} of {initialGigs.length} open work orders
        </span>
        {selectedCategory !== "All Categories" && (
          <button
            onClick={() => setSelectedCategory("All Categories")}
            className="text-primary underline hover:opacity-80"
          >
            Clear category filter
          </button>
        )}
      </div>

      {/* Gigs Grid */}
      {filteredGigs.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGigs.map((gig) => (
            <GigCard key={gig.id} gig={gig} href={`/gigs/${gig.id}`} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">
          <Inbox className="size-8" strokeWidth={1.5} />
          <div>
            <h3 className="font-semibold text-foreground text-sm">No gigs found</h3>
            <p className="mt-1 text-xs max-w-sm">
              {search || selectedCategory !== "All Categories"
                ? "Try adjusting your search query or removing filters to see more results."
                : "There are currently no open work orders. Check back soon or post a new one!"}
            </p>
          </div>
          {(search || selectedCategory !== "All Categories") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All Categories");
              }}
              className="mt-2 text-xs"
            >
              Reset Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
