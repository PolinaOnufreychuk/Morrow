import { type ReactNode } from "react";
import { StatusPill } from "@/components/shared/StatusPill";
import { PropertyDropdown } from "@/components/shared/PropertyDropdown";
import { formatDate, formatRelativeUpdated } from "@/lib/format";
import { PROJECT_STATUSES } from "../schema";
import { PROJECT_CATEGORY_OPTIONS } from "../types";
import { ProjectDeadlineField } from "./ProjectDeadlineField";
import type { Project, ProjectStatus } from "@/types/entities";
import type { ProjectDraft } from "../hooks/useProjectEditState";

const STATUS_LABELS: Record<ProjectStatus, string> = {
  "in-progress": "In progress",
  review: "Review",
  done: "Completed",
};
const STATUS_OPTIONS = PROJECT_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] }));
const CATEGORY_OPTIONS = PROJECT_CATEGORY_OPTIONS.map((value) => ({ value, label: value }));

export interface ProjectInfoSidebarProps {
  project: Project;
  editMode: boolean;
  draft: ProjectDraft;
  onPatch: (patch: Partial<ProjectDraft>) => void;
}

/**
 * Sticky metadata sidebar for Project Details. Uses real CSS
 * `position: sticky` so it tracks the page as embedded content scrolls.
 */
export function ProjectInfoSidebar({ project, editMode, draft, onPatch }: ProjectInfoSidebarProps) {
  return (
    <aside className="sticky top-8 flex w-full flex-col gap-5 rounded-card border border-border-subtle bg-surface-card/60 p-5">
      <span className="eyebrow text-text-tertiary">Project info</span>

      <Field label="Status">
        {editMode ? (
          <PropertyDropdown
            options={STATUS_OPTIONS}
            value={draft.status}
            onValueChange={(value) => onPatch({ status: value })}
          />
        ) : (
          <StatusPill status={project.status} />
        )}
      </Field>

      <Field label="Category">
        {editMode ? (
          <PropertyDropdown
            options={CATEGORY_OPTIONS}
            value={
              (PROJECT_CATEGORY_OPTIONS as readonly string[]).includes(draft.category)
                ? (draft.category as (typeof PROJECT_CATEGORY_OPTIONS)[number])
                : PROJECT_CATEGORY_OPTIONS[0]
            }
            onValueChange={(value) => onPatch({ category: value })}
          />
        ) : (
          <span className="text-[14px] text-text-primary">{project.tags[0] ?? "—"}</span>
        )}
      </Field>

      {editMode ? (
        <ProjectDeadlineField
          label="Due date"
          value={draft.deadline}
          onChange={(value) => onPatch({ deadline: value })}
        />
      ) : (
        <Field label="Due date">
          <span className="text-[14px] text-text-primary">{formatDate(project.deadline)}</span>
        </Field>
      )}

      <Field label="Created">
        <span className="text-[14px] text-text-secondary">{formatDate(project.createdAt)}</span>
      </Field>

      <Field label="Last updated">
        <span className="text-[14px] text-text-secondary">
          Updated {formatRelativeUpdated(project.updatedAt).toLowerCase()}
        </span>
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
