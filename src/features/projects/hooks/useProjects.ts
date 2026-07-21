import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import {
  archiveProject,
  createProject,
  deleteProject,
  fetchProjectById,
  fetchProjects,
  updateProject,
} from "../api/projectsApi";

/**
 * TanStack Query hooks wrapping the stub api. The query/mutation shape is
 * real (keys, invalidation) even though the data is still fixtures.
 */

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.all(),
    queryFn: fetchProjects,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.projects.byId(id),
    queryFn: () => fetchProjectById(id),
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProject,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.byId(variables.id) });
    },
  });
}

export function useArchiveProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: archiveProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.archive.all() });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
  });
}
