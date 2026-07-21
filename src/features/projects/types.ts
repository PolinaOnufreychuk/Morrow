import type { Project, ProjectStatus } from "@/types/entities";

export type { Project, ProjectStatus };

/** Tab filter for the Projects list — "all" plus the real statuses. */
export type ProjectStatusFilter = "all" | ProjectStatus;

export type ProjectSort = "recent" | "deadline" | "title";

/** Payloads for the (stubbed) create/update mutations. */
export type CreateProjectInput = Omit<
  Project,
  "id" | "isArchived" | "createdAt" | "updatedAt"
>;

export type UpdateProjectInput = Partial<CreateProjectInput> & { id: string };
