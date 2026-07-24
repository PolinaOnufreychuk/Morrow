import type { Resource, ResourceKind } from "@/types/entities";
import { CATEGORY_OPTIONS } from "@/lib/categories";

export type { Resource, ResourceKind };

export type ResourceSort = "recent" | "created" | "title";

/** Fixed category list for the Resources filter popover — matched against `resource.tags`. */
export const RESOURCE_CATEGORY_OPTIONS = CATEGORY_OPTIONS;

export type ResourceCategoryFilter = "all" | (typeof RESOURCE_CATEGORY_OPTIONS)[number];

/** Plain `Omit` collapses a discriminated union to its shared keys — this
 * distributes over each member so kind-specific fields (readingMinutes/
 * owner/etc.) survive. */
type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

export type CreateResourceInput = DistributiveOmit<
  Resource,
  "id" | "isArchived" | "archivedAt" | "createdAt" | "updatedAt"
>;

export type UpdateResourceInput = Partial<Resource> & { id: string };

/** A domain-level error the service layer can throw — distinct from
 * unexpected/transport failures, so the UI can render a field-aware or
 * user-facing message instead of a generic "something went wrong". */
export class ResourceValidationError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ResourceValidationError";
  }
}

export class ResourceNotFoundError extends Error {
  constructor(id: string) {
    super(`Resource "${id}" was not found.`);
    this.name = "ResourceNotFoundError";
  }
}
