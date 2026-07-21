import type { ZodError } from "zod";
import type { Project } from "@/types/entities";
import { createProjectSchema, updateProjectSchema } from "../schema";
import { ProjectValidationError } from "../types";
import { projectsRepository } from "./projects.repository";

/**
 * Business layer: the ONLY thing hooks import. Validates input against the
 * schema before it ever reaches the repository, and is where future
 * cross-cutting rules would live (e.g. "can't delete a project that still
 * has linked content" — none needed yet, so this stays thin on purpose).
 * Components and hooks never import the repository directly.
 */

function toValidationError(error: ZodError): ProjectValidationError {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_root";
    fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
  }
  return new ProjectValidationError("Please fix the highlighted fields.", fieldErrors);
}

export async function listProjects(): Promise<Project[]> {
  return projectsRepository.list();
}

export async function listArchivedProjects(): Promise<Project[]> {
  return projectsRepository.listArchived();
}

export async function getProject(id: string): Promise<Project | null> {
  return projectsRepository.getById(id);
}

export async function createProject(input: unknown): Promise<Project> {
  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) throw toValidationError(parsed.error);
  return projectsRepository.create(parsed.data);
}

export async function updateProject(input: unknown): Promise<Project> {
  const parsed = updateProjectSchema.safeParse(input);
  if (!parsed.success) throw toValidationError(parsed.error);
  const { id, ...patch } = parsed.data;
  return projectsRepository.update(id, patch);
}

export async function archiveProject(id: string): Promise<Project> {
  return projectsRepository.archive(id);
}

export async function unarchiveProject(id: string): Promise<Project> {
  return projectsRepository.unarchive(id);
}

export async function deleteProject(id: string): Promise<void> {
  return projectsRepository.remove(id);
}

export async function bulkArchiveProjects(ids: string[]): Promise<Project[]> {
  return projectsRepository.bulkArchive(ids);
}

export async function bulkDeleteProjects(ids: string[]): Promise<void> {
  return projectsRepository.bulkRemove(ids);
}
