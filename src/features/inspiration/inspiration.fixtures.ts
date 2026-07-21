import type { InspirationBoard, InspirationReference } from "@/types/entities";

export const boardFixtures: InspirationBoard[] = [
  {
    id: "brd-001",
    title: "Calm Fintech UI",
    coverImageUrl:
      "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=800&q=80",
    tags: ["fintech", "minimal", "green"],
    notes: "Muted palettes, generous whitespace, soft depth.",
    projectId: "prj-001",
    isArchived: false,
    createdAt: "2026-06-05T09:00:00Z",
    updatedAt: "2026-07-15T09:00:00Z",
  },
  {
    id: "brd-002",
    title: "Editorial Typography",
    coverImageUrl:
      "https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=800&q=80",
    tags: ["type", "editorial"],
    notes: null,
    projectId: null,
    isArchived: false,
    createdAt: "2026-05-20T09:00:00Z",
    updatedAt: "2026-07-10T09:00:00Z",
  },
];

export const referenceFixtures: InspirationReference[] = [
  {
    id: "ref-001",
    boardId: "brd-001",
    imageUrl: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=600&q=80",
    sourceUrl: "https://dribbble.com/shots/example-1",
    position: 0,
    createdAt: "2026-06-05T09:05:00Z",
  },
  {
    id: "ref-002",
    boardId: "brd-001",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    sourceUrl: null,
    position: 1,
    createdAt: "2026-06-05T09:06:00Z",
  },
  {
    id: "ref-003",
    boardId: "brd-001",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    sourceUrl: "https://behance.net/example-3",
    position: 2,
    createdAt: "2026-06-05T09:07:00Z",
  },
];
