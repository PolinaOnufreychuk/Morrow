import type { Resource } from "@/types/entities";
import type { CreateResourceInput, UpdateResourceInput } from "../types";
import { resourceFixtures } from "../resources.fixtures";

/**
 * In-memory data access — a module-level store seeded from fixtures, mirroring
 * `projects.repository.ts`'s pattern so swapping in real Supabase calls later
 * only touches this file.
 */

const LATENCY_MS = 350;
const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

function generateId(): string {
  return `resource-${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

let store: Resource[] = resourceFixtures.map((resource) => ({ ...resource }));

export async function fetchResources(): Promise<Resource[]> {
  await delay();
  return store.map((resource) => ({ ...resource }));
}

export async function fetchResourceById(id: string): Promise<Resource | null> {
  await delay();
  const found = store.find((resource) => resource.id === id);
  return found ? { ...found } : null;
}

export async function createResource(input: CreateResourceInput): Promise<Resource> {
  await delay();
  const resource = {
    ...input,
    id: generateId(),
    isArchived: false,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  } as Resource;
  store = [resource, ...store];
  return { ...resource };
}

async function patchResource(id: string, patch: Partial<Resource>): Promise<Resource> {
  await delay();
  const index = store.findIndex((resource) => resource.id === id);
  if (index === -1) throw new Error(`Resource not found: ${id}`);
  const updated = { ...store[index], ...patch, id, updatedAt: nowIso() } as Resource;
  store = [...store.slice(0, index), updated, ...store.slice(index + 1)];
  return { ...updated };
}

export async function updateResource(input: UpdateResourceInput): Promise<Resource> {
  const { id, ...patch } = input;
  return patchResource(id, patch);
}

export async function archiveResource(id: string): Promise<void> {
  await patchResource(id, { isArchived: true });
}

export async function deleteResource(id: string): Promise<void> {
  await delay();
  const existed = store.some((resource) => resource.id === id);
  if (!existed) throw new Error(`Resource not found: ${id}`);
  store = store.filter((resource) => resource.id !== id);
}
