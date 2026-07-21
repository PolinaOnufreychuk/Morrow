import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: ReactNode;
  eyebrow?: string;
  description?: string;
  /** Primary action(s) for the screen — every screen has one clear primary action. */
  actions?: ReactNode;
  className?: string;
}

/** Consistent page header used across every module page. */
export function PageHeader({ title, eyebrow, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="flex flex-col gap-1">
        {eyebrow && <span className="eyebrow text-text-tertiary">{eyebrow}</span>}
        <h1 className="text-[28px] font-light leading-tight text-text-primary">{title}</h1>
        {description && <p className="text-[14px] text-text-secondary">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
