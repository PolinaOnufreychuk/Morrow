import type { Project, ProjectStatus } from "@/types/entities";

export type { Project, ProjectStatus };
export type { CreateProjectInput, UpdateProjectInput, ProjectInput } from "./schema";
export { PROJECT_STATUSES, PROJECT_CATEGORY_OPTIONS } from "./schema";

/** Tab filter for the Projects list — "all" plus the real statuses. */
export type ProjectStatusFilter = "all" | ProjectStatus;

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
