import type { Resource, ResourceKind } from "@/types/entities";

export type { Resource, ResourceKind };

export type ResourceSort = "recent" | "title";

/** Fixed category list for the Resources filter popover — matched against `resource.tags`. */
export const RESOURCE_CATEGORY_OPTIONS = [
  "UX Research",
  "AI",
  "Accessibility",
  "Motion",
  "Development",
  "Branding",
  "Fintech",
  "Typography",
] as const;

export type ResourceCategoryFilter = "all" | (typeof RESOURCE_CATEGORY_OPTIONS)[number];
