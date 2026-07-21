import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types/entities";

/**
 * Small status indicator — a tinted pill (background + text share the
 * status's hue), matching the approved reference design. No dot; the tint
 * itself carries the status.
 */
const STATUS_META: Record<ProjectStatus, { label: string; className: string }> = {
  "in-progress": { label: "In progress", className: "bg-sage-100 text-sage-700" },
  review: { label: "Review", className: "bg-blush-100 text-blush-600" },
  done: { label: "Completed", className: "bg-sage-100 text-sage-700" },
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
        "inline-flex items-center rounded-chip px-2.5 py-1 text-[12px] font-medium",
        meta.className,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}

export { STATUS_META };
