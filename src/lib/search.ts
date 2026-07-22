import { getNoteSearchText } from "@/features/notes/noteSearchText";
import { hostnameOf } from "@/lib/format";
import type { InspirationBoard, Note, Project, Resource } from "@/types/entities";

export interface SearchWorkspaceInput {
  projects: Project[];
  boards: InspirationBoard[];
  notes: Note[];
  resources: Resource[];
}

export interface SearchResults {
  projects: Project[];
  boards: InspirationBoard[];
  notes: Note[];
  resources: Resource[];
}

/** Case-insensitive substring match across every module — the workspace-wide global search. */
export function searchWorkspace(query: string, { projects, boards, notes, resources }: SearchWorkspaceInput): SearchResults {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return { projects: [], boards: [], notes: [], resources: [] };

  const matches = (value: string | null | undefined) => Boolean(value?.toLowerCase().includes(normalized));

  return {
    projects: projects.filter(
      (project) =>
        matches(project.title) ||
        matches(project.description) ||
        matches(project.category) ||
        project.tags.some((tag) => matches(tag)),
    ),
    boards: boards.filter(
      (board) =>
        matches(board.title) || matches(board.notes) || board.tags.some((tag) => matches(tag)),
    ),
    notes: notes.filter((note) => matches(note.title) || matches(getNoteSearchText(note))),
    resources: resources.filter(
      (resource) =>
        matches(resource.title) ||
        matches(resource.description) ||
        resource.tags.some((tag) => matches(tag)) ||
        matches(resource.url) ||
        matches(hostnameOf(resource.url)),
    ),
  };
}
