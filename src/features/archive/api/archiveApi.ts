import type { ArchiveEntry, ArchiveSourceType, InspirationBoard, Note, Project, Resource } from "@/types/entities";
import {
  deleteProject,
  listArchivedProjects,
  unarchiveProject,
} from "@/features/projects/api/projects.service";
import {
  deleteBoard,
  listArchivedBoards,
  unarchiveBoard,
} from "@/features/inspiration/api/inspiration.service";
import { deleteNote, listArchivedNotes, unarchiveNote } from "@/features/notes/api/notes.service";
import {
  deleteResource,
  listArchivedResources,
  unarchiveResource,
} from "@/features/resources/api/resources.service";

/**
 * The Archive screen is inherently cross-feature (docs/DATABASE.md: it
 * unions all four archivable tables), so depending on all four feature
 * services here is expected, not a layering violation.
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

function boardToArchiveEntry(board: InspirationBoard): ArchiveEntry {
  return {
    sourceType: "inspiration_board",
    id: board.id,
    title: board.title,
    thumbnailUrl: board.coverImageUrl,
    archivedAt: board.updatedAt,
  };
}

/** Only some note types carry an image; the rest fall back to `null`, which
 * ArchiveCard already renders as a type icon instead of a thumbnail. */
function noteToArchiveEntry(note: Note): ArchiveEntry {
  const thumbnailUrl =
    note.type === "image" ? note.coverImageUrl : note.type === "moodboard" ? note.images[0] : null;
  return {
    sourceType: "note",
    id: note.id,
    title: note.title,
    thumbnailUrl,
    archivedAt: note.updatedAt,
  };
}

/** Only some resource kinds carry an image; the rest fall back to `null`. */
function resourceToArchiveEntry(resource: Resource): ArchiveEntry {
  const thumbnailUrl =
    resource.kind === "image"
      ? resource.coverImageUrl
      : resource.kind === "video"
        ? resource.thumbnailUrl
        : resource.kind === "preview"
          ? resource.previewImageUrl
          : null;
  return {
    sourceType: "resource",
    id: resource.id,
    title: resource.title,
    thumbnailUrl,
    archivedAt: resource.updatedAt,
  };
}

export async function fetchArchive(): Promise<ArchiveEntry[]> {
  const [projects, boards, notes, resources] = await Promise.all([
    listArchivedProjects(),
    listArchivedBoards(),
    listArchivedNotes(),
    listArchivedResources(),
  ]);
  return [
    ...projects.map(projectToArchiveEntry),
    ...boards.map(boardToArchiveEntry),
    ...notes.map(noteToArchiveEntry),
    ...resources.map(resourceToArchiveEntry),
  ].sort((a, b) => b.archivedAt.localeCompare(a.archivedAt));
}

export async function restoreEntry(sourceType: ArchiveSourceType, id: string): Promise<void> {
  switch (sourceType) {
    case "project":
      await unarchiveProject(id);
      return;
    case "inspiration_board":
      await unarchiveBoard(id);
      return;
    case "note":
      await unarchiveNote(id);
      return;
    case "resource":
      await unarchiveResource(id);
      return;
  }
}

export async function deleteEntryPermanently(
  sourceType: ArchiveSourceType,
  id: string,
): Promise<void> {
  switch (sourceType) {
    case "project":
      await deleteProject(id);
      return;
    case "inspiration_board":
      await deleteBoard(id);
      return;
    case "note":
      await deleteNote(id);
      return;
    case "resource":
      await deleteResource(id);
      return;
  }
}
