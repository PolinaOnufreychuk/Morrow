import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types/entities";

/**
 * Small status indicator with a tiny colored dot (dots are one of the two
 * allowed fully-rounded shapes). The pill body itself uses radius-chip.
 */
const STATUS_META: Record<ProjectStatus, { label: string; dot: string }> = {
  planning: { label: "Planning", dot: "bg-warm-500" },
  "in-progress": { label: "In progress", dot: "bg-sage-600" },
  review: { label: "In review", dot: "bg-blush-400" },
  done: { label: "Done", dot: "bg-sage-900" },
  "on-hold": { label: "On hold", dot: "bg-warm-300" },
};

export interface StatusPillProps {
  status: ProjectStatus;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-chip bg-cream-100 px-2 py-1 text-[12px] font-medium text-text-secondary",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

export { STATUS_META };
