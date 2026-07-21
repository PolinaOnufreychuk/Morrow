import type { ArchiveEntry, ArchiveSourceType } from "@/types/entities";
import { archiveFixtures } from "../archive.fixtures";

/**
 * Stubbed data access. The real implementation queries all four archivable
 * tables (projects, inspiration_boards, notes, resources) filtered by
 * is_archived = true and merges them (docs/DATABASE.md § Archive).
 */

export async function fetchArchive(): Promise<ArchiveEntry[]> {
  // TODO: implement — union the four archivable tables by is_archived = true
  return archiveFixtures;
}

export async function restoreEntry(sourceType: ArchiveSourceType, id: string): Promise<void> {
  // TODO: implement — set is_archived = false on the matching table
  void sourceType;
  void id;
  throw new Error("restoreEntry not implemented");
}

export async function deleteEntryPermanently(
  sourceType: ArchiveSourceType,
  id: string,
): Promise<void> {
  // TODO: implement — hard delete from the matching table
  void sourceType;
  void id;
  throw new Error("deleteEntryPermanently not implemented");
}
