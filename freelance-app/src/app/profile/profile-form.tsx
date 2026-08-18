"use client";

import { useActionState, useState } from "react";
import { updateProfile, type ProfileActionResult } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { Profile, PastWork } from "@/lib/types";
import {
  Briefcase,
  ExternalLink,
  Globe,
  MapPin,
  Plus,
  Trash2,
  UserCheck,
} from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, isPending] = useActionState<ProfileActionResult, FormData>(
    updateProfile,
    undefined
  );

  const [skills, setSkills] = useState<string[]>(profile.skills || []);
  const [newSkill, setNewSkill] = useState("");

  const [pastWorks, setPastWorks] = useState<PastWork[]>(
    profile.past_works && Array.isArray(profile.past_works) ? profile.past_works : []
  );

  const [workTitle, setWorkTitle] = useState("");
  const [workUrl, setWorkUrl] = useState("");
  const [workDesc, setWorkDesc] = useState("");
  const [workYear, setWorkYear] = useState("");

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddWork = () => {
    if (!workTitle.trim() || !workDesc.trim()) return;
    setPastWorks([
      ...pastWorks,
      {
        title: workTitle.trim(),
        url: workUrl.trim() || undefined,
        description: workDesc.trim(),
        year: workYear.trim() || undefined,
      },
    ]);
    setWorkTitle("");
    setWorkUrl("");
    setWorkDesc("");
    setWorkYear("");
  };

  const handleRemoveWork = (index: number) => {
    setPastWorks(pastWorks.filter((_, i) => i !== index));
  };

  const isFreelancer = profile.role === "freelancer";

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="flex items-center gap-2 rounded-md border border-status-paid/40 bg-status-paid/10 p-3 text-sm text-status-paid font-medium">
          <UserCheck className="size-4" />
          {state.success}
        </div>
      )}

      {/* Hidden inputs to serialize skills and pastWorks */}
      <input type="hidden" name="skills" value={skills.join(",")} />
      <input type="hidden" name="pastWorks" value={JSON.stringify(pastWorks)} />

      {/* Section 1: Basic Information */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-5">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          1. Basic Information
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name / Display Name</Label>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={profile.full_name || ""}
              placeholder="e.g. Alex Carter"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="headline">
              {isFreelancer ? "Professional Headline" : "Company Tagline"}
            </Label>
            <Input
              id="headline"
              name="headline"
              defaultValue={profile.headline || ""}
              placeholder={
                isFreelancer
                  ? "e.g. Senior Full-Stack Engineer (React / Next.js)"
                  : "e.g. Next-Gen Cloud & AI Solutions"
              }
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="location"
                name="location"
                className="pl-9"
                defaultValue={profile.location || ""}
                placeholder="e.g. San Francisco, CA / Remote"
              />
            </div>
          </div>

          {!isFreelancer && (
            <div className="space-y-2">
              <Label htmlFor="companyIndustry">Industry / Sector</Label>
              <Input
                id="companyIndustry"
                name="companyIndustry"
                defaultValue={profile.company_industry || ""}
                placeholder="e.g. Software, E-Commerce, Fintech"
              />
            </div>
          )}

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="bio">
              {isFreelancer ? "Bio & Resume Summary" : "About the Company"}
            </Label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={profile.bio || ""}
              placeholder={
                isFreelancer
                  ? "Write a brief overview of your background, experience, key strengths, and what kinds of projects you excel at..."
                  : "Describe your company, mission, and the type of work you post on GigBoard..."
              }
              className="w-full rounded-md border border-input bg-background p-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Online Presence & Portfolio Links */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-5">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          2. Social Links & Portfolio
        </h3>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="githubUrl" className="flex items-center gap-1.5">
              <GithubIcon className="size-3.5" /> GitHub URL
            </Label>
            <Input
              id="githubUrl"
              name="githubUrl"
              type="url"
              defaultValue={profile.github_url || ""}
              placeholder="https://github.com/username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinUrl" className="flex items-center gap-1.5">
              <LinkedinIcon className="size-3.5" /> LinkedIn URL
            </Label>
            <Input
              id="linkedinUrl"
              name="linkedinUrl"
              type="url"
              defaultValue={profile.linkedin_url || ""}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="websiteUrl" className="flex items-center gap-1.5">
              <Globe className="size-3.5" /> Portfolio / Website
            </Label>
            <Input
              id="websiteUrl"
              name="websiteUrl"
              type="url"
              defaultValue={profile.website_url || ""}
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Tech Stack & Skills (Only for Freelancers) */}
      {isFreelancer && (
        <div className="space-y-4 rounded-lg border border-border bg-card p-5">
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            3. Skills & Tech Stack
          </h3>

          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="e.g. Next.js, TypeScript, PostgreSQL, Figma"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddSkill}
              className="shrink-0"
            >
              <Plus className="size-4 mr-1" /> Add Skill
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 font-mono text-xs"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">
                No skills added yet. Add your primary languages, frameworks, or tools.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Section 4: Past Work Showcase (Only for Freelancers) */}
      {isFreelancer && (
        <div className="space-y-4 rounded-lg border border-border bg-card p-5">
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            4. Past Work & Project Showcase
          </h3>

          <div className="space-y-3 rounded-md border border-dashed border-border p-4 bg-muted/20">
            <p className="text-xs font-medium text-foreground">Add a project or past achievement</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                value={workTitle}
                onChange={(e) => setWorkTitle(e.target.value)}
                placeholder="Project title (e.g. E-Commerce Checkout API)"
              />
              <Input
                value={workUrl}
                onChange={(e) => setWorkUrl(e.target.value)}
                type="url"
                placeholder="Live link or GitHub URL (optional)"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <textarea
                value={workDesc}
                onChange={(e) => setWorkDesc(e.target.value)}
                placeholder="What did you build? What technologies were used and what was the impact?"
                rows={2}
                className="w-full sm:col-span-2 rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <div className="flex flex-col gap-2">
                <Input
                  value={workYear}
                  onChange={(e) => setWorkYear(e.target.value)}
                  placeholder="Year (e.g. 2025)"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddWork}
                  className="mt-auto"
                >
                  <Plus className="size-3.5 mr-1" /> Add Project
                </Button>
              </div>
            </div>
          </div>

          {/* List of existing past projects */}
          <div className="space-y-3 pt-2">
            {pastWorks.length > 0 ? (
              pastWorks.map((work, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-4 rounded-md border border-border bg-background p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">
                        {work.title}
                      </span>
                      {work.year && (
                        <span className="font-mono text-xs text-muted-foreground">
                          ({work.year})
                        </span>
                      )}
                      {work.url && (
                        <a
                          href={work.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-xs text-primary underline ml-1"
                        >
                          <ExternalLink className="size-3 ml-0.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {work.description}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveWork(idx)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">
                No past projects added yet. Showcase 1-3 highlights to demonstrate your expertise to companies.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Saving changes..." : "Save Profile Details"}
        </Button>
      </div>
    </form>
  );
}
