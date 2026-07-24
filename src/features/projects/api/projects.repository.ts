import type { ExternalLink, Project, ProjectStatus } from "@/types/entities";
import type { CreateProjectInput } from "../schema";
import { ProjectNotFoundError } from "../types";
import { supabase } from "@/lib/supabase/client";

/**
 * Pure data-access contract — no validation, no business rules (that's
 * projects.service.ts). Every method signature mirrors what a Supabase
 * query would return, so swapping the implementation later only touches
 * this one file — nothing above it (service, hooks, components) needs to
 * change.
 */
export interface ProjectsRepository {
  list(): Promise<Project[]>;
  /** Archived projects only — backs the Archive screen's Project rows. */
  listArchived(): Promise<Project[]>;
  getById(id: string): Promise<Project | null>;
  create(input: CreateProjectInput): Promise<Project>;
  /** Operates on the full domain shape (unlike the schema-validated input
   * types) since callers include internal-only fields like `isArchived`. */
  update(id: string, patch: Partial<Project>): Promise<Project>;
  archive(id: string): Promise<Project>;
  unarchive(id: string): Promise<Project>;
  remove(id: string): Promise<void>;
  bulkArchive(ids: string[]): Promise<Project[]>;
  bulkRemove(ids: string[]): Promise<void>;
}

/** Raw shape of a `projects` row as Supabase returns it (snake_case). */
interface ProjectRow {
  id: string;
  title: string;
  cover_image_url: string | null;
  description: string | null;
  status: ProjectStatus;
  deadline: string | null;
  category: string | null;
  tags: string[];
  external_links: ExternalLink[];
  notes: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    coverImageUrl: row.cover_image_url,
    description: row.description,
    status: row.status,
    deadline: row.deadline,
    category: row.category,
    tags: row.tags,
    externalLinks: row.external_links,
    notes: row.notes,
    isArchived: row.is_archived,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function projectToInsertRow(input: CreateProjectInput) {
  return {
    title: input.title,
    cover_image_url: input.coverImageUrl,
    description: input.description,
    status: input.status,
    deadline: input.deadline,
    category: input.category,
    tags: input.tags,
    external_links: input.externalLinks,
    notes: input.notes,
  };
}

/** Only includes keys actually present on the patch, so a partial update
 * never clobbers unrelated columns back to `undefined`/null. */
function projectToUpdateRow(patch: Partial<Project>) {
  const row: Record<string, unknown> = {};
  if ("title" in patch) row.title = patch.title;
  if ("coverImageUrl" in patch) row.cover_image_url = patch.coverImageUrl;
  if ("description" in patch) row.description = patch.description;
  if ("status" in patch) row.status = patch.status;
  if ("deadline" in patch) row.deadline = patch.deadline;
  if ("category" in patch) row.category = patch.category;
  if ("tags" in patch) row.tags = patch.tags;
  if ("externalLinks" in patch) row.external_links = patch.externalLinks;
  if ("notes" in patch) row.notes = patch.notes;
  if ("isArchived" in patch) row.is_archived = patch.isArchived;
  return row;
}

class SupabaseProjectsRepository implements ProjectsRepository {
  async list(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_archived", false)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as ProjectRow[]).map(rowToProject);
  }

  async listArchived(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_archived", true)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data as ProjectRow[]).map(rowToProject);
  }

  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? rowToProject(data as ProjectRow) : null;
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .insert(projectToInsertRow(input))
      .select()
      .single();
    if (error) throw error;
    return rowToProject(data as ProjectRow);
  }

  async update(id: string, patch: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .update(projectToUpdateRow(patch))
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new ProjectNotFoundError(id);
    return rowToProject(data as ProjectRow);
  }

  async archive(id: string): Promise<Project> {
    return this.update(id, { isArchived: true });
  }

  async unarchive(id: string): Promise<Project> {
    return this.update(id, { isArchived: false });
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
  }

  async bulkArchive(ids: string[]): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .update({ is_archived: true })
      .in("id", ids)
      .select();
    if (error) throw error;
    return (data as ProjectRow[]).map(rowToProject);
  }

  async bulkRemove(ids: string[]): Promise<void> {
    const { error } = await supabase.from("projects").delete().in("id", ids);
    if (error) throw error;
  }
}

export const projectsRepository: ProjectsRepository = new SupabaseProjectsRepository();
