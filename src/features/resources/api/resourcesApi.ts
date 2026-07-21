import type { Resource } from "@/types/entities";
import { resourceFixtures } from "../resources.fixtures";

/** Stubbed data access — no live supabase calls yet (scaffolding only). */

export async function fetchResources(): Promise<Resource[]> {
  // TODO: implement — supabase.from("resources").select().eq("is_archived", false)
  return resourceFixtures;
}

export async function fetchResourceById(id: string): Promise<Resource | null> {
  // TODO: implement
  return resourceFixtures.find((resource) => resource.id === id) ?? null;
}

export async function createResource(input: Resource): Promise<Resource> {
  // TODO: implement
  void input;
  throw new Error("createResource not implemented");
}

export async function updateResource(input: Resource): Promise<Resource> {
  // TODO: implement
  void input;
  throw new Error("updateResource not implemented");
}

export async function archiveResource(id: string): Promise<void> {
  // TODO: implement
  void id;
  throw new Error("archiveResource not implemented");
}

export async function deleteResource(id: string): Promise<void> {
  // TODO: implement
  void id;
  throw new Error("deleteResource not implemented");
}
