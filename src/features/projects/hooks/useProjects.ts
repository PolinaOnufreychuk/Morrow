import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import { useRemoveFromListMutation } from "@/lib/api/useRemoveFromListMutation";
import type { Project } from "@/types/entities";
import type { CreateProjectInput, UpdateProjectInput } from "../schema";
import {
  archiveProject,
  bulkDeleteProjects,
  createProject,
  deleteProject,
  getProject,
  listArchivedProjects,
  listProjects,
  unarchiveProject,
  updateProject,
} from "../api/projects.service";

/**
 * TanStack Query hooks — the only thing feature components talk to for
 * Projects data. All mutations are optimistic: the cache updates
 * immediately and rolls back on failure, so the UI never waits on the
 * (simulated) network round-trip to feel responsive.
 */

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.all(),
    queryFn: listProjects,
  });
}

/** Backs the Archive screen's Project rows. */
export function useArchivedProjects() {
  return useQuery({
    queryKey: queryKeys.archive.all(),
    queryFn: listArchivedProjects,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.projects.byId(id),
    queryFn: () => getProject(id),
    enabled: Boolean(id),
  });
}

type ProjectListContext = { previous?: Project[] };

function snapshotList(queryClient: ReturnType<typeof useQueryClient>): ProjectListContext {
  return { previous: queryClient.getQueryData<Project[]>(queryKeys.projects.all()) };
}

function rollbackList(
  queryClient: ReturnType<typeof useQueryClient>,
  context: ProjectListContext | undefined,
) {
  if (context?.previous) {
    queryClient.setQueryData(queryKeys.projects.all(), context.previous);
  }
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProjectInput) => createProject(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.projects.all() });
      const context = snapshotList(queryClient);
      const optimistic: Project = {
        ...input,
        id: `optimistic-${Date.now()}`,
        isArchived: false,
        archivedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Project[]>(queryKeys.projects.all(), (old = []) => [
        optimistic,
        ...old,
      ]);
      return context;
    },
    onError: (_error, _input, context) => rollbackList(queryClient, context),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProjectInput) => updateProject(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.projects.all() });
      await queryClient.cancelQueries({ queryKey: queryKeys.projects.byId(input.id) });
      const context = snapshotList(queryClient);
      const previousDetail = queryClient.getQueryData<Project | null>(
        queryKeys.projects.byId(input.id),
      );
      const patch = { ...input, updatedAt: new Date().toISOString() };
      queryClient.setQueryData<Project[]>(queryKeys.projects.all(), (old = []) =>
        old.map((project) => (project.id === input.id ? { ...project, ...patch } : project)),
      );
      if (previousDetail) {
        queryClient.setQueryData(queryKeys.projects.byId(input.id), {
          ...previousDetail,
          ...patch,
        });
      }
      return { ...context, previousDetail, id: input.id };
    },
    onError: (_error, _input, context) => {
      rollbackList(queryClient, context);
      if (context?.previousDetail) {
        queryClient.setQueryData(queryKeys.projects.byId(context.id), context.previousDetail);
      }
    },
    onSettled: (_data, _error, input) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.byId(input.id) });
    },
  });
}

export function useArchiveProject() {
  return useRemoveFromListMutation<Project, string>(queryKeys.projects.all(), (id) =>
    archiveProject(id),
  );
}

export function useDeleteProject() {
  return useRemoveFromListMutation<Project, string>(queryKeys.projects.all(), (id) =>
    deleteProject(id),
  );
}

export function useBulkDeleteProjects() {
  return useRemoveFromListMutation<Project, string[]>(queryKeys.projects.all(), (ids) =>
    bulkDeleteProjects(ids),
  );
}

/** Restore a project from the Archive screen — not a list-removal shape. */
export function useUnarchiveProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unarchiveProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.archive.all() });
    },
  });
}
