import { projectFixtures } from "@/features/projects/projects.fixtures";
import { noteFixtures } from "@/features/notes/notes.fixtures";
import { boardFixtures } from "@/features/inspiration/inspiration.fixtures";
import { resourceFixtures } from "@/features/resources/resources.fixtures";
import type { DashboardSummary } from "./types";

/** The designer's display name — the Canela italic accent in the greeting. */
export const DESIGNER_NAME = "Polina";

/** Composes the dashboard snapshot from each module's fixtures. */
export const dashboardSummaryFixture: DashboardSummary = {
  latestProject: projectFixtures[0] ?? null,
  latestNote: noteFixtures[0] ?? null,
  latestBoard: boardFixtures[0] ?? null,
  latestResource: resourceFixtures[0] ?? null,
};
