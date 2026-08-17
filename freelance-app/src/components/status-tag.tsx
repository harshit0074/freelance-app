import { STATUS_META } from "@/lib/status";
import type { GigStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusTag({
  status,
  className,
}: {
  status: GigStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-foreground",
        className
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}
