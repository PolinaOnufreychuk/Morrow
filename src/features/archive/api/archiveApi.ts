import type { ArchiveEntry, ArchiveSourceType, Project } from "@/types/entities";
import { archiveFixtures } from "../archive.fixtures";
import {
  deleteProject,
  listArchivedProjects,
  unarchiveProject,
} from "@/features/projects/api/projects.service";

/**
 * The Archive screen is inherently cross-feature (docs/DATABASE.md: it
 * unions all four archivable tables), so depending on the Projects service
 * here is expected, not a layering violation. Projects is real; Inspiration
 * boards/Notes/Resources still only have fixture data until those modules
 * get their own data layer (see Module 1 stop condition), so their archive
 * rows stay stubbed for now and are merged in alongside the live ones.
 */

function projectToArchiveEntry(project: Project): ArchiveEntry {
  return {
    sourceType: "project",
    id: project.id,
    title: project.title,
    thumbnailUrl: project.coverImageUrl,
    archivedAt: project.updatedAt,
  };
}

export async function fetchArchive(): Promise<ArchiveEntry[]> {
  const archivedProjects = await listArchivedProjects();
  const stubbedOtherTypes = archiveFixtures.filter((entry) => entry.sourceType !== "project");
  return [...archivedProjects.map(projectToArchiveEntry), ...stubbedOtherTypes].sort((a, b) =>
    b.archivedAt.localeCompare(a.archivedAt),
  );
}

function notYetSupported(sourceType: ArchiveSourceType): never {
  const label = sourceType === "inspiration_board" ? "inspiration board" : sourceType;
  throw new Error(`Restoring or deleting a ${label} isn't available yet in this build.`);
}

export async function restoreEntry(sourceType: ArchiveSourceType, id: string): Promise<void> {
  if (sourceType === "project") {
    await unarchiveProject(id);
    return;
  }
  notYetSupported(sourceType);
}

export async function deleteEntryPermanently(
  sourceType: ArchiveSourceType,
  id: string,
): Promise<void> {
  if (sourceType === "project") {
    await deleteProject(id);
    return;
  }
  notYetSupported(sourceType);
}
