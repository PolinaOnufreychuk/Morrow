import type { ZodError } from "zod";
import type { Resource } from "@/types/entities";
import { createResourceSchema, updateResourceSchema } from "../schema";
import { ResourceValidationError } from "../types";
import type { UpdateResourceInput } from "../types";
import { resourcesRepository } from "./resources.repository";

/**
 * Business layer: the ONLY thing hooks import. Mirrors
 * `projects.service.ts`'s pattern.
 */

function toValidationError(error: ZodError): ResourceValidationError {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_root";
    fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
  }
  return new ResourceValidationError("Please fix the highlighted fields.", fieldErrors);
}

export async function listResources(): Promise<Resource[]> {
  return resourcesRepository.list();
}

export async function listArchivedResources(): Promise<Resource[]> {
  return resourcesRepository.listArchived();
}

export async function getResource(id: string): Promise<Resource | null> {
  return resourcesRepository.getById(id);
}

export async function createResource(input: unknown): Promise<Resource> {
  const parsed = createResourceSchema.safeParse(input);
  if (!parsed.success) throw toValidationError(parsed.error);
  return resourcesRepository.create(parsed.data);
}

export async function updateResource(input: unknown): Promise<Resource> {
  const parsed = updateResourceSchema.safeParse(input);
  if (!parsed.success) throw toValidationError(parsed.error);
  const { id, ...patch } = parsed.data as UpdateResourceInput;
  return resourcesRepository.update(id, patch);
}

export async function linkResourceToProject(resourceId: string, projectId: string): Promise<void> {
  return resourcesRepository.linkToProject(resourceId, projectId);
}

export async function unlinkResourceFromProject(resourceId: string, projectId: string): Promise<void> {
  return resourcesRepository.unlinkFromProject(resourceId, projectId);
}

export async function archiveResource(id: string): Promise<Resource> {
  return resourcesRepository.archive(id);
}

export async function unarchiveResource(id: string): Promise<Resource> {
  return resourcesRepository.unarchive(id);
}

export async function deleteResource(id: string): Promise<void> {
  return resourcesRepository.remove(id);
}

export async function bulkDeleteResources(ids: string[]): Promise<void> {
  return resourcesRepository.bulkRemove(ids);
}
