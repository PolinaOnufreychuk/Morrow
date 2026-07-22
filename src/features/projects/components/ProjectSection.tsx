import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ProjectSectionProps {
  eyebrow: string;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Shared bordered section shell for Project Details' body sections (Linked
 * Inspiration/Notes/Resources, External Links, Attachments, Project Notes) —
 * one wrapper guarantees consistent header/spacing treatment across all of
 * them instead of five near-duplicate section components.
 */
export function ProjectSection({ eyebrow, headerAction, children, className }: ProjectSectionProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-card border border-border-subtle bg-surface-card/40 p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="eyebrow text-text-tertiary">{eyebrow}</span>
        {headerAction}
      </div>
      {children}
    </section>
  );
}
