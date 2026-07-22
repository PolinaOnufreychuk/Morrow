import type { Project, ProjectStatus } from "@/types/entities";

export type { Project, ProjectStatus };
export type { CreateProjectInput, UpdateProjectInput, ProjectInput } from "./schema";
export { PROJECT_STATUSES } from "./schema";

/** Tab filter for the Projects list — "all" plus the real statuses. */
export type ProjectStatusFilter = "all" | ProjectStatus;

/**
 * Project "Category" isn't a separate data field — it reads/writes
 * `project.tags[0]` (see `useProjectEditState`). This fixed list matches the
 * category-like first tags already used across the existing project
 * fixtures (Mobile/Web/Design system/Physical), distinct from Resources'
 * subject-matter category vocabulary (UX Research/AI/etc. — see
 * `src/lib/categories.ts`), since projects are categorized by platform/medium
 * rather than topic.
 */
export const PROJECT_CATEGORY_OPTIONS = ["Mobile", "Web", "Design system", "Physical"] as const;

/** A domain-level error the service layer can throw — distinct from
 * unexpected/transport failures, so the UI can render a field-aware or
 * user-facing message instead of a generic "something went wrong". */
export class ProjectValidationError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ProjectValidationError";
  }
}

export class ProjectNotFoundError extends Error {
  constructor(id: string) {
    super(`Project "${id}" was not found.`);
    this.name = "ProjectNotFoundError";
  }
}
