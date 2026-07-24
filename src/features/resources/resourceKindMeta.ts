import type { ResourceKind } from "@/types/entities";

export interface ResourceKindMeta {
  kind: ResourceKind;
  label: string;
  description: string;
}

/** Kinds the Create Resource modal can actually produce. "preview" (Figma)
 * used to be missing here — the schema/card rendering always supported it,
 * only the creatable list didn't. Figma personal-access-token metadata
 * fetch and generic website unfurling both need a server-side proxy this
 * app doesn't have, so "preview" resources are created with just a manual
 * cover image + an "Is this a Figma file?" toggle, same as every other kind
 * that doesn't get auto-fetched metadata. */
export const CREATABLE_RESOURCE_KINDS = ["link", "repo", "video", "pdf", "preview", "image"] as const;

/** Single source of truth for the creatable resource kinds' labels/
 * descriptions — mirrors `notes/noteTypeMeta.ts`'s pattern so the Resource
 * Type picker reads like the Note Type picker (docs/DESIGN.md consistency). */
export const RESOURCE_KIND_META: Record<(typeof CREATABLE_RESOURCE_KINDS)[number], ResourceKindMeta> = {
  link: { kind: "link", label: "Website", description: "A plain link with a title and description." },
  repo: { kind: "repo", label: "Repository", description: "A GitHub repo — owner, language, stars." },
  video: { kind: "video", label: "Video", description: "A YouTube link with a thumbnail." },
  pdf: { kind: "pdf", label: "PDF", description: "A document, saved by its filename." },
  preview: { kind: "preview", label: "Preview", description: "A Figma file or design preview." },
  image: { kind: "image", label: "Image", description: "A single cover image." },
};
