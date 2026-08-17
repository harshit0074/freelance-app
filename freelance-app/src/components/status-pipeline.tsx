import { STATUS_META, STATUS_ORDER } from "@/lib/status";
import type { GigStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusPipeline({
  current,
  className,
}: {
  current?: GigStatus;
  className?: string;
}) {
  const currentIndex = current ? STATUS_META[current].order : -1;

  return (
    <div
      className={cn(
        "flex items-stretch overflow-x-auto rounded-md border border-border bg-card",
        className
      )}
    >
      {STATUS_ORDER.map((status, i) => {
        const meta = STATUS_META[status];
        const isActive = status === current;
        const isPast = current !== undefined && i < currentIndex;
        return (
          <div
            key={status}
            className={cn(
              "flex flex-1 items-center gap-2 whitespace-nowrap border-r border-dashed border-border px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider last:border-r-0 sm:px-4",
              isActive && "bg-secondary",
              !current && "text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                isActive || isPast ? meta.dot : "bg-border"
              )}
            />
            <span className={isActive ? "text-foreground" : undefined}>
              {meta.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
