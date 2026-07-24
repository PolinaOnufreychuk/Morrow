import { type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { PropertyDropdown } from "@/components/shared/PropertyDropdown";
import { formatDate, formatRelativeUpdated } from "@/lib/format";
import { useUpdateProject } from "../hooks/useProjects";
import { PROJECT_CATEGORY_OPTIONS, PROJECT_STATUSES } from "../schema";
import { ProjectDeadlineField } from "./ProjectDeadlineField";
import type { ISODateString, Project, ProjectStatus } from "@/types/entities";

const STATUS_LABELS: Record<ProjectStatus, string> = {
  "in-progress": "In progress",
  review: "Review",
  done: "Completed",
};
const STATUS_OPTIONS = PROJECT_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] }));
const CATEGORY_OPTIONS = PROJECT_CATEGORY_OPTIONS.map((value) => ({ value, label: value }));

export interface ProjectInfoSidebarProps {
  project: Project;
}

/**
 * Sticky metadata sidebar for Project Details. Uses real CSS
 * `position: sticky` so it tracks the page as embedded content scrolls.
 *
 * Status/Category/Due date are always live-editable and save immediately on
 * change — independent of the page's own title/description edit mode, per
 * the approved design (only Created/Last updated stay read-only).
 */
export function ProjectInfoSidebar({ project }: ProjectInfoSidebarProps) {
  const updateProject = useUpdateProject();

  return (
    <aside className="sticky top-8 flex w-full flex-col gap-5 rounded-card border border-border-subtle bg-cream-50 p-5">
      <Badge variant="outline" className="w-fit">
        Project info
      </Badge>

      <Field label="Status">
        <PropertyDropdown
          options={STATUS_OPTIONS}
          value={project.status}
          onValueChange={(status) => updateProject.mutate({ id: project.id, status })}
        />
      </Field>

      <Field label="Category">
        <PropertyDropdown
          options={CATEGORY_OPTIONS}
          value={(project.category as (typeof PROJECT_CATEGORY_OPTIONS)[number]) ?? CATEGORY_OPTIONS[0].value}
          onValueChange={(category) => updateProject.mutate({ id: project.id, category })}
        />
      </Field>

      <ProjectDeadlineField
        label="Due date"
        value={project.deadline}
        onChange={(deadline: ISODateString | null) => updateProject.mutate({ id: project.id, deadline })}
      />

      <Field label="Created">
        <ReadOnlyChip>{formatDate(project.createdAt)}</ReadOnlyChip>
      </Field>

      <Field label="Last updated">
        <ReadOnlyChip>Updated {formatRelativeUpdated(project.updatedAt).toLowerCase()}</ReadOnlyChip>
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

/** Matches the filled look of PropertyDropdown/Input so read-only fields sit
 * visually consistent with the editable Status/Category/Due date chips. */
function ReadOnlyChip({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-11 items-center rounded-button bg-cream-100/60 px-3.5 text-[14px] text-text-secondary">
      {children}
    </span>
  );
}
