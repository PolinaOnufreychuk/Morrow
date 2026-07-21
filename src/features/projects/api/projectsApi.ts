import type { Project } from "@/types/entities";
import type { CreateProjectInput, UpdateProjectInput } from "../types";
import { projectFixtures } from "../projects.fixtures";

/**
 * Stubbed data access. Typed async signatures with `// TODO: implement`
 * bodies — NO live `supabase.from()` calls yet (scaffolding only).
 * The Supabase client (src/lib/supabase/client.ts) will be imported here
 * once queries are implemented; it is intentionally not wired up yet.
 */

export async function fetchProjects(): Promise<Project[]> {
  // TODO: implement — supabase.from("projects").select().eq("is_archived", false)
  return projectFixtures;
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  // TODO: implement — supabase.from("projects").select().eq("id", id).single()
  return projectFixtures.find((project) => project.id === id) ?? null;
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  // TODO: implement — supabase.from("projects").insert(...).select().single()
  void input;
  throw new Error("createProject not implemented");
}

export async function updateProject(input: UpdateProjectInput): Promise<Project> {
  // TODO: implement — supabase.from("projects").update(...).eq("id", input.id)
  void input;
  throw new Error("updateProject not implemented");
}

export async function archiveProject(id: string): Promise<void> {
  // TODO: implement — supabase.from("projects").update({ is_archived: true }).eq("id", id)
  void id;
  throw new Error("archiveProject not implemented");
}

export async function deleteProject(id: string): Promise<void> {
  // TODO: implement — supabase.from("projects").delete().eq("id", id)
  void id;
  throw new Error("deleteProject not implemented");
}
