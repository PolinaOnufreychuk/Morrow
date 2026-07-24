import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import type { ArchiveEntry, ArchiveSourceType } from "@/types/entities";
import { deleteEntryPermanently, emptyArchive, fetchArchive, restoreEntry } from "../api/archiveApi";

export function useArchive() {
  return useQuery({
    queryKey: queryKeys.archive.all(),
    queryFn: fetchArchive,
  });
}

export function useRestoreEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sourceType, id }: { sourceType: ArchiveSourceType; id: string }) =>
      restoreEntry(sourceType, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.archive.all() });
    },
  });
}

export function useDeleteEntryPermanently() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sourceType, id }: { sourceType: ArchiveSourceType; id: string }) =>
      deleteEntryPermanently(sourceType, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.archive.all() });
    },
  });
}

export function useEmptyArchive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entries: ArchiveEntry[]) => emptyArchive(entries),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.archive.all() });
    },
  });
}
