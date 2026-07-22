import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import {
  addReferences,
  archiveBoard,
  createBoard,
  fetchBoardById,
  fetchBoardReferences,
  fetchBoards,
  removeReferences,
  updateBoard,
  type AddReferenceInput,
} from "../api/inspirationApi";

export function useBoards() {
  return useQuery({
    queryKey: queryKeys.inspirationBoards.all(),
    queryFn: fetchBoards,
  });
}

export function useBoard(id: string) {
  return useQuery({
    queryKey: queryKeys.inspirationBoards.byId(id),
    queryFn: () => fetchBoardById(id),
    enabled: Boolean(id),
  });
}

export function useBoardReferences(boardId: string) {
  return useQuery({
    queryKey: queryKeys.inspirationBoards.references(boardId),
    queryFn: () => fetchBoardReferences(boardId),
    enabled: Boolean(boardId),
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inspirationBoards.all() });
    },
  });
}

export function useUpdateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBoard,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inspirationBoards.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inspirationBoards.byId(variables.id) });
    },
  });
}

export function useArchiveBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: archiveBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inspirationBoards.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.archive.all() });
    },
  });
}

export function useAddReferences(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inputs: AddReferenceInput[]) => addReferences(boardId, inputs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inspirationBoards.references(boardId) });
    },
  });
}

export function useRemoveReferences(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => removeReferences(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inspirationBoards.references(boardId) });
    },
  });
}
