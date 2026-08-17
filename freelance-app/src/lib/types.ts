export type GigStatus = "open" | "claimed" | "submitted" | "approved" | "paid";

export type Gig = {
  id: string;
  company_id: string;
  title: string;
  description: string;
  price: number;
  status: GigStatus;
  claimed_by: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  role: "company" | "freelancer";
  created_at: string;
};
