import type { ArchiveEntry } from "@/types/entities";

/** Unified archive entries across all four archivable source types. */
export const archiveFixtures: ArchiveEntry[] = [
  {
    sourceType: "project",
    id: "prj-archived-1",
    title: "Legacy Marketing Site",
    thumbnailUrl: "https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=400&q=80",
    archivedAt: "2026-06-28T09:00:00Z",
  },
  {
    sourceType: "inspiration_board",
    id: "brd-archived-1",
    title: "Old Brand Explorations",
    thumbnailUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&q=80",
    archivedAt: "2026-06-20T09:00:00Z",
  },
  {
    sourceType: "note",
    id: "note-archived-1",
    title: "Q1 retro notes",
    thumbnailUrl: null,
    archivedAt: "2026-06-15T09:00:00Z",
  },
  {
    sourceType: "resource",
    id: "res-archived-1",
    title: "Deprecated icon set",
    thumbnailUrl: null,
    archivedAt: "2026-06-10T09:00:00Z",
  },
];
