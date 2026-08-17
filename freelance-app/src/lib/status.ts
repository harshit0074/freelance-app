import type { GigStatus } from "@/lib/types";

export const STATUS_META: Record<
  GigStatus,
  { label: string; dot: string; order: number }
> = {
  open: { label: "Open", dot: "bg-status-open", order: 0 },
  claimed: { label: "Claimed", dot: "bg-status-claimed", order: 1 },
  submitted: { label: "Submitted", dot: "bg-status-submitted", order: 2 },
  approved: { label: "Approved", dot: "bg-status-approved", order: 3 },
  paid: { label: "Paid", dot: "bg-status-paid", order: 4 },
};

export const STATUS_ORDER: GigStatus[] = [
  "open",
  "claimed",
  "submitted",
  "approved",
  "paid",
];
