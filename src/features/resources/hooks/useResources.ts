import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import {
  archiveResource,
  createResource,
  deleteResource,
  fetchResourceById,
  fetchResources,
  updateResource,
} from "../api/resourcesApi";

export function useResources() {
  return useQuery({
    queryKey: queryKeys.resources.all(),
    queryFn: fetchResources,
  });
}

export function useResource(id: string) {
  return useQuery({
    queryKey: queryKeys.resources.byId(id),
    queryFn: () => fetchResourceById(id),
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
    mutationFn: updateResource,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.byId(variables.id) });
    },
  });
}

export function useArchiveResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: archiveResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.archive.all() });
    },
  });
}

export function useDeleteResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.all() });
    },
  });
}
