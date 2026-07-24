import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import { useRemoveFromListMutation } from "@/lib/api/useRemoveFromListMutation";
import type { Resource } from "@/types/entities";
import type { UpdateResourceInput } from "../types";
import {
  archiveResource,
  createResource,
  deleteResource,
  getResource,
  listArchivedResources,
  listResources,
  unarchiveResource,
  updateResource,
} from "../api/resources.service";

export function useResources() {
  return useQuery({
    queryKey: queryKeys.resources.all(),
    queryFn: listResources,
  });
}

/** Backs the Archive screen's Resource rows. */
export function useArchivedResources() {
  return useQuery({
    queryKey: queryKeys.archive.all(),
    queryFn: listArchivedResources,
  });
}

export function useResource(id: string) {
  return useQuery({
    queryKey: queryKeys.resources.byId(id),
    queryFn: () => getResource(id),
    enabled: Boolean(id),
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.all() });
    },
  });
}

export function useUpdateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateResourceInput) => updateResource(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.byId(variables.id) });
    },
  });
}

export function useArchiveResource() {
  return useRemoveFromListMutation<Resource, string>(queryKeys.resources.all(), (id) =>
    archiveResource(id),
  );
}

export function useDeleteResource() {
  return useRemoveFromListMutation<Resource, string>(queryKeys.resources.all(), (id) =>
    deleteResource(id),
  );
}

/** Restore a resource from the Archive screen — not a list-removal shape. */
export function useUnarchiveResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unarchiveResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.archive.all() });
    },
  });
}
