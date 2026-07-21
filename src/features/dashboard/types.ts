import type { InspirationBoard, Note, Project, Resource } from "@/types/entities";

/** Aggregated "latest across modules" snapshot shown on the dashboard. */
export interface DashboardSummary {
  latestProject: Project | null;
  latestNote: Note | null;
  latestBoard: InspirationBoard | null;
  latestResource: Resource | null;
}
