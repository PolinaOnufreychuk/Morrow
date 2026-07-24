import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description?: string;
  /** Primary action guiding the user to the next step (docs/CLAUDE.md UX rules). */
  action?: ReactNode;
  icon?: ReactNode;
  /** Small wireframe illustration — see EmptyStateIllustration, unified per page's real card shape. */
  illustration?: ReactNode;
  className?: string;
}

/** Intentional empty state — always points toward the next action. */
export function EmptyState({
  title,
  description,
  action,
  icon,
  illustration,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card border border-dashed border-border-default/50 bg-cream-100/50 px-6 py-20 text-center sm:py-24",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_65%_15%,rgba(143,169,135,0.05),transparent_60%)]"
      />
      <div className="relative flex flex-col items-center">
        {illustration}
        {icon && <div className="mt-8 text-text-tertiary">{icon}</div>}
        <div className={cn("flex flex-col gap-1.5", illustration || icon ? "mt-8" : undefined)}>
          <h3 className="font-body text-[14px] text-text-tertiary">{title}</h3>
          {description && (
            <p className="mx-auto max-w-[280px] text-[13px] leading-relaxed text-text-tertiary">
              {description}
            </p>
          )}
        </div>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}
