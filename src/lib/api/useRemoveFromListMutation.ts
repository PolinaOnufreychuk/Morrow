import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";

/**
 * Optimistically drops a set of ids from a list cache while a mutation
 * (archive/delete/bulk variants) is in flight, rolling back on failure.
 * Shared across Projects/Inspiration/Notes/Resources so this cancel →
 * snapshot → optimistic-filter → rollback → invalidate shape is written once.
 */
export function useRemoveFromListMutation<
  TItem extends { id: string },
  TVariables extends string | string[],
>(listQueryKey: QueryKey, mutationFn: (variables: TVariables) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: listQueryKey });
      const previous = queryClient.getQueryData<TItem[]>(listQueryKey);
      const ids = new Set(Array.isArray(variables) ? variables : [variables]);
      queryClient.setQueryData<TItem[]>(listQueryKey, (old = []) =>
        old.filter((item) => !ids.has(item.id)),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listQueryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listQueryKey });
      queryClient.invalidateQueries({ queryKey: ["archive"] });
    },
  });
}
