import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ProjectSectionProps {
  eyebrow: string;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
  /** "tinted" (default): warm translucent background for Linked
   * Inspiration/Notes/Resources. "solid": opaque white, used by Description/
   * External Links/Attachments/Project Notes. */
  tone?: "tinted" | "solid";
}

/**
 * Shared bordered section shell for Project Details' body sections (Linked
 * Inspiration/Notes/Resources, External Links, Attachments, Project Notes) —
 * one wrapper guarantees consistent header/spacing treatment across all of
 * them instead of five near-duplicate section components.
 */
export function ProjectSection({
  eyebrow,
  headerAction,
  children,
  className,
  tone = "tinted",
}: ProjectSectionProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-card border border-border-subtle p-5",
        tone === "solid" ? "bg-surface-card" : "bg-surface-card/40",
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
