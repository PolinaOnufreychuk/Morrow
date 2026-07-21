import type { Resource } from "@/types/entities";

const base = {
  isArchived: false,
  projectId: null,
  description: null,
  tags: [] as string[],
  createdAt: "2026-07-05T09:00:00Z",
  updatedAt: "2026-07-14T09:00:00Z",
};

/** One fixture per each of the 6 resource kinds. */
export const resourceFixtures: Resource[] = [
  {
    ...base,
    id: "res-link",
    kind: "link",
    title: "Laws of UX",
    url: "https://lawsofux.com",
    description: "A collection of best practices designers can use when building interfaces.",
    tags: ["ux", "reference"],
  },
  {
    ...base,
    id: "res-repo",
    kind: "repo",
    title: "shadcn/ui",
    url: "https://github.com/shadcn-ui/ui",
    owner: "shadcn-ui",
    repoName: "ui",
    language: "TypeScript",
    stars: 68000,
    tags: ["components", "react"],
  },
  {
    ...base,
    id: "res-video",
    kind: "video",
    title: "Designing calm interfaces",
    url: "https://youtube.com/watch?v=example",
    thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    duration: "18:24",
    tags: ["talk"],
  },
  {
    ...base,
    id: "res-pdf",
    kind: "pdf",
    title: "Type scale cheatsheet",
    url: "https://example.com/type-scale.pdf",
    filename: "type-scale-cheatsheet.pdf",
    tags: ["typography"],
  },
  {
    ...base,
    id: "res-preview",
    kind: "preview",
    title: "Aurora design file",
    url: "https://figma.com/file/aurora",
    previewImageUrl: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&q=80",
    isFigma: true,
    tags: ["figma", "source"],
  },
  {
    ...base,
    id: "res-image",
    kind: "image",
    title: "Texture pack — paper grain",
    url: "https://example.com/paper-grain",
    coverImageUrl: "https://images.unsplash.com/photo-1512418490979-92798cec1380?w=800&q=80",
    tags: ["texture"],
  },
];
