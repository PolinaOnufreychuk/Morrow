import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import { useRemoveFromListMutation } from "@/lib/api/useRemoveFromListMutation";
import type { InspirationBoard } from "@/types/entities";
import type { UpdateBoardInput } from "../schema";
import {
  addReferences,
  archiveBoard,
  createBoard,
  deleteBoard,
  getBoard,
  listArchivedBoards,
  listBoards,
  listReferences,
  removeReferences,
  unarchiveBoard,
  updateBoard,
  type AddReferenceInput,
} from "../api/inspiration.service";

export function useBoards() {
  return useQuery({
    queryKey: queryKeys.inspirationBoards.all(),
    queryFn: listBoards,
  });
}

/** Backs the Archive screen's Inspiration board rows. */
export function useArchivedBoards() {
  return useQuery({
    queryKey: queryKeys.archive.all(),
    queryFn: listArchivedBoards,
  });
}

export function useBoard(id: string) {
  return useQuery({
    queryKey: queryKeys.inspirationBoards.byId(id),
    queryFn: () => getBoard(id),
    enabled: Boolean(id),
  });
}

export function useBoardReferences(boardId: string) {
  return useQuery({
    queryKey: queryKeys.inspirationBoards.references(boardId),
    queryFn: () => listReferences(boardId),
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
    mutationFn: (input: UpdateBoardInput) => updateBoard(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inspirationBoards.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.inspirationBoards.byId(variables.id) });
    },
  });
}

export function useArchiveBoard() {
  return useRemoveFromListMutation<InspirationBoard, string>(
    queryKeys.inspirationBoards.all(),
    (id) => archiveBoard(id),
  );
}

export function useDeleteBoard() {
  return useRemoveFromListMutation<InspirationBoard, string>(
    queryKeys.inspirationBoards.all(),
    (id) => deleteBoard(id),
  );
}

/** Restore a board from the Archive screen — not a list-removal shape. */
export function useUnarchiveBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unarchiveBoard(id),
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
