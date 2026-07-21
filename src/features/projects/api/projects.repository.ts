import type { Project } from "@/types/entities";
import type { CreateProjectInput } from "../schema";
import { ProjectNotFoundError } from "../types";
import { projectFixtures } from "../projects.fixtures";

/**
 * Pure data-access contract — no validation, no business rules (that's
 * projects.service.ts). Every method signature mirrors what a Supabase
 * query would return, so swapping `inMemoryProjectsRepository` for a
 * `SupabaseProjectsRepository` later only touches this one file — nothing
 * above it (service, hooks, components) needs to change.
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

/** Simulated network latency so loading states are actually observable. */
const LATENCY_MS = 350;
const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

function generateId(): string {
  return `prj-${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

/**
 * In-memory implementation — a module-level store seeded from fixtures.
 * This is the ENTIRE swap point for a real backend: everything else in the
 * Projects module talks to the `ProjectsRepository` interface, never to
 * this class or its internal array directly.
 */
class InMemoryProjectsRepository implements ProjectsRepository {
  private store: Project[] = projectFixtures.map((project) => ({ ...project }));

  async list(): Promise<Project[]> {
    await delay();
    return this.store.filter((project) => !project.isArchived).map((project) => ({ ...project }));
  }

  async listArchived(): Promise<Project[]> {
    await delay();
    return this.store.filter((project) => project.isArchived).map((project) => ({ ...project }));
  }

  async getById(id: string): Promise<Project | null> {
    await delay();
    const found = this.store.find((project) => project.id === id);
    return found ? { ...found } : null;
  }

  async create(input: CreateProjectInput): Promise<Project> {
    await delay();
    const project: Project = {
      ...input,
      id: generateId(),
      isArchived: false,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.store = [project, ...this.store];
    return { ...project };
  }

  async update(id: string, patch: Partial<Project>): Promise<Project> {
    await delay();
    const index = this.store.findIndex((project) => project.id === id);
    if (index === -1) throw new ProjectNotFoundError(id);
    const updated: Project = { ...this.store[index], ...patch, id, updatedAt: nowIso() };
    this.store = [...this.store.slice(0, index), updated, ...this.store.slice(index + 1)];
    return { ...updated };
  }

  async archive(id: string): Promise<Project> {
    return this.update(id, { isArchived: true });
  }

  async unarchive(id: string): Promise<Project> {
    return this.update(id, { isArchived: false });
  }

  async remove(id: string): Promise<void> {
    await delay();
    const existed = this.store.some((project) => project.id === id);
    if (!existed) throw new ProjectNotFoundError(id);
    this.store = this.store.filter((project) => project.id !== id);
  }

  async bulkArchive(ids: string[]): Promise<Project[]> {
    await delay();
    const idSet = new Set(ids);
    this.store = this.store.map((project) =>
      idSet.has(project.id) ? { ...project, isArchived: true, updatedAt: nowIso() } : project,
    );
    return this.store.filter((project) => idSet.has(project.id)).map((project) => ({ ...project }));
  }

  async bulkRemove(ids: string[]): Promise<void> {
    await delay();
    const idSet = new Set(ids);
    this.store = this.store.filter((project) => !idSet.has(project.id));
  }
}

export const projectsRepository: ProjectsRepository = new InMemoryProjectsRepository();
