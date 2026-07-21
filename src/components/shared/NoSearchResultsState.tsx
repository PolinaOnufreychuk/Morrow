import { EmptyState } from "./EmptyState";

export interface NoSearchResultsStateProps {
  query: string;
  className?: string;
}

/** Distinct from EmptyState: the list has items, they just don't match. */
export function NoSearchResultsState({ query, className }: NoSearchResultsStateProps) {
  return (
    <EmptyState
      className={className}
      title="No results found"
      description={`Nothing matches “${query}”. Try a different search term.`}
    />
  );
}
