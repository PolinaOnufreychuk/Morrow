import type { Resource, ResourceKind } from "@/types/entities";
import type { CreateResourceInput } from "../types";
import { ResourceNotFoundError } from "../types";
import { supabase } from "@/lib/supabase/client";

/**
 * Pure data-access contract — mirrors `projects.repository.ts`'s shape.
 */
export interface ResourcesRepository {
  list(): Promise<Resource[]>;
  listArchived(): Promise<Resource[]>;
  getById(id: string): Promise<Resource | null>;
  create(input: CreateResourceInput): Promise<Resource>;
  update(id: string, patch: Partial<Resource>): Promise<Resource>;
  archive(id: string): Promise<Resource>;
  unarchive(id: string): Promise<Resource>;
  remove(id: string): Promise<void>;
}

/** Wide-table row: one row per resource, only the columns for `kind` populated. */
interface ResourceRow {
  id: string;
  kind: ResourceKind;
  title: string;
  url: string;
  description: string | null;
  tags: string[];
  reading_minutes: number | null;
  owner: string | null;
  repo_name: string | null;
  language: string | null;
  stars: number | null;
  thumbnail_url: string | null;
  duration: string | null;
  filename: string | null;
  page_count: number | null;
  preview_image_url: string | null;
  is_figma: boolean;
  cover_image_url: string | null;
  project_id: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

function rowToResource(row: ResourceRow): Resource {
  const base = {
    id: row.id,
    title: row.title,
    url: row.url,
    description: row.description,
    tags: row.tags,
    projectId: row.project_id,
    isArchived: row.is_archived,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  switch (row.kind) {
    case "link":
      return { ...base, kind: "link", readingMinutes: row.reading_minutes };
    case "repo":
      return {
        ...base,
        kind: "repo",
        owner: row.owner ?? "",
        repoName: row.repo_name ?? "",
        language: row.language,
        stars: row.stars,
      };
    case "video":
      return {
        ...base,
        kind: "video",
        thumbnailUrl: row.thumbnail_url,
        duration: row.duration,
      };
    case "pdf":
      return { ...base, kind: "pdf", filename: row.filename ?? "", pageCount: row.page_count };
    case "preview":
      return {
        ...base,
        kind: "preview",
        previewImageUrl: row.preview_image_url,
        isFigma: row.is_figma,
      };
    case "image":
      return { ...base, kind: "image", coverImageUrl: row.cover_image_url ?? "" };
  }
}

/** Spreads whichever variant's fields are present into the wide row shape —
 * every key omitted here is left untouched on update. */
function resourceToRow(input: Partial<Resource>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if ("title" in input) row.title = input.title;
  if ("url" in input) row.url = input.url;
  if ("description" in input) row.description = input.description;
  if ("tags" in input) row.tags = input.tags;
  if ("projectId" in input) row.project_id = input.projectId;
  if ("isArchived" in input) row.is_archived = input.isArchived;
  if (!("kind" in input) || input.kind === undefined) return row;

  row.kind = input.kind;
  switch (input.kind) {
    case "link":
      row.reading_minutes = input.readingMinutes;
      break;
    case "repo":
      row.owner = input.owner;
      row.repo_name = input.repoName;
      row.language = input.language;
      row.stars = input.stars;
      break;
    case "video":
      row.thumbnail_url = input.thumbnailUrl;
      row.duration = input.duration;
      break;
    case "pdf":
      row.filename = input.filename;
      row.page_count = input.pageCount;
      break;
    case "preview":
      row.preview_image_url = input.previewImageUrl;
      row.is_figma = input.isFigma;
      break;
    case "image":
      row.cover_image_url = input.coverImageUrl;
      break;
  }
  return row;
}

class SupabaseResourcesRepository implements ResourcesRepository {
  async list(): Promise<Resource[]> {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("is_archived", false)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as ResourceRow[]).map(rowToResource);
  }

  async listArchived(): Promise<Resource[]> {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("is_archived", true)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data as ResourceRow[]).map(rowToResource);
  }

  async getById(id: string): Promise<Resource | null> {
    const { data, error } = await supabase.from("resources").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? rowToResource(data as ResourceRow) : null;
  }

  async create(input: CreateResourceInput): Promise<Resource> {
    const { data, error } = await supabase
      .from("resources")
      .insert(resourceToRow(input))
      .select()
      .single();
    if (error) throw error;
    return rowToResource(data as ResourceRow);
  }

  async update(id: string, patch: Partial<Resource>): Promise<Resource> {
    const { data, error } = await supabase
      .from("resources")
      .update(resourceToRow(patch))
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new ResourceNotFoundError(id);
    return rowToResource(data as ResourceRow);
  }

  async archive(id: string): Promise<Resource> {
    return this.update(id, { isArchived: true });
  }

  async unarchive(id: string): Promise<Resource> {
    return this.update(id, { isArchived: false });
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) throw error;
  }
}

export const resourcesRepository: ResourcesRepository = new SupabaseResourcesRepository();
