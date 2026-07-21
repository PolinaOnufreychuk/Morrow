import { type ReactNode } from "react";
import { StatusPill } from "@/components/shared/StatusPill";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { Project } from "@/types/entities";

export interface ProjectInfoSidebarProps {
  project: Project;
}

/**
 * Sticky metadata sidebar for Project Details. Uses real CSS
 * `position: sticky` so it tracks the page as embedded content scrolls.
 */
export function ProjectInfoSidebar({ project }: ProjectInfoSidebarProps) {
  return (
    <aside className="sticky top-8 flex w-full flex-col gap-5 rounded-card border border-border-subtle bg-surface-card/60 p-5">
      <Field label="Status">
        <StatusPill status={project.status} />
      </Field>

      <Field label="Deadline">
        <span className="text-[14px] text-text-primary">{formatDate(project.deadline)}</span>
      </Field>

      {project.tags.length > 0 && (
        <Field label="Tags">
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="sage">
                {tag}
              </Badge>
            ))}
          </div>
        </Field>
      )}

      {project.externalLinks.length > 0 && (
        <Field label="Links">
          <div className="flex flex-col gap-1.5">
            {project.externalLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-[14px] text-sage-700 underline-offset-2 hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        </Field>
      )}

      <Field label="Created">
        <span className="text-[14px] text-text-secondary">{formatDate(project.createdAt)}</span>
      </Field>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="eyebrow text-text-tertiary">{label}</span>
      {children}
    </div>
  );
}
