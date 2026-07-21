import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description?: string;
  /** Primary action guiding the user to the next step (docs/CLAUDE.md UX rules). */
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

/** Intentional empty state — always points toward the next action. */
export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border-default bg-surface-card/40 px-6 py-16 text-center",
        className,
      )}
    >
      {icon && <div className="text-text-tertiary">{icon}</div>}
      <div className="flex flex-col gap-1">
        <h3 className="text-[16px] font-medium text-text-primary">{title}</h3>
        {description && (
          <p className="mx-auto max-w-sm text-[13px] text-text-secondary">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
