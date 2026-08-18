export type GigStatus = "open" | "claimed" | "submitted" | "approved" | "paid";

export type PastWork = {
  title: string;
  url?: string;
  description: string;
  year?: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  role: "company" | "freelancer";
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  website_url?: string | null;
  avatar_url?: string | null;
  skills?: string[] | null;
  past_works?: PastWork[] | null;
  company_industry?: string | null;
  created_at: string;
};

export type Gig = {
  id: string;
  company_id: string;
  title: string;
  description: string;
  price: number;
  category?: string | null;
  skills_required?: string[] | null;
  status: GigStatus;
  claimed_by: string | null;
  submission_url?: string | null;
  submission_notes?: string | null;
  created_at: string;
  approved_at?: string | null;
};
