import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import {
  archiveNote,
  createNote,
  deleteNote,
  fetchNoteById,
  fetchNotes,
  updateNote,
} from "../api/notesApi";

export function useNotes() {
  return useQuery({
    queryKey: queryKeys.notes.all(),
    queryFn: fetchNotes,
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: queryKeys.notes.byId(id),
    queryFn: () => fetchNoteById(id),
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
    mutationFn: updateNote,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.byId(variables.id) });
    },
  });
}

export function useArchiveNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: archiveNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.archive.all() });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.all() });
    },
  });
}
