import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import { useRemoveFromListMutation } from "@/lib/api/useRemoveFromListMutation";
import type { Note } from "@/types/entities";
import type { UpdateNoteInput } from "../types";
import {
  archiveNote,
  createNote,
  deleteNote,
  getNote,
  listArchivedNotes,
  listNotes,
  unarchiveNote,
  updateNote,
} from "../api/notes.service";

export function useNotes() {
  return useQuery({
    queryKey: queryKeys.notes.all(),
    queryFn: listNotes,
  });
}

/** Backs the Archive screen's Note rows. */
export function useArchivedNotes() {
  return useQuery({
    queryKey: queryKeys.archive.all(),
    queryFn: listArchivedNotes,
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: queryKeys.notes.byId(id),
    queryFn: () => getNote(id),
    enabled: Boolean(id),
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.all() });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateNoteInput) => updateNote(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.byId(variables.id) });
    },
  });
}

export function useArchiveNote() {
  return useRemoveFromListMutation<Note, string>(queryKeys.notes.all(), (id) => archiveNote(id));
}

export function useDeleteNote() {
  return useRemoveFromListMutation<Note, string>(queryKeys.notes.all(), (id) => deleteNote(id));
}

/** Restore a note from the Archive screen — not a list-removal shape. */
export function useUnarchiveNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unarchiveNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.archive.all() });
    },
  });
}
